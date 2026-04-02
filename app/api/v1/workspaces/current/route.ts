import { db } from "@/db/drizzle"
import { getRequestLogger, withRequestId } from "@/lib/logger"
import { getPlanDefinition } from "@/lib/plans"
import { jsonWithCache } from "@/lib/response-cache"
import { requireApiKey } from "@/middlewares/api-key"
import {
  billingSubscriptions,
  scans,
  websites,
  workspaces,
} from "@/migrations/schema"
import { count, eq } from "drizzle-orm"

export async function GET(request: Request) {
  const log = getRequestLogger(request)
  const apiKey = await requireApiKey(request)

  if ("error" in apiKey && apiKey.error) {
    log.warn("[api-workspace-current] authentication failed")
    await log.flush()
    return withRequestId(request, apiKey.error)
  }

  try {
    const [workspace, subscription, websiteUsage, scanUsage] =
      await Promise.all([
        db.query.workspaces.findFirst({
          where: eq(workspaces.id, apiKey.auth.workspaceId),
        }),
        db.query.billingSubscriptions.findFirst({
          where: eq(billingSubscriptions.workspaceId, apiKey.auth.workspaceId),
        }),
        db
          .select({ count: count() })
          .from(websites)
          .where(eq(websites.workspaceId, apiKey.auth.workspaceId)),
        db
          .select({ count: count() })
          .from(scans)
          .innerJoin(websites, eq(websites.id, scans.websiteId))
          .where(eq(websites.workspaceId, apiKey.auth.workspaceId)),
      ])

    if (!workspace) {
      log.warn("[api-workspace-current] workspace not found", {
        workspaceId: apiKey.auth.workspaceId,
        apiKeyId: apiKey.auth.id,
      })
      await log.flush()
      return withRequestId(
        request,
        jsonWithCache(
        { error: "workspace_not_found" },
        { status: 404 },
        "private-short"
        )
      )
    }

    const plan = getPlanDefinition(subscription?.planSlug ?? "free_user")

    log.info("[api-workspace-current] returned workspace summary", {
      workspaceId: workspace.id,
      apiKeyId: apiKey.auth.id,
      planSlug: plan.slug,
      websiteUsage: websiteUsage[0]?.count ?? 0,
      scanUsage: scanUsage[0]?.count ?? 0,
    })
    await log.flush()

    return withRequestId(
      request,
      jsonWithCache(
      {
        workspace: {
          id: workspace.id,
          name: workspace.name,
          slug: workspace.slug,
          preferredLocale: workspace.preferredLocale,
          plan: plan.slug,
          planLabel: plan.label,
        },
        usage: {
          websites: websiteUsage[0]?.count ?? 0,
          websiteLimit: plan.websiteLimit,
          scans: scanUsage[0]?.count ?? 0,
        },
        apiKey: {
          label: apiKey.auth.label,
          prefix: apiKey.auth.keyPrefix,
        },
      },
      undefined,
      "private-short"
      )
    )
  } catch (error) {
    log.error("[api-workspace-current] failed to build workspace summary", error, {
      workspaceId: apiKey.auth.workspaceId,
      apiKeyId: apiKey.auth.id,
    })
    await log.flush()
    return withRequestId(
      request,
      Response.json({ error: "internal_error" }, { status: 500 })
    )
  }
}
