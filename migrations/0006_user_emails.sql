ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "email" text;

CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key"
ON "users" ("email");
