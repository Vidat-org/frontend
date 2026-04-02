import { db } from "@/db/drizzle"
import { invalidateCacheTags, workspaceTag } from "@/lib/cache"
import { getRequestLogger, withRequestId } from "@/lib/logger"
import { updateWorkspaceBillingSubscription } from "@/lib/saas"
import { normalizePlanSlug, planToWebsiteCount } from "@/lib/plans"
import { websites, workspaces } from "@/migrations/schema"
import { verifyWebhook } from "@clerk/nextjs/webhooks"
import { desc, eq } from "drizzle-orm"
import { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const log = getRequestLogger(request)

  try {
    const evt = await verifyWebhook(request, {
      signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET_UPDATE_PLAN,
    })
    const payload = evt.data as {
      items?: Array<{
        status?: string | null
        plan?: { slug?: string | null; amount?: number | null } | null
      }> | null
      payer?: {
        user_id?: string | null
        organization_id?: string | null
      } | null
    }

    const activeItem =
      payload.items?.find((item) => item.status === "active") ??
      payload.items?.find((item) => item.status === "upcoming")

    const newPlan = normalizePlanSlug(activeItem?.plan?.slug)

    // Coerce empty string to null — Clerk sends "" instead of null for org payers
    const clerkOrganizationId = payload.payer?.organization_id || null

    if (!clerkOrganizationId) {
      return Response.json(
        { message: "Missing organization id" },
        { status: 400 }
      )
    }

    log.info("[plan-change] Webhook received", {
      clerkOrganizationId,
      newPlan,
    })

    // Find the workspace by organization ID
    const workspace = await db.query.workspaces.findFirst({
      where: eq(workspaces.clerkOrganizationId, clerkOrganizationId),
    })

    if (!workspace) {
      log.error("[plan-change] Workspace not found", undefined, {
        clerkOrganizationId,
      })
      await log.flush()
      return withRequestId(
        request,
        Response.json({ message: "Workspace not found" }, { status: 404 })
      )
    }

    log.info("[plan-change] Found workspace", {
      workspaceId: workspace.id,
      workspaceName: workspace.name,
      newPlan,
    })

    // Update workspace billing subscription
    await updateWorkspaceBillingSubscription({
      workspaceId: workspace.id,
      planSlug: newPlan,
      status: newPlan === "free_org" ? "trialing" : "active",
      provider: "clerk",
      providerCustomerId: clerkOrganizationId,
      amountSek: activeItem?.plan?.amount ?? 0,
    })

    const limit = planToWebsiteCount(newPlan)

    log.info("[plan-change] Website limit for plan", {
      plan: newPlan,
      limit,
    })

    // Fetch all websites for this workspace with their current status
    const workspaceWebsites = await db
      .select({
        id: websites.id,
        createdAt: websites.createdAt,
        isEnabled: websites.isEnabled,
      })
      .from(websites)
      .where(eq(websites.workspaceId, workspace.id))
      .orderBy(desc(websites.createdAt))

    log.info("[plan-change] Fetched workspace websites", {
      workspaceId: workspace.id,
      totalCount: workspaceWebsites.length,
      enabledCount: workspaceWebsites.filter((w) => w.isEnabled).length,
      disabledCount: workspaceWebsites.filter((w) => !w.isEnabled).length,
    })

    // Keep the newest websites (up to the limit), disable the rest
    const websitesToKeepActive = workspaceWebsites.slice(0, limit)
    const websitesToDisable = workspaceWebsites.slice(limit)

    // Track which websites need to change state
    const enableWebsites = websitesToKeepActive
      .filter((w) => !w.isEnabled)
      .map((w) => w.id)

    const disableWebsites = websitesToDisable
      .filter((w) => w.isEnabled)
      .map((w) => w.id)

    log.info("[plan-change] Website state changes needed", {
      toEnable: enableWebsites.length,
      toDisable: disableWebsites.length,
      keepActive: websitesToKeepActive.filter((w) => w.isEnabled).length,
      alreadyDisabled: websitesToDisable.filter((w) => !w.isEnabled).length,
    })

    // Enable websites that should be active but aren't
    if (enableWebsites.length > 0) {
      log.info("[plan-change] Enabling websites", { enableWebsites })

      for (const id of enableWebsites) {
        await db
          .update(websites)
          .set({ isEnabled: true })
          .where(eq(websites.id, id))

        log.info("[plan-change] Enabled website", { websiteId: id })
      }
    }

    // Disable websites that exceed the limit
    if (disableWebsites.length > 0) {
      log.info("[plan-change] Disabling excess websites", {
        disableWebsites,
      })

      for (const id of disableWebsites) {
        await db
          .update(websites)
          .set({ isEnabled: false })
          .where(eq(websites.id, id))

        log.info("[plan-change] Disabled website", { websiteId: id })
      }
    }

    // If no changes were needed, log that
    if (enableWebsites.length === 0 && disableWebsites.length === 0) {
      log.info("[plan-change] No website state changes needed", {
        totalWebsites: workspaceWebsites.length,
        limit,
        activeWebsites: workspaceWebsites.filter((w) => w.isEnabled).length,
      })
    }

    // Invalidate workspace cache
    await invalidateCacheTags([workspaceTag(workspace.id)])

    log.info("[plan-change] Webhook handled successfully", {
      workspaceId: workspace.id,
      newPlan,
      totalWebsites: workspaceWebsites.length,
      enabledWebsites: websitesToKeepActive.length,
      disabledWebsites: websitesToDisable.length,
      websitesEnabled: enableWebsites.length,
      websitesDisabled: disableWebsites.length,
    })

    await log.flush()
    return withRequestId(
      request,
      Response.json({
        message: "Updated plan for workspace",
        details: {
          workspaceId: workspace.id,
          plan: newPlan,
          websiteLimit: limit,
          totalWebsites: workspaceWebsites.length,
          enabledWebsites: websitesToKeepActive.length,
          disabledWebsites: websitesToDisable.length,
        },
      })
    )
  } catch (error) {
    log.error("[plan-change] Error verifying webhook", error)
    await log.flush()
    return withRequestId(
      request,
      Response.json({ message: "Invalid webhook" }, { status: 400 })
    )
  }
}
