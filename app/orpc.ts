import { authMiddleware } from "@/middlewares/protected"
import { os } from "@orpc/server"

// export const publicProcedure = os.use()

export const protectedProcedure = os.use(authMiddleware)
