import { getRequestLogger, withRequestId } from "@/lib/logger"

export async function POST(request: Request) {
  const log = getRequestLogger(request, {
    route: "/api/client-errors",
    channel: "client",
  })

  try {
    const payload = (await request.json()) as {
      name?: string
      message?: string
      digest?: string
      stack?: string
      pathname?: string
      userAgent?: string
    }

    log.error("[client-error] captured", undefined, {
      error: {
        name: payload.name ?? "Error",
        message: payload.message ?? "Unknown client error",
        stack: payload.stack,
      },
      digest: payload.digest ?? null,
      pathname: payload.pathname ?? null,
      userAgent: payload.userAgent ?? null,
    })
    await log.flush()

    return withRequestId(
      request,
      new Response(null, {
        status: 204,
      })
    )
  } catch (error) {
    log.error("[client-error] failed to parse payload", error)
    await log.flush()

    return withRequestId(
      request,
      Response.json({ error: "invalid_payload" }, { status: 400 })
    )
  }
}
