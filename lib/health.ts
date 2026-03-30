import "server-only"

import { db } from "@/db/drizzle"
import { sql } from "drizzle-orm"
import Redis from "ioredis"

type ComponentStatus = "operational" | "degraded" | "outage"

export type HealthComponent = {
  key: "scanning" | "reports" | "billing" | "notifications"
  status: ComponentStatus
  detail: string
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
    console.error("[health] valkey error", error)
  })

  return redisClient
}

async function checkDatabase() {
  try {
    await db.execute(sql`select 1`)
    return true
  } catch (error) {
    console.error("[health] database check failed", error)
    return false
  }
}

async function checkValkey() {
  const redis = getRedisClient()

  if (!redis) {
    return {
      ok: false,
      detail: "VALKEY_URL is not configured; cache-backed delivery tracking is degraded.",
    }
  }

  try {
    await redis.ping()
    return {
      ok: true,
      detail: "Delivery cache and rate limiting are responding normally.",
    }
  } catch (error) {
    console.error("[health] valkey ping failed", error)
    return {
      ok: false,
      detail: "Valkey is unavailable; caching and rate limiting are degraded.",
    }
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
  const [databaseOk, valkey] = await Promise.all([checkDatabase(), checkValkey()])

  const components: HealthComponent[] = [
    {
      key: "scanning",
      status: databaseOk ? "operational" : "outage",
      detail: databaseOk
        ? "Database connectivity is healthy for scheduled and manual scans."
        : "Database connectivity is failing, so scans cannot be recorded reliably.",
    },
    {
      key: "reports",
      status: databaseOk ? "operational" : "outage",
      detail: databaseOk
        ? "Reports can be read and generated with the current database connection."
        : "Reports are impacted because the database is unavailable.",
    },
    {
      key: "billing",
      status: "operational",
      detail: "Clerk Billing is the source of truth for subscription state and billing events.",
    },
    {
      key: "notifications",
      status: valkey.ok ? "operational" : "degraded",
      detail: valkey.detail,
    },
  ]

  return {
    status: summarizeStatus(components.map((component) => component.status)),
    checkedAt: new Date().toISOString(),
    components,
  }
}
