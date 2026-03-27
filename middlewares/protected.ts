import { auth } from "@clerk/nextjs/server"
import { ORPCError, os } from "@orpc/server"
import { db } from "@/db/drizzle"
import {
  billingSubscriptions,
  onboardingStates,
  users,
  workspaceMembers,
  workspaces,
} from "@/migrations/schema"
import { and, eq } from "drizzle-orm"
import { normalizePlanSlug } from "@/lib/plans"

function defaultWorkspaceName(clerkUserId: string) {
  const suffix = clerkUserId.slice(-6).toLowerCase()
  return `Workspace ${suffix}`
}

export const authMiddleware = os.$context().middleware(async ({ next }) => {
  const { isAuthenticated, userId: clerkUserId } = await auth()

  if (!isAuthenticated || !clerkUserId) {
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
    throw new ORPCError("UNAUTHORIZED")
  }

  const currentUser = user

  let activeWorkspaceId = currentUser.activeWorkspaceId
  let membership =
    activeWorkspaceId
      ? await db.query.workspaceMembers.findFirst({
          where: and(
            eq(workspaceMembers.userId, currentUser.id),
            eq(workspaceMembers.workspaceId, activeWorkspaceId)
          ),
        })
      : null

  if (!membership) {
    const existingMembership = await db.query.workspaceMembers.findFirst({
      where: eq(workspaceMembers.userId, currentUser.id),
    })

    if (existingMembership) {
      activeWorkspaceId = existingMembership.workspaceId
      membership = existingMembership
    } else {
      const createdWorkspace = await db.transaction(async (tx) => {
        const [workspace] = await tx
          .insert(workspaces)
          .values({
            name: defaultWorkspaceName(clerkUserId),
            slug: `ws-${currentUser.id.toLowerCase()}`,
            ownerUserId: currentUser.id,
          })
          .returning()

        await tx.insert(workspaceMembers).values({
          workspaceId: workspace.id,
          userId: currentUser.id,
          role: "owner",
        })

        await tx.insert(onboardingStates).values({
          workspaceId: workspace.id,
        })

        await tx.insert(billingSubscriptions).values({
          workspaceId: workspace.id,
          provider: "manual",
          planSlug: normalizePlanSlug(currentUser.plan),
          status: "trialing",
          amountSek: 0,
        })

        return workspace
      })

      activeWorkspaceId = createdWorkspace.id
      membership = {
        id: "",
        workspaceId: createdWorkspace.id,
        userId: currentUser.id,
        role: "owner",
        joinedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      }
    }

    const updated = await db
      .update(users)
      .set({ activeWorkspaceId })
      .where(eq(users.id, currentUser.id))
      .returning()

    user = updated[0] ?? user
  }

  const workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.id, activeWorkspaceId!),
  })

  if (!workspace || !membership) {
    throw new ORPCError("FORBIDDEN")
  }

  const result = await next({
    context: {
      userId: user.id,
      clerkUserId,
      plan: normalizePlanSlug(user.plan),
      workspaceId: workspace.id,
      workspaceRole: membership.role,
      workspaceName: workspace.name,
    },
  })

  return result
})
