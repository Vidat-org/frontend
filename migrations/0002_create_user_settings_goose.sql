-- +goose Up
CREATE TABLE IF NOT EXISTS "user_settings" (
  "id" text PRIMARY KEY DEFAULT nanoid('uset_'::text, 22) NOT NULL,
  "user_id" text NOT NULL,
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

CREATE UNIQUE INDEX IF NOT EXISTS "user_settings_user_id_key"
  ON "user_settings" ("user_id");

ALTER TABLE "user_settings"
  ADD CONSTRAINT "user_settings_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;

-- +goose Down
ALTER TABLE IF EXISTS "user_settings"
  DROP CONSTRAINT IF EXISTS "user_settings_user_id_fkey";

DROP INDEX IF EXISTS "user_settings_user_id_key";

DROP TABLE IF EXISTS "user_settings";
