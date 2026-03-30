import { getSystemHealth } from "@/lib/health"

export async function GET() {
  const health = await getSystemHealth()
  const statusCode =
    health.status === "operational"
      ? 200
      : health.status === "degraded"
        ? 206
        : 503

  return Response.json(health, { status: statusCode })
}
