import { db } from "@/db/drizzle"
import {
  auditLogs,
  billingSubscriptions,
  notificationDeliveries,
  onboardingStates,
} from "@/migrations/schema"
import { normalizePlanSlug } from "./plans"
import { eq } from "drizzle-orm"
import { invalidateCacheTags, workspaceTag } from "./cache"

export function getBillingLinks(planSlug: string) {
  const normalized = normalizePlanSlug(planSlug)

  return {
    manageUrl:
      process.env.NEXT_PUBLIC_BILLING_PORTAL_URL ??
      process.env.NEXT_PUBLIC_BILLING_PORTAL_FALLBACK_URL ??
      null,
    checkout: {
      starter: process.env.NEXT_PUBLIC_CHECKOUT_STARTER_URL ?? null,
      pro: process.env.NEXT_PUBLIC_CHECKOUT_PRO_URL ?? null,
      enterprise: process.env.NEXT_PUBLIC_CHECKOUT_ENTERPRISE_URL ?? null,
    },
    recommendedUpgrade:
      normalized === "free_user"
        ? "starter"
        : normalized === "starter"
          ? "pro"
          : "enterprise",
  }
}

export async function ensureOnboardingState(workspaceId: string) {
  let state = await db.query.onboardingStates.findFirst({
    where: eq(onboardingStates.workspaceId, workspaceId),
  })

  if (!state) {
    const inserted = await db
      .insert(onboardingStates)
      .values({ workspaceId })
      .returning()
    state = inserted[0]
  }

  return state
}

export async function markOnboardingStep(
  workspaceId: string,
  updates: Partial<{
    hasAddedWebsite: boolean
    hasRunFirstScan: boolean
    hasViewedReport: boolean
    hasConfiguredAlerts: boolean
    hasConnectedIntegration: boolean
  }>
) {
  const existing = await ensureOnboardingState(workspaceId)
  const nextState = {
    hasAddedWebsite: updates.hasAddedWebsite ?? existing.hasAddedWebsite,
    hasRunFirstScan: updates.hasRunFirstScan ?? existing.hasRunFirstScan,
    hasViewedReport: updates.hasViewedReport ?? existing.hasViewedReport,
    hasConfiguredAlerts:
      updates.hasConfiguredAlerts ?? existing.hasConfiguredAlerts,
    hasConnectedIntegration:
      updates.hasConnectedIntegration ?? existing.hasConnectedIntegration,
  }

  const completedAt =
    nextState.hasAddedWebsite &&
    nextState.hasRunFirstScan &&
    nextState.hasViewedReport &&
    nextState.hasConfiguredAlerts &&
    nextState.hasConnectedIntegration
      ? (existing.completedAt ?? new Date().toISOString())
      : null

  const hasChanges =
    nextState.hasAddedWebsite !== existing.hasAddedWebsite ||
    nextState.hasRunFirstScan !== existing.hasRunFirstScan ||
    nextState.hasViewedReport !== existing.hasViewedReport ||
    nextState.hasConfiguredAlerts !== existing.hasConfiguredAlerts ||
    nextState.hasConnectedIntegration !== existing.hasConnectedIntegration ||
    completedAt !== existing.completedAt

  if (!hasChanges) {
    return existing
  }

  const updated = await db
    .update(onboardingStates)
    .set({
      ...nextState,
      completedAt,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(onboardingStates.workspaceId, workspaceId))
    .returning()

  await invalidateCacheTags([workspaceTag(workspaceId)])

  return updated[0]
}

export async function appendAuditLog(input: {
  workspaceId: string
  actorUserId?: string | null
  targetType: string
  targetId?: string | null
  action: string
  summary: string
  metadata?: Record<string, unknown> | null
}) {
  const inserted = await db
    .insert(auditLogs)
    .values({
      workspaceId: input.workspaceId,
      actorUserId: input.actorUserId ?? null,
      targetType: input.targetType,
      targetId: input.targetId ?? null,
      action: input.action,
      summary: input.summary,
      metadata: input.metadata ?? null,
    })
    .returning()

  await invalidateCacheTags([workspaceTag(input.workspaceId)])

  return inserted[0]
}

export async function createNotificationDelivery(input: {
  workspaceId: string
  websiteId?: string | null
  channel: "email" | "slack" | "webhook"
  eventType: string
  destination: string
  providerMessageId?: string | null
  status?: "pending" | "sent" | "failed" | "retrying"
  attempts?: number
  errorMessage?: string | null
  payload?: Record<string, unknown> | null
}) {
  const inserted = await db
    .insert(notificationDeliveries)
    .values({
      workspaceId: input.workspaceId,
      websiteId: input.websiteId ?? null,
      channel: input.channel,
      eventType: input.eventType,
      destination: input.destination,
      providerMessageId: input.providerMessageId ?? null,
      status: input.status ?? "pending",
      attempts: input.attempts ?? 0,
      errorMessage: input.errorMessage ?? null,
      payload: input.payload ?? null,
      lastAttemptAt: new Date().toISOString(),
      deliveredAt: input.status === "sent" ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString(),
    })
    .returning()

  await invalidateCacheTags([workspaceTag(input.workspaceId)])

  return inserted[0]
}

export async function ensureWorkspaceBillingSubscription(input: {
  workspaceId: string
  planSlug: string
}) {
  let subscription = await db.query.billingSubscriptions.findFirst({
    where: eq(billingSubscriptions.workspaceId, input.workspaceId),
  })

  if (!subscription) {
    const links = getBillingLinks(input.planSlug)
    const inserted = await db
      .insert(billingSubscriptions)
      .values({
        workspaceId: input.workspaceId,
        planSlug: normalizePlanSlug(input.planSlug),
        status: input.planSlug === "free_user" ? "trialing" : "active",
        portalUrl: links.manageUrl,
        checkoutUrl:
          links.checkout[
            links.recommendedUpgrade as keyof typeof links.checkout
          ] ?? null,
      })
      .returning()

    subscription = inserted[0]
    await invalidateCacheTags([workspaceTag(input.workspaceId)])
  }

  return subscription
}

export async function updateWorkspaceBillingSubscription(input: {
  workspaceId: string
  planSlug?: string
  status?: "trialing" | "active" | "past_due" | "canceled" | "incomplete"
  amountSek?: number
  provider?: string
  providerCustomerId?: string | null
  providerSubscriptionId?: string | null
  trialEndsAt?: string | null
  currentPeriodEndsAt?: string | null
  cancelAtPeriodEnd?: boolean
  dunningStatus?: "clear" | "at_risk" | "in_dunning" | "write_off"
  lastInvoiceUrl?: string | null
  checkoutUrl?: string | null
  portalUrl?: string | null
}) {
  await ensureWorkspaceBillingSubscription({
    workspaceId: input.workspaceId,
    planSlug: input.planSlug ?? "free_user",
  })

  const updated = await db
    .update(billingSubscriptions)
    .set({
      planSlug: input.planSlug ? normalizePlanSlug(input.planSlug) : undefined,
      status: input.status,
      amountSek: input.amountSek,
      provider: input.provider,
      providerCustomerId: input.providerCustomerId,
      providerSubscriptionId: input.providerSubscriptionId,
      trialEndsAt: input.trialEndsAt,
      currentPeriodEndsAt: input.currentPeriodEndsAt,
      cancelAtPeriodEnd: input.cancelAtPeriodEnd,
      dunningStatus: input.dunningStatus,
      lastInvoiceUrl: input.lastInvoiceUrl,
      checkoutUrl: input.checkoutUrl,
      portalUrl: input.portalUrl,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(billingSubscriptions.workspaceId, input.workspaceId))
    .returning()

  await invalidateCacheTags([workspaceTag(input.workspaceId)])

  return updated[0]
}
