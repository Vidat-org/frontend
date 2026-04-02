import { db } from "@/db/drizzle"
import { getRequestLogger, withRequestId } from "@/lib/logger"
import { jsonWithCache } from "@/lib/response-cache"
import { requireApiKey } from "@/middlewares/api-key"
import { scans, websites } from "@/migrations/schema"
import { and, desc, eq } from "drizzle-orm"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const log = getRequestLogger(request)
  const apiKey = await requireApiKey(request)

  if ("error" in apiKey && apiKey.error) {
    log.warn("[api-latest-scan] authentication failed")
    await log.flush()
    return withRequestId(request, apiKey.error)
  }

  try {
    const { id } = await params

    const result = await db
      .select({ scan: scans })
      .from(scans)
      .innerJoin(websites, eq(websites.id, scans.websiteId))
      .where(
        and(
          eq(scans.websiteId, id),
          eq(websites.workspaceId, apiKey.auth.workspaceId)
        )
      )
      .orderBy(desc(scans.createdAt))
      .limit(1)

    if (!result[0]) {
      log.warn("[api-latest-scan] scan not found", {
        websiteId: id,
        workspaceId: apiKey.auth.workspaceId,
        apiKeyId: apiKey.auth.id,
      })
      await log.flush()
      return withRequestId(
        request,
        jsonWithCache(
        { error: "scan_not_found" },
        { status: 404 },
        "private-short"
        )
      )
    }

    log.info("[api-latest-scan] returned latest scan", {
      websiteId: id,
      scanId: result[0].scan.id,
      workspaceId: apiKey.auth.workspaceId,
      apiKeyId: apiKey.auth.id,
    })
    await log.flush()

    return withRequestId(
      request,
      jsonWithCache({ data: result[0].scan }, undefined, "private-short")
    )
  } catch (error) {
    log.error("[api-latest-scan] failed to fetch latest scan", error, {
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
