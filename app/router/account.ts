import z from "zod"
import { protectedProcedure } from "../orpc"
import { db } from "@/db/drizzle"
import type { Locale } from "@/lib/i18n"
import {
  apiKeys,
  auditLogs,
  billingSubscriptions,
  notificationDeliveries,
  reports,
  scans,
  supportRequests,
  userSettings,
  users,
  webhookDestinations,
  websites,
  workspaceInvites,
  workspaceMembers,
  workspaces,
} from "@/migrations/schema"
import { and, count, desc, eq, inArray, sql } from "drizzle-orm"
import {
  getPlanDefinition,
  normalizePlanSlug,
  planToWebsiteCount,
} from "@/lib/plans"
import {
  appendAuditLog,
  createNotificationDelivery,
  ensureOnboardingState,
  ensureWorkspaceBillingSubscription,
  getBillingLinks,
  markOnboardingStep,
  updateWorkspaceBillingSubscription,
} from "@/lib/saas"
import {
  cachedQuery,
  invalidateCacheTags,
  userTag,
  workspaceTag,
} from "@/lib/cache"
import { assertRateLimit } from "@/lib/rate-limit"
import {
  generateApiKeySecret,
  getApiKeyPrefix,
  hashApiKey,
} from "@/lib/api-key"

const notificationSettingsSchema = z.object({
  emailAlerts: z.boolean(),
  weeklyDigest: z.boolean(),
  productUpdates: z.boolean(),
  billingEmails: z.boolean(),
  notifyOnScanFailure: z.boolean(),
  notifyOnScoreDrop: z.boolean(),
  scoreDropThreshold: z.number().int().min(1).max(100),
  slackWebhookUrl: z.union([z.literal(""), z.url()]),
})

const workspaceLocaleSchema = z.object({
  preferredLocale: z.enum(["sv", "en"]),
})

const webhookSchema = z.object({
  label: z.string().trim().min(2).max(60),
  url: z.url(),
  eventTypes: z
    .array(z.enum(["scan.failed", "score.regression", "report.ready"]))
    .min(1),
  secret: z.string().trim().max(120).optional().default(""),
})

const inviteSchema = z.object({
  email: z.email(),
  role: z.enum(["admin", "member"]).default("member"),
})

const workspaceSwitchSchema = z.object({
  workspaceId: z.string(),
})

const inviteActionSchema = z.object({
  inviteId: z.string(),
})

const workspaceMemberRoleSchema = z.object({
  memberId: z.string(),
  role: z.enum(["admin", "member"]),
})

const removeWorkspaceMemberSchema = z.object({
  memberId: z.string(),
})

const billingSchema = z.object({
  provider: z.string().trim().min(2).max(40).default("manual"),
  providerCustomerId: z.string().trim().max(120).nullable().optional(),
  providerSubscriptionId: z.string().trim().max(120).nullable().optional(),
  planSlug: z.enum(["free_user", "starter", "pro", "enterprise"]),
  status: z.enum(["trialing", "active", "past_due", "canceled", "incomplete"]),
  amountSek: z.number().int().min(0).max(500000),
  dunningStatus: z.enum(["clear", "at_risk", "in_dunning", "write_off"]),
  currentPeriodEndsAt: z.string().datetime().nullable().optional(),
  trialEndsAt: z.string().datetime().nullable().optional(),
  cancelAtPeriodEnd: z.boolean().default(false),
  checkoutUrl: z.union([z.literal(""), z.url()]).optional(),
  portalUrl: z.union([z.literal(""), z.url()]).optional(),
  lastInvoiceUrl: z.union([z.literal(""), z.url()]).optional(),
})

const onboardingStepSchema = z.object({
  step: z.enum([
    "hasAddedWebsite",
    "hasRunFirstScan",
    "hasViewedReport",
    "hasConfiguredAlerts",
    "hasConnectedIntegration",
  ]),
  completed: z.boolean().default(true),
})

const apiKeySchema = z.object({
  label: z.string().trim().min(2).max(60),
})

const supportRequestSchema = z.object({
  subject: z.string().trim().min(4).max(120),
  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
  category: z
    .enum(["support", "billing", "security", "success"])
    .default("support"),
  message: z.string().trim().min(10).max(4000),
})

const listAuditLogsSchema = z.object({
  limit: z.number().int().min(1).max(50).default(10),
  offset: z.number().int().min(0).default(0),
})

function normalizeEmail(email: string | null | undefined) {
  return email?.trim().toLowerCase() ?? null
}

async function ensureUserSettings(userId: string) {
  let settings = await db.query.userSettings.findFirst({
    where: eq(userSettings.userId, userId),
  })

  if (!settings) {
    const inserted = await db
      .insert(userSettings)
      .values({ userId })
      .returning()
    settings = inserted[0]
  }

  return settings
}

async function buildAccountSummary(context: {
  userId: string
  clerkUserId: string
  plan: string
  workspaceId: string
  workspaceRole: string
  workspaceName: string
}) {
  const [
    user,
    workspace,
    settings,
    members,
    invites,
    subscription,
    onboarding,
    activeWebsites,
    totalWebsites,
    totalScans,
    totalReports,
    deliveryHealth,
  ] = await Promise.all([
    db.query.users.findFirst({
      where: eq(users.id, context.userId),
    }),
    db.query.workspaces.findFirst({
      where: eq(workspaces.id, context.workspaceId),
    }),
    ensureUserSettings(context.userId),
    db
      .select({ count: count() })
      .from(workspaceMembers)
      .where(eq(workspaceMembers.workspaceId, context.workspaceId)),
    db
      .select({ count: count() })
      .from(workspaceInvites)
      .where(
        and(
          eq(workspaceInvites.workspaceId, context.workspaceId),
          eq(workspaceInvites.status, "pending")
        )
      ),
    ensureWorkspaceBillingSubscription({
      workspaceId: context.workspaceId,
      planSlug: context.plan,
    }),
    ensureOnboardingState(context.workspaceId),
    db
      .select({ count: count() })
      .from(websites)
      .where(
        and(
          eq(websites.workspaceId, context.workspaceId),
          eq(websites.isEnabled, true)
        )
      ),
    db
      .select({ count: count() })
      .from(websites)
      .where(eq(websites.workspaceId, context.workspaceId)),
    db
      .select({ count: count() })
      .from(scans)
      .innerJoin(websites, eq(websites.id, scans.websiteId))
      .where(eq(websites.workspaceId, context.workspaceId)),
    db
      .select({ count: count() })
      .from(reports)
      .innerJoin(websites, eq(websites.id, reports.websiteId))
      .where(eq(websites.workspaceId, context.workspaceId)),
    db
      .select({
        failed: sql<number>`coalesce(sum(case when ${notificationDeliveries.status} = 'failed' then 1 else 0 end), 0)`,
        sent: sql<number>`coalesce(sum(case when ${notificationDeliveries.status} = 'sent' then 1 else 0 end), 0)`,
      })
      .from(notificationDeliveries)
      .where(eq(notificationDeliveries.workspaceId, context.workspaceId)),
  ])

  const normalizedPlan = normalizePlanSlug(
    subscription?.planSlug ?? user?.plan ?? context.plan
  )
  const plan = getPlanDefinition(normalizedPlan)
  const links = getBillingLinks(normalizedPlan)
  const completedSteps = [
    onboarding.hasAddedWebsite,
    onboarding.hasRunFirstScan,
    onboarding.hasViewedReport,
    onboarding.hasConfiguredAlerts,
    onboarding.hasConnectedIntegration,
  ].filter(Boolean).length

  return {
    plan,
    rawPlan: normalizedPlan,
    usage: {
      activeWebsites: activeWebsites[0]?.count ?? 0,
      totalWebsites: totalWebsites[0]?.count ?? 0,
      websiteLimit: planToWebsiteCount(normalizedPlan),
      scans: totalScans[0]?.count ?? 0,
      reports: totalReports[0]?.count ?? 0,
    },
    customer: {
      internalUserId: context.userId,
      clerkUserId: context.clerkUserId,
      createdAt: user?.createdAt ?? null,
    },
    workspace: {
      id: context.workspaceId,
      name: workspace?.name ?? context.workspaceName,
      role: context.workspaceRole,
      preferredLocale: (workspace?.preferredLocale ?? "sv") as Locale,
      memberCount: members[0]?.count ?? 0,
      pendingInviteCount: invites[0]?.count ?? 0,
    },
    capabilities: {
      scheduledScans: normalizedPlan !== "free_user",
      emailAlerts: normalizedPlan !== "free_user",
      slackAlerts: normalizedPlan === "pro" || normalizedPlan === "enterprise",
      apiAccess: normalizedPlan === "enterprise",
      teamManagement: normalizedPlan !== "free_user",
      auditLogs: normalizedPlan !== "free_user",
    },
    billing: {
      ...links,
      provider: subscription.provider,
      status: subscription.status,
      dunningStatus: subscription.dunningStatus,
      amountSek: subscription.amountSek,
      trialEndsAt: subscription.trialEndsAt,
      currentPeriodEndsAt: subscription.currentPeriodEndsAt,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      lastInvoiceUrl: subscription.lastInvoiceUrl,
      manageUrl: subscription.portalUrl || links.manageUrl,
      checkout: {
        starter:
          subscription.planSlug === "starter" ? null : links.checkout.starter,
        pro: subscription.planSlug === "pro" ? null : links.checkout.pro,
        enterprise:
          subscription.planSlug === "enterprise"
            ? null
            : links.checkout.enterprise,
      },
    },
    onboarding: {
      ...onboarding,
      completedSteps,
      totalSteps: 5,
    },
    notifications: {
      sent: Number(deliveryHealth[0]?.sent ?? 0),
      failed: Number(deliveryHealth[0]?.failed ?? 0),
    },
    settings,
  }
}

function requireWorkspaceAdmin(role: string) {
  if (role !== "owner" && role !== "admin") {
    throw new Error("FORBIDDEN")
  }
}

function requireWorkspaceOwner(role: string) {
  if (role !== "owner") {
    throw new Error("FORBIDDEN")
  }
}

function requireEnterprisePlan(plan: string) {
  if (normalizePlanSlug(plan) !== "enterprise") {
    throw new Error("PLAN_REQUIRES_ENTERPRISE")
  }
}

function createInviteToken() {
  const bytes = new Uint8Array(18)
  crypto.getRandomValues(bytes)

  return `invite_${Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("")}`
}

function getAccountCacheTags(context: { workspaceId: string; userId: string }) {
  return [workspaceTag(context.workspaceId), userTag(context.userId)]
}

export const getAccountSummary = protectedProcedure.handler(
  async ({ context }) => {
    return cachedQuery(
      {
        key: `account:summary:${context.workspaceId}:${context.userId}`,
        ttlSeconds: 60,
        tags: getAccountCacheTags(context),
      },
      () => buildAccountSummary(context)
    )
  }
)

export const listUserWorkspaces = protectedProcedure.handler(async ({ context }) => {
  return cachedQuery(
    {
      key: `account:user-workspaces:${context.userId}`,
      ttlSeconds: 60,
      tags: [userTag(context.userId)],
    },
    async () => {
      const rows = await db
        .select({
          workspaceId: workspaces.id,
          name: workspaces.name,
          slug: workspaces.slug,
          role: workspaceMembers.role,
          createdAt: workspaces.createdAt,
          planSlug: billingSubscriptions.planSlug,
        })
        .from(workspaceMembers)
        .innerJoin(workspaces, eq(workspaces.id, workspaceMembers.workspaceId))
        .leftJoin(
          billingSubscriptions,
          eq(billingSubscriptions.workspaceId, workspaces.id)
        )
        .where(eq(workspaceMembers.userId, context.userId))
        .orderBy(desc(workspaces.createdAt))

      return rows.map((row) => ({
        ...row,
        isActive: row.workspaceId === context.workspaceId,
        plan: getPlanDefinition(row.planSlug ?? context.plan),
      }))
    }
  )
})

export const switchActiveWorkspace = protectedProcedure
  .input(workspaceSwitchSchema)
  .handler(async ({ context, input }) => {
    const membership = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.userId, context.userId),
        eq(workspaceMembers.workspaceId, input.workspaceId)
      ),
    })

    if (!membership) {
      throw new Error("FORBIDDEN")
    }

    await db
      .update(users)
      .set({ activeWorkspaceId: input.workspaceId })
      .where(eq(users.id, context.userId))

    await invalidateCacheTags([userTag(context.userId), workspaceTag(input.workspaceId)])

    return { success: true }
  })

export const listPendingInvites = protectedProcedure.handler(async ({ context }) => {
  return cachedQuery(
    {
      key: `account:pending-invites:${context.userId}`,
      ttlSeconds: 60,
      tags: [userTag(context.userId)],
    },
    async () => {
      const user = await db.query.users.findFirst({
        where: eq(users.id, context.userId),
      })
      const email = normalizeEmail(user?.email)

      if (!email) {
        return []
      }

      return db
        .select({
          id: workspaceInvites.id,
          workspaceId: workspaceInvites.workspaceId,
          workspaceName: workspaces.name,
          email: workspaceInvites.email,
          role: workspaceInvites.role,
          status: workspaceInvites.status,
          expiresAt: workspaceInvites.expiresAt,
          createdAt: workspaceInvites.createdAt,
        })
        .from(workspaceInvites)
        .innerJoin(workspaces, eq(workspaces.id, workspaceInvites.workspaceId))
        .where(
          and(
            eq(workspaceInvites.status, "pending"),
            sql`lower(${workspaceInvites.email}) = ${email}`
          )
        )
        .orderBy(desc(workspaceInvites.createdAt))
    }
  )
})

export const acceptWorkspaceInvite = protectedProcedure
  .input(inviteActionSchema)
  .handler(async ({ context, input }) => {
    const user = await db.query.users.findFirst({
      where: eq(users.id, context.userId),
    })
    const email = normalizeEmail(user?.email)

    if (!email) {
      throw new Error("MISSING_EMAIL")
    }

    const invite = await db.query.workspaceInvites.findFirst({
      where: and(
        eq(workspaceInvites.id, input.inviteId),
        eq(workspaceInvites.status, "pending")
      ),
    })

    if (!invite || normalizeEmail(invite.email) !== email) {
      throw new Error("FORBIDDEN")
    }

    if (new Date(invite.expiresAt) < new Date()) {
      await db
        .update(workspaceInvites)
        .set({
          status: "expired",
          updatedAt: new Date().toISOString(),
        })
        .where(eq(workspaceInvites.id, input.inviteId))
      throw new Error("INVITE_EXPIRED")
    }

    await db.transaction(async (tx) => {
      const existingMembership = await tx.query.workspaceMembers.findFirst({
        where: and(
          eq(workspaceMembers.userId, context.userId),
          eq(workspaceMembers.workspaceId, invite.workspaceId)
        ),
      })

      if (!existingMembership) {
        await tx.insert(workspaceMembers).values({
          workspaceId: invite.workspaceId,
          userId: context.userId,
          role: invite.role,
        })
      }

      await tx
        .update(workspaceInvites)
        .set({
          status: "accepted",
          updatedAt: new Date().toISOString(),
        })
        .where(eq(workspaceInvites.id, invite.id))

      await tx
        .update(users)
        .set({ activeWorkspaceId: invite.workspaceId })
        .where(eq(users.id, context.userId))
    })

    await appendAuditLog({
      workspaceId: invite.workspaceId,
      actorUserId: context.userId,
      targetType: "workspace_invite",
      targetId: invite.id,
      action: "workspace.invite_accepted",
      summary: `${email} gick med i workspacet`,
    })

    await invalidateCacheTags([userTag(context.userId), workspaceTag(invite.workspaceId)])

    return { success: true, workspaceId: invite.workspaceId }
  })

export const declineWorkspaceInvite = protectedProcedure
  .input(inviteActionSchema)
  .handler(async ({ context, input }) => {
    const user = await db.query.users.findFirst({
      where: eq(users.id, context.userId),
    })
    const email = normalizeEmail(user?.email)

    if (!email) {
      throw new Error("MISSING_EMAIL")
    }

    const invite = await db.query.workspaceInvites.findFirst({
      where: and(
        eq(workspaceInvites.id, input.inviteId),
        eq(workspaceInvites.status, "pending")
      ),
    })

    if (!invite || normalizeEmail(invite.email) !== email) {
      throw new Error("FORBIDDEN")
    }

    await db
      .update(workspaceInvites)
      .set({
        status: "revoked",
        updatedAt: new Date().toISOString(),
      })
      .where(eq(workspaceInvites.id, invite.id))

    await appendAuditLog({
      workspaceId: invite.workspaceId,
      actorUserId: context.userId,
      targetType: "workspace_invite",
      targetId: invite.id,
      action: "workspace.invite_declined",
      summary: `${email} avböjde en inbjudan`,
    })

    await invalidateCacheTags([userTag(context.userId), workspaceTag(invite.workspaceId)])

    return { success: true }
  })

export const getDashboardOverview = protectedProcedure.handler(
  async ({ context }) => {
    return cachedQuery(
      {
        key: `account:dashboard:${context.workspaceId}:${context.userId}`,
        ttlSeconds: 45,
        tags: getAccountCacheTags(context),
      },
      async () => {
        const [
          summary,
          recentScans,
          recentReports,
          websitesList,
          deliveryList,
          auditList,
        ] = await Promise.all([
          buildAccountSummary(context),
          db
            .select({
              websiteId: websites.id,
              websiteUrl: websites.url,
              websiteName: websites.name,
              scanId: scans.id,
              status: scans.status,
              performanceScore: scans.performanceScore,
              seoScore: scans.seoScore,
              errorMessage: scans.errorMessage,
              createdAt: scans.createdAt,
            })
            .from(scans)
            .innerJoin(websites, eq(websites.id, scans.websiteId))
            .where(eq(websites.workspaceId, context.workspaceId))
            .orderBy(desc(scans.createdAt))
            .limit(6),
          db
            .select({
              id: reports.id,
              createdAt: reports.createdAt,
              websiteId: websites.id,
              websiteUrl: websites.url,
              websiteName: websites.name,
            })
            .from(reports)
            .innerJoin(websites, eq(websites.id, reports.websiteId))
            .where(eq(websites.workspaceId, context.workspaceId))
            .orderBy(desc(reports.createdAt))
            .limit(4),
          db.query.websites.findMany({
            where: eq(websites.workspaceId, context.workspaceId),
            orderBy: desc(websites.createdAt),
          }),
          db.query.notificationDeliveries.findMany({
            where: eq(notificationDeliveries.workspaceId, context.workspaceId),
            orderBy: desc(notificationDeliveries.createdAt),
            limit: 5,
          }),
          db.query.auditLogs.findMany({
            where: eq(auditLogs.workspaceId, context.workspaceId),
            orderBy: desc(auditLogs.createdAt),
            limit: 5,
          }),
        ])

        const websiteIds = websitesList.map((website) => website.id)
        const latestIssues =
          websiteIds.length === 0
            ? []
            : await db
                .select({
                  scanId: scans.id,
                  websiteId: websites.id,
                  key: sql<string>`min(${scans.id})`.as("key"),
                  issueCount: count(),
                })
                .from(scans)
                .innerJoin(websites, eq(websites.id, scans.websiteId))
                .where(
                  and(
                    eq(websites.workspaceId, context.workspaceId),
                    inArray(scans.websiteId, websiteIds)
                  )
                )
                .groupBy(scans.id, websites.id)
                .orderBy(desc(scans.createdAt))
                .limit(4)

        const pausedSites = websitesList.filter((website) => !website.isEnabled)
        const failedScans = recentScans.filter(
          (scan) => scan.status === "failed"
        )
        const unhealthySites = websitesList.filter(
          (website) =>
            (website.lastPerformanceScore ?? 0) < 70 ||
            (website.lastSeoScore ?? 0) < 70
        )

        return {
          summary,
          websites: websitesList,
          recentScans,
          recentReports,
          recentDeliveries: deliveryList,
          recentAuditLogs: auditList,
          alerts: {
            pausedSites: pausedSites.slice(0, 3),
            failedScans,
            unhealthySites: unhealthySites.slice(0, 3),
            issueSnapshots: latestIssues,
          },
        }
      }
    )
  }
)

export const getNotificationSettings = protectedProcedure.handler(
  async ({ context }) => {
    return cachedQuery(
      {
        key: `account:notification-settings:${context.userId}`,
        ttlSeconds: 120,
        tags: getAccountCacheTags(context),
      },
      () => ensureUserSettings(context.userId)
    )
  }
)

export const updateNotificationSettings = protectedProcedure
  .input(notificationSettingsSchema)
  .handler(async ({ context, input }) => {
    await ensureUserSettings(context.userId)

    const updated = await db
      .update(userSettings)
      .set({
        emailAlerts: input.emailAlerts,
        weeklyDigest: input.weeklyDigest,
        productUpdates: input.productUpdates,
        billingEmails: input.billingEmails,
        notifyOnScanFailure: input.notifyOnScanFailure,
        notifyOnScoreDrop: input.notifyOnScoreDrop,
        scoreDropThreshold: input.scoreDropThreshold,
        slackWebhookUrl: input.slackWebhookUrl || null,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(userSettings.userId, context.userId))
      .returning()

    await markOnboardingStep(context.workspaceId, {
      hasConfiguredAlerts: true,
      hasConnectedIntegration: Boolean(input.slackWebhookUrl),
    })

    await appendAuditLog({
      workspaceId: context.workspaceId,
      actorUserId: context.userId,
      targetType: "notification_settings",
      action: "notification_settings.updated",
      summary: "Notifieringsinställningar uppdaterades",
      metadata: {
        emailAlerts: input.emailAlerts,
        weeklyDigest: input.weeklyDigest,
        notifyOnScoreDrop: input.notifyOnScoreDrop,
      },
    })

    if (input.slackWebhookUrl) {
      await createNotificationDelivery({
        workspaceId: context.workspaceId,
        channel: "slack",
        eventType: "settings.slack.connected",
        destination: input.slackWebhookUrl,
        status: "sent",
        attempts: 1,
        payload: {
          source: "settings",
        },
      })
    }

    await invalidateCacheTags(getAccountCacheTags(context))

    return updated[0]
  })

export const updateWorkspaceLocale = protectedProcedure
  .input(workspaceLocaleSchema)
  .handler(async ({ context, input }) => {
    requireWorkspaceAdmin(context.workspaceRole)

    const updated = await db
      .update(workspaces)
      .set({
        preferredLocale: input.preferredLocale,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(workspaces.id, context.workspaceId))
      .returning()

    await appendAuditLog({
      workspaceId: context.workspaceId,
      actorUserId: context.userId,
      targetType: "workspace",
      targetId: context.workspaceId,
      action: "workspace.locale_updated",
      summary: `Workspace-språk uppdaterades till ${input.preferredLocale}`,
      metadata: {
        preferredLocale: input.preferredLocale,
      },
    })

    await invalidateCacheTags([workspaceTag(context.workspaceId), userTag(context.userId)])

    return updated[0] ?? null
  })

export const listWebhookDestinations = protectedProcedure.handler(
  async ({ context }) => {
    return cachedQuery(
      {
        key: `account:webhooks:${context.workspaceId}`,
        ttlSeconds: 120,
        tags: [workspaceTag(context.workspaceId)],
      },
      () =>
        db.query.webhookDestinations.findMany({
          where: eq(webhookDestinations.workspaceId, context.workspaceId),
          orderBy: desc(webhookDestinations.createdAt),
        })
    )
  }
)

export const createWebhookDestination = protectedProcedure
  .input(webhookSchema)
  .handler(async ({ context, input }) => {
    await assertRateLimit({
      key: `ratelimit:account:webhooks:${context.workspaceId}:${context.userId}`,
      windowMs: 60_000,
      limit: 10,
    })

    const inserted = await db
      .insert(webhookDestinations)
      .values({
        userId: context.userId,
        workspaceId: context.workspaceId,
        label: input.label,
        url: input.url,
        eventTypes: input.eventTypes.join(","),
        secret: input.secret || null,
      })
      .returning()

    await markOnboardingStep(context.workspaceId, {
      hasConnectedIntegration: true,
    })

    await appendAuditLog({
      workspaceId: context.workspaceId,
      actorUserId: context.userId,
      targetType: "webhook_destination",
      targetId: inserted[0]?.id,
      action: "webhook.created",
      summary: `Webhook ${input.label} skapades`,
      metadata: { eventTypes: input.eventTypes },
    })

    await createNotificationDelivery({
      workspaceId: context.workspaceId,
      channel: "webhook",
      eventType: "webhook.created",
      destination: input.url,
      status: "sent",
      attempts: 1,
      payload: { label: input.label },
    })

    await invalidateCacheTags([workspaceTag(context.workspaceId)])

    return inserted[0]
  })

export const updateWebhookDestination = protectedProcedure
  .input(
    webhookSchema.extend({
      id: z.string(),
      isEnabled: z.boolean(),
    })
  )
  .handler(async ({ context, input }) => {
    const updated = await db
      .update(webhookDestinations)
      .set({
        label: input.label,
        url: input.url,
        eventTypes: input.eventTypes.join(","),
        secret: input.secret || null,
        isEnabled: input.isEnabled,
        updatedAt: new Date().toISOString(),
      })
      .where(
        and(
          eq(webhookDestinations.id, input.id),
          eq(webhookDestinations.workspaceId, context.workspaceId)
        )
      )
      .returning()

    await appendAuditLog({
      workspaceId: context.workspaceId,
      actorUserId: context.userId,
      targetType: "webhook_destination",
      targetId: input.id,
      action: input.isEnabled ? "webhook.enabled" : "webhook.disabled",
      summary: `Webhook ${input.label} ${input.isEnabled ? "aktiverades" : "pausades"}`,
      metadata: { eventTypes: input.eventTypes },
    })

    await invalidateCacheTags([workspaceTag(context.workspaceId)])

    return updated[0] ?? null
  })

export const deleteWebhookDestination = protectedProcedure
  .input(z.object({ id: z.string() }))
  .handler(async ({ context, input }) => {
    await db
      .delete(webhookDestinations)
      .where(
        and(
          eq(webhookDestinations.id, input.id),
          eq(webhookDestinations.workspaceId, context.workspaceId)
        )
      )

    await appendAuditLog({
      workspaceId: context.workspaceId,
      actorUserId: context.userId,
      targetType: "webhook_destination",
      targetId: input.id,
      action: "webhook.deleted",
      summary: "Webhook togs bort",
    })

    await invalidateCacheTags([workspaceTag(context.workspaceId)])

    return { success: true }
  })

export const listWorkspaceMembers = protectedProcedure.handler(
  async ({ context }) => {
    return cachedQuery(
      {
        key: `account:workspace-members:${context.workspaceId}`,
        ttlSeconds: 120,
        tags: [workspaceTag(context.workspaceId)],
      },
      async () => {
        const [members, invites] = await Promise.all([
          db
            .select({
              id: workspaceMembers.id,
              role: workspaceMembers.role,
              joinedAt: workspaceMembers.joinedAt,
              userId: users.id,
              clerkUserId: users.clerkUserId,
              email: users.email,
            })
            .from(workspaceMembers)
            .innerJoin(users, eq(users.id, workspaceMembers.userId))
            .where(eq(workspaceMembers.workspaceId, context.workspaceId))
            .orderBy(desc(workspaceMembers.createdAt)),
          db.query.workspaceInvites.findMany({
            where: eq(workspaceInvites.workspaceId, context.workspaceId),
            orderBy: desc(workspaceInvites.createdAt),
          }),
        ])

        return { members, invites }
      }
    )
  }
)

export const createWorkspaceInvite = protectedProcedure
  .input(inviteSchema)
  .handler(async ({ context, input }) => {
    requireWorkspaceAdmin(context.workspaceRole)
    await assertRateLimit({
      key: `ratelimit:account:invites:${context.workspaceId}:${context.userId}`,
      windowMs: 60_000,
      limit: 10,
    })

    const normalizedEmail = normalizeEmail(input.email)
    const currentUser = await db.query.users.findFirst({
      where: eq(users.id, context.userId),
    })

    if (normalizedEmail && normalizeEmail(currentUser?.email) === normalizedEmail) {
      throw new Error("INVALID_INVITE_TARGET")
    }

    const existingMember = normalizedEmail
      ? await db
          .select({ id: workspaceMembers.id })
          .from(workspaceMembers)
          .innerJoin(users, eq(users.id, workspaceMembers.userId))
          .where(
            and(
              eq(workspaceMembers.workspaceId, context.workspaceId),
              sql`lower(${users.email}) = ${normalizedEmail}`
            )
          )
          .limit(1)
      : []

    if (existingMember[0]) {
      throw new Error("ALREADY_MEMBER")
    }

    const existingInvite = await db.query.workspaceInvites.findFirst({
      where: and(
        eq(workspaceInvites.workspaceId, context.workspaceId),
        eq(workspaceInvites.status, "pending"),
        sql`lower(${workspaceInvites.email}) = ${normalizedEmail}`
      ),
    })

    if (existingInvite) {
      throw new Error("INVITE_ALREADY_PENDING")
    }

    const token = createInviteToken()
    const expiresAt = new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 7
    ).toISOString()
    const inserted = await db
      .insert(workspaceInvites)
      .values({
        workspaceId: context.workspaceId,
        email: normalizedEmail ?? input.email,
        role: input.role,
        invitedByUserId: context.userId,
        token,
        expiresAt,
      })
      .returning()

    await appendAuditLog({
      workspaceId: context.workspaceId,
      actorUserId: context.userId,
      targetType: "workspace_invite",
      targetId: inserted[0]?.id,
      action: "workspace.invite_created",
      summary: `Inbjudan skickades till ${input.email}`,
      metadata: { role: input.role },
    })

    await createNotificationDelivery({
      workspaceId: context.workspaceId,
      channel: "email",
      eventType: "workspace.invite",
      destination: input.email,
      status: "sent",
      attempts: 1,
      payload: { role: input.role, token },
    })

    await invalidateCacheTags([workspaceTag(context.workspaceId)])

    return inserted[0]
  })

export const revokeWorkspaceInvite = protectedProcedure
  .input(z.object({ inviteId: z.string() }))
  .handler(async ({ context, input }) => {
    requireWorkspaceAdmin(context.workspaceRole)

    const updated = await db
      .update(workspaceInvites)
      .set({
        status: "revoked",
        updatedAt: new Date().toISOString(),
      })
      .where(
        and(
          eq(workspaceInvites.id, input.inviteId),
          eq(workspaceInvites.workspaceId, context.workspaceId)
        )
      )
      .returning()

    await appendAuditLog({
      workspaceId: context.workspaceId,
      actorUserId: context.userId,
      targetType: "workspace_invite",
      targetId: input.inviteId,
      action: "workspace.invite_revoked",
      summary: "Inbjudan återkallades",
    })

    await invalidateCacheTags([workspaceTag(context.workspaceId)])

    return updated[0] ?? null
  })

export const updateWorkspaceMemberRole = protectedProcedure
  .input(workspaceMemberRoleSchema)
  .handler(async ({ context, input }) => {
    requireWorkspaceOwner(context.workspaceRole)

    const member = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.id, input.memberId),
        eq(workspaceMembers.workspaceId, context.workspaceId)
      ),
    })

    if (!member || member.role === "owner") {
      throw new Error("FORBIDDEN")
    }

    const updated = await db
      .update(workspaceMembers)
      .set({ role: input.role })
      .where(eq(workspaceMembers.id, input.memberId))
      .returning()

    await appendAuditLog({
      workspaceId: context.workspaceId,
      actorUserId: context.userId,
      targetType: "workspace_member",
      targetId: input.memberId,
      action: "workspace.member_role_updated",
      summary: `En medlems roll ändrades till ${input.role}`,
      metadata: { role: input.role },
    })

    await invalidateCacheTags([workspaceTag(context.workspaceId)])

    return updated[0] ?? null
  })

export const removeWorkspaceMember = protectedProcedure
  .input(removeWorkspaceMemberSchema)
  .handler(async ({ context, input }) => {
    requireWorkspaceAdmin(context.workspaceRole)

    const member = await db.query.workspaceMembers.findFirst({
      where: and(
        eq(workspaceMembers.id, input.memberId),
        eq(workspaceMembers.workspaceId, context.workspaceId)
      ),
    })

    if (!member || member.role === "owner" || member.userId === context.userId) {
      throw new Error("FORBIDDEN")
    }

    await db.delete(workspaceMembers).where(eq(workspaceMembers.id, input.memberId))

    const fallbackMembership = await db.query.workspaceMembers.findFirst({
      where: eq(workspaceMembers.userId, member.userId),
      orderBy: desc(workspaceMembers.createdAt),
    })

    await db
      .update(users)
      .set({ activeWorkspaceId: fallbackMembership?.workspaceId ?? null })
      .where(eq(users.id, member.userId))

    await appendAuditLog({
      workspaceId: context.workspaceId,
      actorUserId: context.userId,
      targetType: "workspace_member",
      targetId: input.memberId,
      action: "workspace.member_removed",
      summary: "En medlem togs bort från workspacet",
    })

    await invalidateCacheTags([workspaceTag(context.workspaceId), userTag(member.userId)])

    return { success: true }
  })

export const getBillingSummary = protectedProcedure.handler(
  async ({ context }) => {
    const summary = await cachedQuery(
      {
        key: `account:summary:${context.workspaceId}:${context.userId}`,
        ttlSeconds: 60,
        tags: getAccountCacheTags(context),
      },
      () => buildAccountSummary(context)
    )
    return summary.billing
  }
)

export const updateBillingState = protectedProcedure
  .input(billingSchema)
  .handler(async ({ context, input }) => {
    requireWorkspaceAdmin(context.workspaceRole)

    const links = getBillingLinks(input.planSlug)
    const updated = await updateWorkspaceBillingSubscription({
      workspaceId: context.workspaceId,
      provider: input.provider,
      providerCustomerId: input.providerCustomerId ?? null,
      providerSubscriptionId: input.providerSubscriptionId ?? null,
      planSlug: input.planSlug,
      status: input.status,
      amountSek: input.amountSek,
      dunningStatus: input.dunningStatus,
      currentPeriodEndsAt: input.currentPeriodEndsAt ?? null,
      trialEndsAt: input.trialEndsAt ?? null,
      cancelAtPeriodEnd: input.cancelAtPeriodEnd,
      checkoutUrl:
        input.checkoutUrl ||
        links.checkout[links.recommendedUpgrade as keyof typeof links.checkout],
      portalUrl: input.portalUrl || links.manageUrl,
      lastInvoiceUrl: input.lastInvoiceUrl || null,
    })

    await db
      .update(users)
      .set({ plan: input.planSlug })
      .where(eq(users.id, context.userId))

    await appendAuditLog({
      workspaceId: context.workspaceId,
      actorUserId: context.userId,
      targetType: "billing_subscription",
      targetId: updated.id,
      action: "billing.updated",
      summary: `Billing uppdaterades till ${input.planSlug}`,
      metadata: {
        status: input.status,
        dunningStatus: input.dunningStatus,
        amountSek: input.amountSek,
      },
    })

    await invalidateCacheTags(getAccountCacheTags(context))

    return updated
  })

export const listAuditLogs = protectedProcedure
  .input(listAuditLogsSchema)
  .handler(async ({ context, input }) => {
    return cachedQuery(
      {
        key: `account:audit-logs:${context.workspaceId}:${input.limit}:${input.offset}`,
        ttlSeconds: 30,
        tags: [workspaceTag(context.workspaceId)],
      },
      () =>
        db.query.auditLogs.findMany({
          where: eq(auditLogs.workspaceId, context.workspaceId),
          orderBy: desc(auditLogs.createdAt),
          limit: input.limit,
          offset: input.offset,
        })
    )
  })

export const listNotificationDeliveries = protectedProcedure.handler(
  async ({ context }) => {
    return cachedQuery(
      {
        key: `account:notification-deliveries:${context.workspaceId}`,
        ttlSeconds: 30,
        tags: [workspaceTag(context.workspaceId)],
      },
      () =>
        db.query.notificationDeliveries.findMany({
          where: eq(notificationDeliveries.workspaceId, context.workspaceId),
          orderBy: desc(notificationDeliveries.createdAt),
          limit: 25,
        })
    )
  }
)

export const getOnboardingState = protectedProcedure.handler(
  async ({ context }) => {
    return cachedQuery(
      {
        key: `account:onboarding:${context.workspaceId}`,
        ttlSeconds: 120,
        tags: [workspaceTag(context.workspaceId)],
      },
      () => ensureOnboardingState(context.workspaceId)
    )
  }
)

export const updateOnboardingStep = protectedProcedure
  .input(onboardingStepSchema)
  .handler(async ({ context, input }) => {
    const updated = await markOnboardingStep(context.workspaceId, {
      [input.step]: input.completed,
    })

    await appendAuditLog({
      workspaceId: context.workspaceId,
      actorUserId: context.userId,
      targetType: "onboarding_state",
      targetId: updated?.id,
      action: "onboarding.step_updated",
      summary: `Onboarding-steget ${input.step} markerades`,
      metadata: { completed: input.completed },
    })

    await invalidateCacheTags([workspaceTag(context.workspaceId)])

    return updated
  })

export const listApiKeys = protectedProcedure.handler(async ({ context }) => {
  requireEnterprisePlan(context.plan)

  return cachedQuery(
    {
      key: `account:api-keys:${context.workspaceId}`,
      ttlSeconds: 90,
      tags: [workspaceTag(context.workspaceId)],
    },
    () =>
      db.query.apiKeys.findMany({
        where: eq(apiKeys.workspaceId, context.workspaceId),
        orderBy: desc(apiKeys.createdAt),
      })
  )
})

export const createApiKey = protectedProcedure
  .input(apiKeySchema)
  .handler(async ({ context, input }) => {
    requireWorkspaceAdmin(context.workspaceRole)
    requireEnterprisePlan(context.plan)
    await assertRateLimit({
      key: `ratelimit:account:api-keys:${context.workspaceId}:${context.userId}`,
      windowMs: 60_000,
      limit: 5,
    })

    const secret = generateApiKeySecret()
    const keyHash = await hashApiKey(secret)
    const inserted = await db
      .insert(apiKeys)
      .values({
        workspaceId: context.workspaceId,
        createdByUserId: context.userId,
        label: input.label,
        keyPrefix: getApiKeyPrefix(secret),
        keyHash,
      })
      .returning()

    await appendAuditLog({
      workspaceId: context.workspaceId,
      actorUserId: context.userId,
      targetType: "api_key",
      targetId: inserted[0]?.id,
      action: "api_key.created",
      summary: `API-nyckeln ${input.label} skapades`,
    })

    await invalidateCacheTags([workspaceTag(context.workspaceId)])

    return {
      ...inserted[0],
      plainTextKey: secret,
    }
  })

export const revokeApiKey = protectedProcedure
  .input(z.object({ id: z.string() }))
  .handler(async ({ context, input }) => {
    requireWorkspaceAdmin(context.workspaceRole)
    requireEnterprisePlan(context.plan)

    const updated = await db
      .update(apiKeys)
      .set({ revokedAt: new Date().toISOString() })
      .where(
        and(
          eq(apiKeys.id, input.id),
          eq(apiKeys.workspaceId, context.workspaceId)
        )
      )
      .returning()

    await appendAuditLog({
      workspaceId: context.workspaceId,
      actorUserId: context.userId,
      targetType: "api_key",
      targetId: input.id,
      action: "api_key.revoked",
      summary: "En API-nyckel återkallades",
    })

    await invalidateCacheTags([workspaceTag(context.workspaceId)])

    return updated[0] ?? null
  })

export const listSupportRequests = protectedProcedure.handler(
  async ({ context }) => {
    return cachedQuery(
      {
        key: `account:support-requests:${context.workspaceId}`,
        ttlSeconds: 90,
        tags: [workspaceTag(context.workspaceId)],
      },
      () =>
        db.query.supportRequests.findMany({
          where: eq(supportRequests.workspaceId, context.workspaceId),
          orderBy: desc(supportRequests.createdAt),
        })
    )
  }
)

export const createSupportRequest = protectedProcedure
  .input(supportRequestSchema)
  .handler(async ({ context, input }) => {
    await assertRateLimit({
      key: `ratelimit:account:support:${context.workspaceId}:${context.userId}`,
      windowMs: 60_000,
      limit: 3,
    })

    const inserted = await db
      .insert(supportRequests)
      .values({
        workspaceId: context.workspaceId,
        createdByUserId: context.userId,
        subject: input.subject,
        priority: input.priority,
        category: input.category,
        message: input.message,
      })
      .returning()

    await appendAuditLog({
      workspaceId: context.workspaceId,
      actorUserId: context.userId,
      targetType: "support_request",
      targetId: inserted[0]?.id,
      action: "support_request.created",
      summary: `Supportärendet ${input.subject} skapades`,
      metadata: {
        priority: input.priority,
        category: input.category,
      },
    })

    await createNotificationDelivery({
      workspaceId: context.workspaceId,
      channel: "email",
      eventType: "support.request.created",
      destination: "support@vidat.app",
      status: "sent",
      attempts: 1,
      payload: {
        subject: input.subject,
        priority: input.priority,
      },
    })

    await invalidateCacheTags([workspaceTag(context.workspaceId)])

    return inserted[0]
  })
