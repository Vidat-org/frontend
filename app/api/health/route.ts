import { getSystemHealth } from "@/lib/health"
import { getRequestLogger, withRequestId } from "@/lib/logger"
import { jsonWithCache } from "@/lib/response-cache"

export async function GET(request: Request) {
  const log = getRequestLogger(request)
  const health = await getSystemHealth()
  const statusCode =
    health.status === "operational"
      ? 200
      : health.status === "degraded"
      ? 206
      : 503

  if (health.status === "degraded") {
    log.warn("[health] degraded", {
      statusCode,
      components: health.components,
    })
    await log.flush()
  } else if (health.status === "outage") {
    log.error("[health] outage", undefined, {
      statusCode,
      components: health.components,
    })
    await log.flush()
  }

  return withRequestId(
    request,
    jsonWithCache(health, { status: statusCode }, "public-health")
  )
}
