import { db } from "@/db/drizzle"
import { planToWebsiteCount } from "@/lib/utils"
import { users, websites } from "@/migrations/schema"
import { asc, desc, eq } from "drizzle-orm"

export async function POST(request: Request) {
  const body = await request.json()
  const newPlan = body.data.items[body.data.items.length - 1].plan.slug
  const clerkUserId = body.data.payer.user_id

  console.log("[plan-change] Webhook received", { clerkUserId, newPlan })

  // Get user
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

  // Update plan
  await db
    .update(users)
    .set({ plan: newPlan })
    .where(eq(users.clerkUserId, clerkUserId))

  console.log("[plan-change] Plan updated", { userId: user.id, newPlan })

  // Enforce website limit for new plan
  const limit = planToWebsiteCount(newPlan)

  console.log("[plan-change] Website limit for plan", { plan: newPlan, limit })

  // Get all user's websites ordered by creation date (keep oldest)
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
  } else {
    console.log("[plan-change] No websites to disable", {
      count: userWebsites.length,
      limit,
    })
  }

  console.log("[plan-change] Webhook handled successfully", {
    userId: user.id,
    newPlan,
  })
  return Response.json({ message: "Updated plan" })
}
