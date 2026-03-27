import { db } from "@/db/drizzle"
import {
  billingSubscriptions,
  onboardingStates,
  users,
  workspaceMembers,
  workspaces,
} from "@/migrations/schema"
import { eq } from "drizzle-orm"

export async function POST(request: Request) {
  const body = await request.json()
  const clerkUserId = body.data.id as string
  const email =
    typeof body.data.email_addresses?.[0]?.email_address === "string"
      ? body.data.email_addresses[0].email_address.toLowerCase()
      : null

  await db.transaction(async (tx) => {
    const insertedUsers = await tx
      .insert(users)
      .values({
        clerkUserId,
        email,
        plan: "free_user",
      })
      .returning()

    const user = insertedUsers[0]
    const insertedWorkspaces = await tx
      .insert(workspaces)
      .values({
        name: `Workspace ${clerkUserId.slice(-6).toLowerCase()}`,
        slug: `ws-${user.id.toLowerCase()}`,
        ownerUserId: user.id,
      })
      .returning()

    const workspace = insertedWorkspaces[0]

    await tx.insert(workspaceMembers).values({
      workspaceId: workspace.id,
      userId: user.id,
      role: "owner",
    })

    await tx.insert(onboardingStates).values({
      workspaceId: workspace.id,
    })

    await tx.insert(billingSubscriptions).values({
      workspaceId: workspace.id,
      provider: "manual",
      planSlug: "free_user",
      status: "trialing",
      amountSek: 0,
    })

    await tx
      .update(users)
      .set({ activeWorkspaceId: workspace.id })
      .where(eq(users.id, user.id))
  })

  return Response.json({ message: "created user" })
}
