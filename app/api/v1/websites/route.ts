import { db } from "@/db/drizzle"
import { requireApiKey } from "@/middlewares/api-key"
import { websites } from "@/migrations/schema"
import { desc, eq } from "drizzle-orm"

export async function GET(request: Request) {
  const apiKey = await requireApiKey(request)

  if ("error" in apiKey) {
    return apiKey.error
  }

  const rows = await db.query.websites.findMany({
    where: eq(websites.workspaceId, apiKey.auth.workspaceId),
    orderBy: desc(websites.createdAt),
  })

  return Response.json({
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
  })
}
