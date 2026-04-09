import "server-only"

import { db } from "@/db/drizzle"
import { sql } from "drizzle-orm"
import Redis from "ioredis"
import { logger } from "./logger"

type ComponentStatus = "operational" | "degraded" | "outage"

type DependencyCheck = {
  ok: boolean
  detail: string
  detailKey: string
}

export type HealthComponent = {
  key: "scanning" | "reports" | "billing" | "notifications"
  status: ComponentStatus
  detail: string
  detailKey: string
}

export type SystemHealth = {
  status: ComponentStatus
  checkedAt: string
  components: HealthComponent[]
}

const valkeyUrl = process.env.VALKEY_URL

let redisClient: Redis | null | undefined

function getRedisClient() {
  if (redisClient !== undefined) {
    return redisClient
  }

  if (!valkeyUrl) {
    redisClient = null
    return redisClient
  }

  redisClient = new Redis(valkeyUrl, {
    maxRetriesPerRequest: 1,
  })

  redisClient.on("error", (error) => {
    logger.error("[health] valkey error", error)
  })

  return redisClient
}

async function checkDatabase() {
  try {
    await db.execute(sql`select 1`)
    return true
  } catch (error) {
    logger.error("[health] database check failed", error)
    return false
  }
}

async function checkValkey() {
  const redis = getRedisClient()

  if (!redis) {
    return {
      ok: false,
      detail:
        "VALKEY_URL is not configured; cache-backed delivery tracking is degraded.",
      detailKey: "status.detailNotificationsMissingCache",
    }
  }

  try {
    await redis.ping()
    return {
      ok: true,
      detail: "Delivery cache and rate limiting are responding normally.",
      detailKey: "status.detailNotificationsOperational",
    }
  } catch (error) {
    logger.error("[health] valkey ping failed", error)
    return {
      ok: false,
      detail: "Valkey is unavailable; caching and rate limiting are degraded.",
      detailKey: "status.detailNotificationsUnavailable",
    }
  }
}

function hasRequiredEnv(name: string) {
  return Boolean(process.env[name]?.trim())
}

function checkBilling(): DependencyCheck {
  const requiredWebhookSecrets = [
    "CLERK_WEBHOOK_SIGNING_SECRET_USERS",
    "CLERK_WEBHOOK_SIGNING_SECRET_ORGANIZATIONS",
    "CLERK_WEBHOOK_SIGNING_SECRET_UPDATE_PLAN",
  ]

  const missing = requiredWebhookSecrets.filter((key) => !hasRequiredEnv(key))

  if (missing.length > 0) {
    return {
      ok: false,
      detail:
        "Billing webhooks are not fully configured; subscription state can drift from Clerk.",
      detailKey: "status.detailBillingMissingWebhooks",
    }
  }

  return {
    ok: true,
    detail:
      "Clerk Billing webhooks are configured and subscription sync is ready.",
    detailKey: "status.detailBillingOperational",
  }
}

function checkNotificationDependencies(valkeyOk: boolean): DependencyCheck {
  const missingEmailEnv = ["RESEND_API_KEY", "SUPPORT_FROM_EMAIL"].filter(
    (key) => !hasRequiredEnv(key)
  )

  if (!valkeyOk && missingEmailEnv.length > 0) {
    return {
      ok: false,
      detail:
        "Valkey and email delivery are not fully configured; notifications are degraded.",
      detailKey: "status.detailNotificationsMissingCacheAndEmail",
    }
  }

  if (!valkeyOk) {
    return {
      ok: false,
      detail: "Valkey is unavailable; caching and rate limiting are degraded.",
      detailKey: "status.detailNotificationsUnavailable",
    }
  }

  if (missingEmailEnv.length > 0) {
    return {
      ok: false,
      detail:
        "Email delivery is not fully configured; webhook and Slack flows may work but support email is degraded.",
      detailKey: "status.detailNotificationsMissingEmail",
    }
  }

  return {
    ok: true,
    detail: "Delivery cache, rate limiting, and email dependencies are ready.",
    detailKey: "status.detailNotificationsOperational",
  }
}

function summarizeStatus(statuses: ComponentStatus[]): ComponentStatus {
  if (statuses.includes("outage")) {
    return "outage"
  }

  if (statuses.includes("degraded")) {
    return "degraded"
  }

  return "operational"
}

export async function getSystemHealth(): Promise<SystemHealth> {
  const [databaseOk, valkey] = await Promise.all([
    checkDatabase(),
    checkValkey(),
  ])
  const billing = checkBilling()
  const notifications = checkNotificationDependencies(valkey.ok)

  const components: HealthComponent[] = [
    {
      key: "scanning",
      status: databaseOk ? "operational" : "outage",
      detail: databaseOk
        ? "Database connectivity is healthy for scheduled and manual scans."
        : "Database connectivity is failing, so scans cannot be recorded reliably.",
      detailKey: databaseOk
        ? "status.detailScanningOperational"
        : "status.detailScanningOutage",
    },
    {
      key: "reports",
      status: databaseOk ? "operational" : "outage",
      detail: databaseOk
        ? "Reports can be read and generated with the current database connection."
        : "Reports are impacted because the database is unavailable.",
      detailKey: databaseOk
        ? "status.detailReportsOperational"
        : "status.detailReportsOutage",
    },
    {
      key: "billing",
      status: billing.ok ? "operational" : "degraded",
      detail: billing.detail,
      detailKey: billing.detailKey,
    },
    {
      key: "notifications",
      status: notifications.ok ? "operational" : "degraded",
      detail: notifications.detail,
      detailKey: notifications.detailKey,
    },
  ]

  return {
    status: summarizeStatus(components.map((component) => component.status)),
    checkedAt: new Date().toISOString(),
    components,
  }
}
