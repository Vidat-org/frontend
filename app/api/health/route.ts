import { getSystemHealth } from "@/lib/health"
import { jsonWithCache } from "@/lib/response-cache"

export async function GET() {
  const health = await getSystemHealth()
  const statusCode =
    health.status === "operational"
      ? 200
      : health.status === "degraded"
        ? 206
        : 503

  return jsonWithCache(health, { status: statusCode }, "public-health")
}
