import { auth } from "@clerk/nextjs/server"
import { ORPCError, os } from "@orpc/server"
import { db } from "@/db/drizzle"
import { logger } from "@/lib/logger"
import { users } from "@/migrations/schema"
import { eq } from "drizzle-orm"
import { normalizePlanSlug } from "@/lib/plans"
import {
  ensureWorkspaceForClerkOrganization,
  normalizeOrganizationRole,
} from "@/lib/clerk-organizations"
import { ensureWorkspaceBillingSubscription } from "@/lib/saas"

export const authMiddleware = os.$context().middleware(async ({ next }) => {
  const log = logger.child({
    route: "/rpc",
    middleware: "auth",
  })
  const {
    isAuthenticated,
    userId: clerkUserId,
    orgId: clerkOrganizationId,
    orgRole,
  } = await auth()

  if (!isAuthenticated || !clerkUserId) {
    log.warn("[rpc-auth] unauthenticated request")
    await log.flush()
    throw new ORPCError("UNAUTHORIZED")
  }

  let user = await db.query.users.findFirst({
    where: eq(users.clerkUserId, clerkUserId),
  })

  if (!user) {
    const inserted = await db
      .insert(users)
      .values({
        clerkUserId: clerkUserId,
        email: null,
        plan: "free_user",
      })
      .returning()

    user = inserted[0]
  }

  if (!user) {
    log.warn("[rpc-auth] user missing after upsert", {
      clerkUserId,
    })
    await log.flush()
    throw new ORPCError("UNAUTHORIZED")
  }

  if (!clerkOrganizationId) {
    log.warn("[rpc-auth] missing organization", {
      clerkUserId,
    })
    await log.flush()
    throw new ORPCError("FORBIDDEN")
  }

  const { workspace } = await ensureWorkspaceForClerkOrganization({
    clerkOrganizationId,
    ownerUserId: user.id,
    fallbackPlanSlug: user.plan,
  })

  const subscription = await ensureWorkspaceBillingSubscription({
    workspaceId: workspace.id,
    planSlug: user.plan,
  })

  const result = await next({
    context: {
      userId: user.id,
      clerkUserId,
      clerkOrganizationId,
      plan: normalizePlanSlug(subscription.planSlug ?? user.plan),
      workspaceId: workspace.id,
      workspaceRole: normalizeOrganizationRole(orgRole),
      workspaceName: workspace.name,
    },
  })

  return result
})
