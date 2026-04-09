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
- Enterprise-only API access is enforced server-side.
- Sensitive write paths and API routes are rate-limited.
- `/api/health` returns runtime health for database connectivity, billing webhook readiness, and notification infrastructure.
- `/status` renders live system status from runtime checks.

## Deployment Checklist

- Use separate `dev`, `staging`, and `prod` Clerk apps and databases.
- Store secrets in your deployment platform's secret manager.
- Configure Clerk webhooks for users, organizations, and billing plan updates.
- Run migrations before switching traffic.
- Enable Valkey/Redis in production for shared caching and rate limiting.
- Configure Resend before enabling in-app support requests.
- Attach uptime monitoring and error tracking to `/api/health` and the app runtime.
