import {
  pgTable,
  foreignKey,
  text,
  timestamp,
  integer,
  bigint,
  boolean,
  unique,
  index,
  check,
  numeric,
  jsonb,
} from "drizzle-orm/pg-core"
import { InferSelectModel, sql } from "drizzle-orm"

export const users = pgTable(
  "users",
  {
    id: text()
      .default(sql`nanoid('usr_', 22)`)
      .primaryKey()
      .notNull(),
    clerkUserId: text("clerk_user_id").notNull(),
    email: text(),
    plan: text().default("free").notNull(),
    activeWorkspaceId: text("active_workspace_id"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  (table) => [
    unique("users_clerk_user_id_key").on(table.clerkUserId),
    unique("users_email_key").on(table.email),
  ]
)

export const workspaces = pgTable("workspaces", {
  id: text()
    .default(sql`nanoid('ws_', 22)`)
    .primaryKey()
    .notNull(),
  name: text().notNull(),
  slug: text().notNull(),
  ownerUserId: text("owner_user_id").notNull(),
  billingEmail: text("billing_email"),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
})

export const workspaceMembers = pgTable(
  "workspace_members",
  {
    id: text()
      .default(sql`nanoid('wsm_', 22)`)
      .primaryKey()
      .notNull(),
    workspaceId: text("workspace_id").notNull(),
    userId: text("user_id").notNull(),
    role: text().default("owner").notNull(),
    joinedAt: timestamp("joined_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  (table) => [
    unique("workspace_members_workspace_user_key").on(
      table.workspaceId,
      table.userId
    ),
    foreignKey({
      columns: [table.workspaceId],
      foreignColumns: [workspaces.id],
      name: "workspace_members_workspace_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "workspace_members_user_id_fkey",
    }).onDelete("cascade"),
    check(
      "workspace_members_role_check",
      sql`role = ANY (ARRAY['owner'::text, 'admin'::text, 'member'::text])`
    ),
  ]
)

export const workspaceInvites = pgTable(
  "workspace_invites",
  {
    id: text()
      .default(sql`nanoid('inv_', 22)`)
      .primaryKey()
      .notNull(),
    workspaceId: text("workspace_id").notNull(),
    email: text().notNull(),
    role: text().default("member").notNull(),
    invitedByUserId: text("invited_by_user_id").notNull(),
    status: text().default("pending").notNull(),
    token: text().notNull(),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  (table) => [
    unique("workspace_invites_token_key").on(table.token),
    foreignKey({
      columns: [table.workspaceId],
      foreignColumns: [workspaces.id],
      name: "workspace_invites_workspace_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.invitedByUserId],
      foreignColumns: [users.id],
      name: "workspace_invites_invited_by_user_id_fkey",
    }).onDelete("cascade"),
    check(
      "workspace_invites_role_check",
      sql`role = ANY (ARRAY['owner'::text, 'admin'::text, 'member'::text])`
    ),
    check(
      "workspace_invites_status_check",
      sql`status = ANY (ARRAY['pending'::text, 'accepted'::text, 'revoked'::text, 'expired'::text])`
    ),
  ]
)

export const billingSubscriptions = pgTable(
  "billing_subscriptions",
  {
    id: text()
      .default(sql`nanoid('sub_', 22)`)
      .primaryKey()
      .notNull(),
    workspaceId: text("workspace_id").notNull(),
    provider: text().default("manual").notNull(),
    providerCustomerId: text("provider_customer_id"),
    providerSubscriptionId: text("provider_subscription_id"),
    planSlug: text("plan_slug").default("free_user").notNull(),
    status: text().default("trialing").notNull(),
    interval: text().default("month").notNull(),
    currency: text().default("sek").notNull(),
    amountSek: integer("amount_sek").default(0).notNull(),
    trialEndsAt: timestamp("trial_ends_at", {
      withTimezone: true,
      mode: "string",
    }),
    currentPeriodEndsAt: timestamp("current_period_ends_at", {
      withTimezone: true,
      mode: "string",
    }),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),
    dunningStatus: text("dunning_status").default("clear").notNull(),
    lastInvoiceUrl: text("last_invoice_url"),
    checkoutUrl: text("checkout_url"),
    portalUrl: text("portal_url"),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  (table) => [
    unique("billing_subscriptions_workspace_id_key").on(table.workspaceId),
    foreignKey({
      columns: [table.workspaceId],
      foreignColumns: [workspaces.id],
      name: "billing_subscriptions_workspace_id_fkey",
    }).onDelete("cascade"),
    check(
      "billing_subscriptions_status_check",
      sql`status = ANY (ARRAY['trialing'::text, 'active'::text, 'past_due'::text, 'canceled'::text, 'incomplete'::text])`
    ),
    check(
      "billing_subscriptions_dunning_status_check",
      sql`dunning_status = ANY (ARRAY['clear'::text, 'at_risk'::text, 'in_dunning'::text, 'write_off'::text])`
    ),
  ]
)

export const onboardingStates = pgTable(
  "onboarding_states",
  {
    id: text()
      .default(sql`nanoid('onb_', 22)`)
      .primaryKey()
      .notNull(),
    workspaceId: text("workspace_id").notNull(),
    hasAddedWebsite: boolean("has_added_website").default(false).notNull(),
    hasRunFirstScan: boolean("has_run_first_scan").default(false).notNull(),
    hasViewedReport: boolean("has_viewed_report").default(false).notNull(),
    hasConfiguredAlerts: boolean("has_configured_alerts").default(false).notNull(),
    hasConnectedIntegration: boolean("has_connected_integration")
      .default(false)
      .notNull(),
    completedAt: timestamp("completed_at", {
      withTimezone: true,
      mode: "string",
    }),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  (table) => [
    unique("onboarding_states_workspace_id_key").on(table.workspaceId),
    foreignKey({
      columns: [table.workspaceId],
      foreignColumns: [workspaces.id],
      name: "onboarding_states_workspace_id_fkey",
    }).onDelete("cascade"),
  ]
)

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: text()
      .default(sql`nanoid('audit_', 22)`)
      .primaryKey()
      .notNull(),
    workspaceId: text("workspace_id").notNull(),
    actorUserId: text("actor_user_id"),
    targetType: text("target_type").notNull(),
    targetId: text("target_id"),
    action: text().notNull(),
    summary: text().notNull(),
    metadata: jsonb().$type<Record<string, unknown> | null>(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  (table) => [
    index("idx_audit_logs_workspace_id_created_at").using(
      "btree",
      table.workspaceId.asc().nullsLast().op("text_ops"),
      table.createdAt.desc().nullsFirst().op("text_ops")
    ),
    foreignKey({
      columns: [table.workspaceId],
      foreignColumns: [workspaces.id],
      name: "audit_logs_workspace_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.actorUserId],
      foreignColumns: [users.id],
      name: "audit_logs_actor_user_id_fkey",
    }).onDelete("set null"),
  ]
)

export const notificationDeliveries = pgTable(
  "notification_deliveries",
  {
    id: text()
      .default(sql`nanoid('nd_', 22)`)
      .primaryKey()
      .notNull(),
    workspaceId: text("workspace_id").notNull(),
    websiteId: text("website_id"),
    channel: text().notNull(),
    eventType: text("event_type").notNull(),
    destination: text().notNull(),
    status: text().default("pending").notNull(),
    providerMessageId: text("provider_message_id"),
    attempts: integer().default(0).notNull(),
    lastAttemptAt: timestamp("last_attempt_at", {
      withTimezone: true,
      mode: "string",
    }),
    deliveredAt: timestamp("delivered_at", {
      withTimezone: true,
      mode: "string",
    }),
    errorMessage: text("error_message"),
    payload: jsonb().$type<Record<string, unknown> | null>(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  (table) => [
    index("idx_notification_deliveries_workspace_id_created_at").using(
      "btree",
      table.workspaceId.asc().nullsLast().op("text_ops"),
      table.createdAt.desc().nullsFirst().op("text_ops")
    ),
    foreignKey({
      columns: [table.workspaceId],
      foreignColumns: [workspaces.id],
      name: "notification_deliveries_workspace_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.websiteId],
      foreignColumns: [websites.id],
      name: "notification_deliveries_website_id_fkey",
    }).onDelete("set null"),
    check(
      "notification_deliveries_channel_check",
      sql`channel = ANY (ARRAY['email'::text, 'slack'::text, 'webhook'::text])`
    ),
    check(
      "notification_deliveries_status_check",
      sql`status = ANY (ARRAY['pending'::text, 'sent'::text, 'failed'::text, 'retrying'::text])`
    ),
  ]
)

export const apiKeys = pgTable(
  "api_keys",
  {
    id: text()
      .default(sql`nanoid('key_', 22)`)
      .primaryKey()
      .notNull(),
    workspaceId: text("workspace_id").notNull(),
    createdByUserId: text("created_by_user_id").notNull(),
    label: text().notNull(),
    keyPrefix: text("key_prefix").notNull(),
    keyHash: text("key_hash").notNull(),
    lastUsedAt: timestamp("last_used_at", {
      withTimezone: true,
      mode: "string",
    }),
    revokedAt: timestamp("revoked_at", {
      withTimezone: true,
      mode: "string",
    }),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  (table) => [
    index("idx_api_keys_workspace_id").using(
      "btree",
      table.workspaceId.asc().nullsLast().op("text_ops")
    ),
    foreignKey({
      columns: [table.workspaceId],
      foreignColumns: [workspaces.id],
      name: "api_keys_workspace_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.createdByUserId],
      foreignColumns: [users.id],
      name: "api_keys_created_by_user_id_fkey",
    }).onDelete("cascade"),
  ]
)

export const supportRequests = pgTable(
  "support_requests",
  {
    id: text()
      .default(sql`nanoid('sup_', 22)`)
      .primaryKey()
      .notNull(),
    workspaceId: text("workspace_id").notNull(),
    createdByUserId: text("created_by_user_id").notNull(),
    subject: text().notNull(),
    priority: text().default("normal").notNull(),
    category: text().default("support").notNull(),
    message: text().notNull(),
    status: text().default("open").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  (table) => [
    index("idx_support_requests_workspace_id").using(
      "btree",
      table.workspaceId.asc().nullsLast().op("text_ops")
    ),
    foreignKey({
      columns: [table.workspaceId],
      foreignColumns: [workspaces.id],
      name: "support_requests_workspace_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.createdByUserId],
      foreignColumns: [users.id],
      name: "support_requests_created_by_user_id_fkey",
    }).onDelete("cascade"),
    check(
      "support_requests_priority_check",
      sql`priority = ANY (ARRAY['low'::text, 'normal'::text, 'high'::text, 'urgent'::text])`
    ),
    check(
      "support_requests_category_check",
      sql`category = ANY (ARRAY['support'::text, 'billing'::text, 'security'::text, 'success'::text])`
    ),
    check(
      "support_requests_status_check",
      sql`status = ANY (ARRAY['open'::text, 'in_progress'::text, 'resolved'::text, 'closed'::text])`
    ),
  ]
)

export const reports = pgTable(
  "reports",
  {
    id: text()
      .default(sql`nanoid('rep_', 22)`)
      .primaryKey()
      .notNull(),
    websiteId: text("website_id").notNull(),
    content: text().notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.websiteId],
      foreignColumns: [websites.id],
      name: "reports_website_id_fkey",
    }).onDelete("cascade"),
  ]
)

export const gooseDbVersion = pgTable("goose_db_version", {
  id: integer().primaryKey().generatedByDefaultAsIdentity({
    name: "goose_db_version_id_seq",
    startWith: 1,
    increment: 1,
    minValue: 1,
    maxValue: 2147483647,
    cache: 1,
  }),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  versionId: bigint("version_id", { mode: "number" }).notNull(),
  isApplied: boolean("is_applied").notNull(),
  tstamp: timestamp({ mode: "string" }).defaultNow().notNull(),
})

export const userSettings = pgTable(
  "user_settings",
  {
    id: text()
      .default(sql`nanoid('uset_', 22)`)
      .primaryKey()
      .notNull(),
    userId: text("user_id").notNull(),
    emailAlerts: boolean("email_alerts").default(true).notNull(),
    weeklyDigest: boolean("weekly_digest").default(true).notNull(),
    productUpdates: boolean("product_updates").default(false).notNull(),
    billingEmails: boolean("billing_emails").default(true).notNull(),
    notifyOnScanFailure: boolean("notify_on_scan_failure")
      .default(true)
      .notNull(),
    notifyOnScoreDrop: boolean("notify_on_score_drop").default(true).notNull(),
    scoreDropThreshold: integer("score_drop_threshold").default(10).notNull(),
    slackWebhookUrl: text("slack_webhook_url"),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  (table) => [
    unique("user_settings_user_id_key").on(table.userId),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "user_settings_user_id_fkey",
    }).onDelete("cascade"),
  ]
)

export const webhookDestinations = pgTable(
  "webhook_destinations",
  {
    id: text()
      .default(sql`nanoid('wh_', 22)`)
      .primaryKey()
      .notNull(),
    userId: text("user_id").notNull(),
    workspaceId: text("workspace_id").notNull(),
    label: text().notNull(),
    url: text().notNull(),
    eventTypes: text("event_types").default("scan.failed,score.regression").notNull(),
    secret: text(),
    isEnabled: boolean("is_enabled").default(true).notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  (table) => [
    index("idx_webhook_destinations_user_id").using(
      "btree",
      table.userId.asc().nullsLast().op("text_ops")
    ),
    index("idx_webhook_destinations_workspace_id").using(
      "btree",
      table.workspaceId.asc().nullsLast().op("text_ops")
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "webhook_destinations_user_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.workspaceId],
      foreignColumns: [workspaces.id],
      name: "webhook_destinations_workspace_id_fkey",
    }).onDelete("cascade"),
  ]
)

export const websites = pgTable(
  "websites",
  {
    id: text()
      .default(sql`nanoid('web_', 22)`)
      .primaryKey()
      .notNull(),
    userId: text("user_id").notNull(),
    workspaceId: text("workspace_id").notNull(),
    name: text().notNull(),
    url: text().notNull(),
    intervalSeconds: integer("interval_seconds").default(259200).notNull(),
    isEnabled: boolean("is_enabled").default(true),
    deviceType: text("device_type").default("mobile").notNull(),
    lastSeoScore: integer("last_seo_score").default(0),
    lastPerformanceScore: integer("last_performance_score").default(0),
    lastCheckedAt: timestamp("last_checked_at", {
      withTimezone: true,
      mode: "string",
    }),
    nextCheckAt: timestamp("next_check_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  (table) => [
    index("idx_websites_scan_queue")
      .using("btree", table.nextCheckAt.asc().nullsLast().op("timestamptz_ops"))
      .where(sql`(is_enabled = true)`),
    index("idx_websites_user_id").using(
      "btree",
      table.userId.asc().nullsLast().op("text_ops")
    ),
    index("idx_websites_workspace_id").using(
      "btree",
      table.workspaceId.asc().nullsLast().op("text_ops")
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "websites_user_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.workspaceId],
      foreignColumns: [workspaces.id],
      name: "websites_workspace_id_fkey",
    }).onDelete("cascade"),
    check(
      "websites_device_type_check",
      sql`device_type = ANY (ARRAY['mobile'::text, 'desktop'::text])`
    ),
  ]
)

export const scans = pgTable(
  "scans",
  {
    id: text()
      .default(sql`nanoid('scan_', 22)`)
      .primaryKey()
      .notNull(),
    websiteId: text("website_id").notNull(),
    performanceScore: integer("performance_score"),
    seoScore: integer("seo_score"),
    accessibilityScore: integer("accessibility_score"),
    bestPracticesScore: integer("best_practices_score"),
    lcpMs: integer("lcp_ms"),
    fcpMs: integer("fcp_ms"),
    inpMs: integer("inp_ms"),
    clsScore: numeric("cls_score", { precision: 5, scale: 3 }),
    ttfbMs: integer("ttfb_ms"),
    speedIndexMs: integer("speed_index_ms"),
    pageSizeKb: integer("page_size_kb"),
    requestCount: integer("request_count"),
    status: text().default("success").notNull(),
    deviceType: text("device_type"),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  (table) => [
    index("idx_scans_website").using(
      "btree",
      table.websiteId.asc().nullsLast().op("text_ops")
    ),
    index("idx_scans_website_id_created").using(
      "btree",
      table.websiteId.asc().nullsLast().op("text_ops"),
      table.createdAt.desc().nullsFirst().op("text_ops")
    ),
    foreignKey({
      columns: [table.websiteId],
      foreignColumns: [websites.id],
      name: "scans_website_id_fkey",
    }).onDelete("cascade"),
    check(
      "scans_status_check",
      sql`status = ANY (ARRAY['success'::text, 'failed'::text])`
    ),
  ]
)

export const scanIssues = pgTable(
  "scan_issues",
  {
    id: text()
      .default(sql`nanoid('issue_', 22)`)
      .primaryKey()
      .notNull(),
    scanId: text("scan_id").notNull(),
    category: text(),
    title: text(),
    key: text().notNull(),
    description: text(),
    severity: text(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.scanId],
      foreignColumns: [scans.id],
      name: "scan_issues_scan_id_fkey",
    }).onDelete("cascade"),
    check(
      "scan_issues_severity_check",
      sql`severity = ANY (ARRAY['critical'::text, 'warning'::text, 'info'::text])`
    ),
  ]
)

export type Website = InferSelectModel<typeof websites>
export type Report = InferSelectModel<typeof reports>
export type UserSettings = InferSelectModel<typeof userSettings>
export type WebhookDestination = InferSelectModel<typeof webhookDestinations>
export type Workspace = InferSelectModel<typeof workspaces>
export type WorkspaceMember = InferSelectModel<typeof workspaceMembers>
export type WorkspaceInvite = InferSelectModel<typeof workspaceInvites>
export type BillingSubscription = InferSelectModel<typeof billingSubscriptions>
export type OnboardingState = InferSelectModel<typeof onboardingStates>
export type AuditLog = InferSelectModel<typeof auditLogs>
export type NotificationDelivery = InferSelectModel<typeof notificationDeliveries>
export type ApiKey = InferSelectModel<typeof apiKeys>
export type SupportRequest = InferSelectModel<typeof supportRequests>
