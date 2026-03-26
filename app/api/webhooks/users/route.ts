import { db } from "@/db/drizzle"
import { users } from "@/migrations/schema"
import { verifyWebhook } from "@clerk/nextjs/webhooks"
import { eq } from "drizzle-orm"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)

    const eventType = evt.type

    switch (eventType) {
      case "user.created":
        await db
          .insert(users)
          .values({ clerkUserId: evt.data.id, plan: "free_user" })
      case "user.deleted":
        if (evt.data.id) {
          await db.delete(users).where(eq(users.clerkUserId, evt.data.id))
        }
    }

    return new Response("Webhook received", { status: 200 })
  } catch (err) {
    console.error("Error verifying webhook:", err)
    return new Response("Error verifying webhook", { status: 400 })
  }
}
