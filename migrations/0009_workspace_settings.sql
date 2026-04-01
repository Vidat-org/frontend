-- +goose Up
CREATE TABLE IF NOT EXISTS "workspace_settings" (
  "id" text PRIMARY KEY DEFAULT nanoid('wset_'::text, 22) NOT NULL,
  "workspace_id" text NOT NULL,
  "email_alerts" boolean DEFAULT true NOT NULL,
  "weekly_digest" boolean DEFAULT true NOT NULL,
  "product_updates" boolean DEFAULT false NOT NULL,
  "billing_emails" boolean DEFAULT true NOT NULL,
  "notify_on_scan_failure" boolean DEFAULT true NOT NULL,
  "notify_on_score_drop" boolean DEFAULT true NOT NULL,
  "score_drop_threshold" integer DEFAULT 10 NOT NULL,
  "slack_webhook_url" text,
  "updated_at" timestamp with time zone DEFAULT now(),
  "created_at" timestamp with time zone DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS "workspace_settings_workspace_id_key"
  ON "workspace_settings" ("workspace_id");

ALTER TABLE "workspace_settings"
  ADD CONSTRAINT "workspace_settings_workspace_id_fkey"
  FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE;

INSERT INTO "workspace_settings" (
  "workspace_id",
  "email_alerts",
  "weekly_digest",
  "product_updates",
  "billing_emails",
  "notify_on_scan_failure",
  "notify_on_score_drop",
  "score_drop_threshold",
  "slack_webhook_url",
  "updated_at",
  "created_at"
)
SELECT
  w."id",
  coalesce(us."email_alerts", true),
  coalesce(us."weekly_digest", true),
  coalesce(us."product_updates", false),
  coalesce(us."billing_emails", true),
  coalesce(us."notify_on_scan_failure", true),
  coalesce(us."notify_on_score_drop", true),
  coalesce(us."score_drop_threshold", 10),
  us."slack_webhook_url",
  coalesce(us."updated_at", now()),
  coalesce(us."created_at", now())
FROM "workspaces" w
LEFT JOIN "user_settings" us ON us."user_id" = w."owner_user_id"
ON CONFLICT ("workspace_id") DO NOTHING;

-- +goose Down
DROP TABLE IF EXISTS "workspace_settings";
