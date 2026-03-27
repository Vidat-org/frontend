-- +goose Up
CREATE TABLE IF NOT EXISTS "webhook_destinations" (
  "id" text PRIMARY KEY DEFAULT nanoid('wh_'::text, 22) NOT NULL,
  "user_id" text NOT NULL,
  "label" text NOT NULL,
  "url" text NOT NULL,
  "event_types" text DEFAULT 'scan.failed,score.regression' NOT NULL,
  "secret" text,
  "is_enabled" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "idx_webhook_destinations_user_id"
  ON "webhook_destinations" ("user_id");

ALTER TABLE "webhook_destinations"
  ADD CONSTRAINT "webhook_destinations_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;

-- +goose Down
ALTER TABLE IF EXISTS "webhook_destinations"
  DROP CONSTRAINT IF EXISTS "webhook_destinations_user_id_fkey";

DROP INDEX IF EXISTS "idx_webhook_destinations_user_id";

DROP TABLE IF EXISTS "webhook_destinations";
