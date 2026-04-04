import { db } from "@/db/drizzle"
import { invalidateCacheTags, workspaceTag } from "@/lib/cache"
import { getRequestLogger, withRequestId } from "@/lib/logger"
import { workspaces } from "@/migrations/schema"
import { verifyWebhook } from "@clerk/nextjs/webhooks"
import { eq } from "drizzle-orm"
import { NextRequest } from "next/server"

type ClerkOrganizationWebhookData = {
  id?: string | null
  name?: string | null
  slug?: string | null
}

export async function POST(request: NextRequest) {
  const log = getRequestLogger(request)

  try {
    const evt = await verifyWebhook(request, {
      signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET_ORGANIZATIONS,
    })

    const eventType = evt.type
    const data = evt.data as ClerkOrganizationWebhookData
    const clerkOrganizationId = data.id ?? null

    log.info("[organizations-webhook] received", {
      eventType,
      clerkOrganizationId,
    })

    if (!clerkOrganizationId) {
      await log.flush()
      return withRequestId(
        request,
        Response.json({ message: "Missing organization id" }, { status: 400 })
      )
    }

    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.clerkOrganizationId, clerkOrganizationId),
    })

    switch (eventType) {
      case "organization.updated": {
        if (!workspace) {
          log.info("[organizations-webhook] workspace not found for update", {
            clerkOrganizationId,
          })
          break
        }

        await db
          .update(workspaces)
          .set({
            name: data.name ?? workspace.name,
            slug: data.slug ?? workspace.slug,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(workspaces.id, workspace.id))

        await invalidateCacheTags([workspaceTag(workspace.id)])
        log.info("[organizations-webhook] workspace updated", {
          workspaceId: workspace.id,
          clerkOrganizationId,
        })
        break
      }

      case "organization.deleted": {
        if (!workspace) {
          log.info("[organizations-webhook] workspace already absent", {
            clerkOrganizationId,
          })
          break
        }

        await db.delete(workspaces).where(eq(workspaces.id, workspace.id))
        await invalidateCacheTags([workspaceTag(workspace.id)])

        log.info("[organizations-webhook] workspace deleted", {
          workspaceId: workspace.id,
          clerkOrganizationId,
        })
        break
      }

      default:
        log.info("[organizations-webhook] ignored event", {
          eventType,
          clerkOrganizationId,
        })
        break
    }

    await log.flush()
    return withRequestId(
      request,
      Response.json({ message: "Webhook received" }, { status: 200 })
    )
  } catch (error) {
    log.error("[organizations-webhook] verification failed", error)
    await log.flush()
    return withRequestId(
      request,
      Response.json({ message: "Error verifying webhook" }, { status: 400 })
    )
  }
}
