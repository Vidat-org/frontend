# Vidat Frontend

Next.js frontend for Vidat, a multi-tenant performance monitoring SaaS with Clerk auth, Clerk Billing, workspace settings, reports, and API access.

## Requirements

- Bun 1.x
- Node 20+
- PostgreSQL
- Clerk application with auth and billing enabled
- Valkey or Redis in production

## Environment Variables

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `CLERK_WEBHOOK_SIGNING_SECRET_USERS`
- `CLERK_WEBHOOK_SIGNING_SECRET_ORGANIZATIONS`
- `CLERK_WEBHOOK_SIGNING_SECRET_UPDATE_PLAN`
- `DATABASE_URL`
- `VALKEY_URL`
- `VALKEY_PREFIX` (optional)
- `BETTER_STACK_SOURCE_TOKEN` (optional)
- `BETTER_STACK_INGESTING_URL` (optional)
- `RESEND_API_KEY` (required for support email delivery)
- `SUPPORT_FROM_EMAIL` (required for support email delivery)
- `SUPPORT_INBOX_EMAIL` (optional, defaults to `support@vidat.app`)
- `x-request-id` request header is accepted and echoed back on API responses
- `NEXT_PUBLIC_DEFAULT_LOCALE`
- `NEXT_PUBLIC_BILLING_PORTAL_URL` (optional)
- `NEXT_PUBLIC_BILLING_PORTAL_FALLBACK_URL` (optional)
- `NEXT_PUBLIC_CHECKOUT_STARTER_URL` (optional)
- `NEXT_PUBLIC_CHECKOUT_PRO_URL` (optional)
- `NEXT_PUBLIC_CHECKOUT_AGENCY_URL` (optional)

## Local Development

```bash
bun install
bun run dev
```

## Quality Gates

```bash
bun run lint
bun run typecheck
bun run build
```

## Production Notes

- Clerk Billing is treated as the source of truth for subscriptions.
- Clerk Organizations is treated as the source of truth for team membership and invites.
- Team administration is intentionally Clerk-driven in v1 rather than reimplemented inside the product UI.
- Enterprise-only API access is enforced server-side.
- Sensitive write paths and API routes are rate-limited.
- `/api/health` returns runtime health for database connectivity, billing webhook readiness, and notification infrastructure.
- `/status` renders live system status from runtime checks.

## Launch Scope

- Public SaaS launch with Clerk Billing live from day one.
- Single-workspace usage with Clerk-managed team administration.
- This repo owns product UI, settings, reports, support flows, status pages, and API access.
- The scanning engine is external and must write into the shared database contract.

## Scan Data Contract

The external scanner is expected to keep these fields and tables up to date:

- `websites.lastCheckedAt`
- `websites.lastPerformanceScore`
- `websites.lastSeoScore`
- `websites.nextCheckAt`
- `scans.status`
- `scans.deviceType`
- `scan_issues`
- `reports`

## Deployment Checklist

- Use separate `dev`, `staging`, and `prod` Clerk apps and databases.
- Store secrets in your deployment platform's secret manager.
- Configure Clerk webhooks for users, organizations, and billing plan updates.
- Run migrations before switching traffic.
- Enable Valkey/Redis in production for shared caching and rate limiting.
- Configure Resend before enabling in-app support requests.
- Attach uptime monitoring and error tracking to `/api/health` and the app runtime.

## Launch Acceptance Checks

- New user can create an account, create a workspace, and land on the dashboard.
- New workspace can add a website and receive a first scan from the external scanner.
- The first report opens successfully in the dashboard.
- Billing plan changes from Clerk sync back into the app through webhooks.
- Agency workspaces can create and revoke API keys.
- Support requests send email and log delivery state.
- `/api/health` shows a degraded state when Redis or required billing webhooks are missing.
