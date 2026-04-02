import { db } from "@/db/drizzle"
import { getRequestLogger, withRequestId } from "@/lib/logger"
import { jsonWithCache } from "@/lib/response-cache"
import { requireApiKey } from "@/middlewares/api-key"
import { websites } from "@/migrations/schema"
import { desc, eq } from "drizzle-orm"

export async function GET(request: Request) {
  const log = getRequestLogger(request)
  const apiKey = await requireApiKey(request)

  if ("error" in apiKey && apiKey.error) {
    log.warn("[api-websites] authentication failed")
    await log.flush()
    return withRequestId(request, apiKey.error)
  }

  try {
    const rows = await db.query.websites.findMany({
      where: eq(websites.workspaceId, apiKey.auth.workspaceId),
      orderBy: desc(websites.createdAt),
    })

    log.info("[api-websites] listed websites", {
      workspaceId: apiKey.auth.workspaceId,
      count: rows.length,
      apiKeyId: apiKey.auth.id,
    })
    await log.flush()

    return withRequestId(
      request,
      jsonWithCache(
      {
        data: rows.map((website) => ({
          id: website.id,
          name: website.name,
          url: website.url,
          isEnabled: website.isEnabled,
          deviceType: website.deviceType,
          intervalSeconds: website.intervalSeconds,
          lastCheckedAt: website.lastCheckedAt,
          nextCheckAt: website.nextCheckAt,
          lastPerformanceScore: website.lastPerformanceScore,
          lastSeoScore: website.lastSeoScore,
          createdAt: website.createdAt,
        })),
      },
      undefined,
      "private-short"
      )
    )
  } catch (error) {
    log.error("[api-websites] failed to list websites", error, {
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
