import { db } from "@/db/drizzle"
import { requireApiKey } from "@/middlewares/api-key"
import { scans, websites } from "@/migrations/schema"
import { and, desc, eq } from "drizzle-orm"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const apiKey = await requireApiKey(request)

  if ("error" in apiKey) {
    return apiKey.error
  }

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
    return Response.json({ error: "scan_not_found" }, { status: 404 })
  }

  return Response.json({ data: result[0].scan })
}
