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
} from "drizzle-orm/pg-core"
import { InferSelectModel, sql } from "drizzle-orm"

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

export const users = pgTable(
  "users",
  {
    id: text()
      .default(sql`nanoid('usr_', 22)`)
      .primaryKey()
      .notNull(),
    clerkUserId: text("clerk_user_id").notNull(),
    plan: text().default("free").notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  (table) => [unique("users_clerk_user_id_key").on(table.clerkUserId)]
)

export const websites = pgTable(
  "websites",
  {
    id: text()
      .default(sql`nanoid('web_', 22)`)
      .primaryKey()
      .notNull(),
    userId: text("user_id").notNull(),
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
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "websites_user_id_fkey",
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
