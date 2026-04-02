import { db } from "@/db/drizzle"
import { getRequestLogger, withRequestId } from "@/lib/logger"
import { users } from "@/migrations/schema"
import { verifyWebhook } from "@clerk/nextjs/webhooks"
import { eq } from "drizzle-orm"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  const log = getRequestLogger(req)

  try {
    const evt = await verifyWebhook(req, {
      signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET_USERS,
    })

    const eventType = evt.type
    log.info("[users-webhook] received", {
      eventType,
      clerkUserId: evt.data.id ?? null,
    })

    switch (eventType) {
      case "user.created":
        await db
          .insert(users)
          .values({
            clerkUserId: evt.data.id,
            email:
              evt.data.email_addresses?.[0]?.email_address?.toLowerCase() ??
              null,
            plan: "free_user",
          })
          .onConflictDoNothing()
        break
      case "user.updated":
        await db
          .update(users)
          .set({
            email:
              evt.data.email_addresses?.[0]?.email_address?.toLowerCase() ??
              null,
          })
          .where(eq(users.clerkUserId, evt.data.id))
        break
      case "user.deleted":
        if (evt.data.id) {
          await db.delete(users).where(eq(users.clerkUserId, evt.data.id))
        }
        break
    }

    await log.flush()
    return withRequestId(req, new Response("Webhook received", { status: 200 }))
  } catch (err) {
    log.error("[users-webhook] verification failed", err)
    await log.flush()
    return withRequestId(
      req,
      new Response("Error verifying webhook", { status: 400 })
    )
  }
}
