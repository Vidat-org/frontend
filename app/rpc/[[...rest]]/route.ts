import { RPCHandler } from "@orpc/server/fetch"
import { onError } from "@orpc/server"
import { router } from "@/app/router"
import { getRequestLogger, logger, withRequestId } from "@/lib/logger"

const handler = new RPCHandler(router, {
  interceptors: [
    onError((error) => {
      logger.error("[rpc] handler error", error)
    }),
  ],
})

async function handleRequest(request: Request) {
  const log = getRequestLogger(request)

  const { response } = await handler.handle(request, {
    prefix: "/rpc",
    context: {}, // Provide initial context if needed
  })

  if (!response) {
    log.warn("[rpc] route not found")
    await log.flush()
    return withRequestId(request, new Response("Not found", { status: 404 }))
  }

  if (response.status >= 500) {
    log.error("[rpc] server response", undefined, {
      status: response.status,
    })
  }

  await log.flush()
  return withRequestId(request, response)
}

export const HEAD = handleRequest
export const GET = handleRequest
export const POST = handleRequest
export const PUT = handleRequest
export const PATCH = handleRequest
export const DELETE = handleRequest
