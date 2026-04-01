-- +goose Up
CREATE INDEX IF NOT EXISTS "idx_support_requests_workspace_id_created_at"
  ON "support_requests" USING btree ("workspace_id", "created_at" DESC);

CREATE INDEX IF NOT EXISTS "idx_reports_website_id_created_at"
  ON "reports" USING btree ("website_id", "created_at" DESC);

CREATE INDEX IF NOT EXISTS "idx_websites_workspace_id_created_at"
  ON "websites" USING btree ("workspace_id", "created_at" DESC);

CREATE INDEX IF NOT EXISTS "idx_scans_website_id_device_type_created_at"
  ON "scans" USING btree ("website_id", "device_type", "created_at" DESC);

CREATE INDEX IF NOT EXISTS "idx_scan_issues_scan_id_created_at"
  ON "scan_issues" USING btree ("scan_id", "created_at" DESC);

-- +goose Down
DROP INDEX IF EXISTS "idx_scan_issues_scan_id_created_at";
DROP INDEX IF EXISTS "idx_scans_website_id_device_type_created_at";
DROP INDEX IF EXISTS "idx_websites_workspace_id_created_at";
DROP INDEX IF EXISTS "idx_reports_website_id_created_at";
DROP INDEX IF EXISTS "idx_support_requests_workspace_id_created_at";
