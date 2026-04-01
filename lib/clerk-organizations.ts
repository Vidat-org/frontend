import { db } from "@/db/drizzle"
import {
  billingSubscriptions,
  onboardingStates,
  workspaceSettings,
  workspaces,
} from "@/migrations/schema"
import { normalizePlanSlug } from "@/lib/plans"
import { clerkClient } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"

type AppWorkspaceRole = "admin" | "member"

export function normalizeOrganizationRole(
  role: string | null | undefined
): AppWorkspaceRole {
  if (!role) {
    return "member"
  }

  if (role === "org:admin" || role.endsWith(":admin")) {
    return "admin"
  }

  return "member"
}

export async function getClerkOrganization(organizationId: string) {
  const client = await clerkClient()

  return client.organizations.getOrganization({
    organizationId,
    includeMembersCount: true,
  })
}

export async function getPendingOrganizationInviteCount(organizationId: string) {
  const client = await clerkClient()
  const response = await client.organizations.getOrganizationInvitationList({
    organizationId,
    status: ["pending"],
    limit: 1,
  })

  return response.totalCount
}

export async function ensureWorkspaceForClerkOrganization(input: {
  clerkOrganizationId: string
  ownerUserId: string
  fallbackPlanSlug: string
}) {
  const organization = await getClerkOrganization(input.clerkOrganizationId)

  let workspace = await db.query.workspaces.findFirst({
    where: eq(workspaces.clerkOrganizationId, input.clerkOrganizationId),
  })

  if (!workspace) {
    const inserted = await db
      .insert(workspaces)
      .values({
        clerkOrganizationId: input.clerkOrganizationId,
        name: organization.name,
        slug: organization.slug,
        ownerUserId: input.ownerUserId,
      })
      .returning()

    workspace = inserted[0]
  } else if (
    workspace.name !== organization.name ||
    workspace.slug !== organization.slug
  ) {
    const updated = await db
      .update(workspaces)
      .set({
        name: organization.name,
        slug: organization.slug,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(workspaces.id, workspace.id))
      .returning()

    workspace = updated[0] ?? workspace
  }

  const existingOnboarding = await db.query.onboardingStates.findFirst({
    where: eq(onboardingStates.workspaceId, workspace.id),
  })

  if (!existingOnboarding) {
    await db.insert(onboardingStates).values({ workspaceId: workspace.id })
  }

  const existingSubscription = await db.query.billingSubscriptions.findFirst({
    where: eq(billingSubscriptions.workspaceId, workspace.id),
  })

  if (!existingSubscription) {
    await db.insert(billingSubscriptions).values({
      workspaceId: workspace.id,
      provider: "clerk",
      planSlug: normalizePlanSlug(input.fallbackPlanSlug),
      status:
        normalizePlanSlug(input.fallbackPlanSlug) === "free_user"
          ? "trialing"
          : "active",
      amountSek: 0,
    })
  }

  const existingSettings = await db.query.workspaceSettings.findFirst({
    where: eq(workspaceSettings.workspaceId, workspace.id),
  })

  if (!existingSettings) {
    await db.insert(workspaceSettings).values({ workspaceId: workspace.id })
  }

  return { workspace, organization }
}
