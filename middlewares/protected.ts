import { auth } from "@clerk/nextjs/server"
import { ORPCError, os } from "@orpc/server"

export const authMiddleware = os
  .$context() // <-- define dependent-context
  .middleware(async ({ next }) => {
    const { isAuthenticated, userId } = await auth()

    if (!isAuthenticated) {
      throw new ORPCError("UNAUTHORIZED")
    }

    const result = await next({
      context: {
        userId: userId,
      },
    })

    // Execute logic after the handler

    return result
  })
