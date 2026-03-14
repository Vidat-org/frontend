import { auth } from "@clerk/nextjs/server"
import { ORPCError, os } from "@orpc/server"
import { db } from "@/db/drizzle"
import { users } from "@/migrations/schema"
import { eq } from "drizzle-orm"

export const authMiddleware = os.$context().middleware(async ({ next }) => {
  const { isAuthenticated, userId: clerkUserId } = await auth()

  if (!isAuthenticated || !clerkUserId) {
    throw new ORPCError("UNAUTHORIZED")
  }

  let user = await db.query.users.findFirst({
    where: eq(users.clerkUserId, clerkUserId),
  })

  // Optional but recommended: auto-create user
  if (!user) {
    const inserted = await db
      .insert(users)
      .values({
        clerkUserId: clerkUserId,
      })
      .returning()

    user = inserted[0]
  }

  const result = await next({
    context: {
      userId: user.id, // internal id (usr_xxx)
      clerkUserId: clerkUserId,
      plan: user.plan,
    },
  })

  return result
})
