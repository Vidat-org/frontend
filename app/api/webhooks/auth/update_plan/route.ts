import { db } from "@/db/drizzle"
import { invalidateCacheTags, userTag, workspaceTag } from "@/lib/cache"
import { updateWorkspaceBillingSubscription } from "@/lib/saas"
import { normalizePlanSlug, planToWebsiteCount } from "@/lib/plans"
import { users, websites, workspaceMembers } from "@/migrations/schema"
import { verifyWebhook } from "@clerk/nextjs/webhooks"
import { desc, eq } from "drizzle-orm"
import { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const evt = await verifyWebhook(request)
    const payload = evt.data as {
      items?: Array<{ plan?: { slug?: string | null } | null }> | null
      payer?: { user_id?: string | null } | null
    }
    const newPlan = normalizePlanSlug(
      payload.items?.[payload.items.length - 1]?.plan?.slug
    )
    const clerkUserId = payload.payer?.user_id

    if (!clerkUserId) {
      return Response.json({ message: "Missing payer user id" }, { status: 400 })
    }

    console.log("[plan-change] Webhook received", { clerkUserId, newPlan })

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, clerkUserId))

    if (!user) {
      console.error("[plan-change] User not found", { clerkUserId })
      return Response.json({ message: "User not found" }, { status: 404 })
    }

    console.log("[plan-change] Found user", {
      userId: user.id,
      currentPlan: user.plan,
      newPlan,
    })

    await db
      .update(users)
      .set({ plan: newPlan })
      .where(eq(users.clerkUserId, clerkUserId))

    const membership = await db.query.workspaceMembers.findFirst({
      where: eq(workspaceMembers.userId, user.id),
    })

    if (membership) {
      await updateWorkspaceBillingSubscription({
        workspaceId: membership.workspaceId,
        planSlug: newPlan,
        status: newPlan === "free_user" ? "trialing" : "active",
      })

      await invalidateCacheTags([
        workspaceTag(membership.workspaceId),
        userTag(user.id),
      ])
    }

    console.log("[plan-change] Plan updated", { userId: user.id, newPlan })

    const limit = planToWebsiteCount(newPlan)

    console.log("[plan-change] Website limit for plan", { plan: newPlan, limit })

    const userWebsites = await db
      .select({ id: websites.id })
      .from(websites)
      .where(eq(websites.userId, user.id))
      .orderBy(desc(websites.createdAt))

    console.log("[plan-change] Fetched user websites", {
      userId: user.id,
      count: userWebsites.length,
    })

    if (userWebsites.length > limit) {
      const toDisable = userWebsites.slice(limit).map((w) => w.id)

      console.log("[plan-change] Disabling excess websites", { toDisable })

      for (const id of toDisable) {
        await db
          .update(websites)
          .set({ isEnabled: false })
          .where(eq(websites.id, id))

        console.log("[plan-change] Disabled website", { websiteId: id })
      }

      console.log("[plan-change] Done disabling websites", {
        disabled: toDisable.length,
      })
    } else if (userWebsites.length > 0) {
      await db
        .update(websites)
        .set({ isEnabled: true })
        .where(eq(websites.userId, user.id))

      console.log("[plan-change] No websites to disable", {
        count: userWebsites.length,
        limit,
      })
    }

    if (membership) {
      await invalidateCacheTags([
        workspaceTag(membership.workspaceId),
        userTag(user.id),
      ])
    }

    console.log("[plan-change] Webhook handled successfully", {
      userId: user.id,
      newPlan,
    })

    return Response.json({ message: "Updated plan" })
  } catch (error) {
    console.error("[plan-change] Error verifying webhook", error)
    return Response.json({ message: "Invalid webhook" }, { status: 400 })
  }
}
