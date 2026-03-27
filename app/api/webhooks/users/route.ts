import { db } from "@/db/drizzle"
import {
  billingSubscriptions,
  onboardingStates,
  users,
  workspaceMembers,
  workspaces,
} from "@/migrations/schema"
import { verifyWebhook } from "@clerk/nextjs/webhooks"
import { eq } from "drizzle-orm"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)

    const eventType = evt.type

    switch (eventType) {
      case "user.created":
        await db.transaction(async (tx) => {
          const insertedUsers = await tx
            .insert(users)
            .values({
              clerkUserId: evt.data.id,
              email: evt.data.email_addresses?.[0]?.email_address?.toLowerCase() ?? null,
              plan: "free_user",
            })
            .returning()

          const user = insertedUsers[0]
          const insertedWorkspaces = await tx
            .insert(workspaces)
            .values({
              name: `Workspace ${evt.data.id.slice(-6).toLowerCase()}`,
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
        break
      case "user.updated":
        await db
          .update(users)
          .set({
            email: evt.data.email_addresses?.[0]?.email_address?.toLowerCase() ?? null,
          })
          .where(eq(users.clerkUserId, evt.data.id))
        break
      case "user.deleted":
        if (evt.data.id) {
          await db.delete(users).where(eq(users.clerkUserId, evt.data.id))
        }
        break
    }

    return new Response("Webhook received", { status: 200 })
  } catch (err) {
    console.error("Error verifying webhook:", err)
    return new Response("Error verifying webhook", { status: 400 })
  }
}
