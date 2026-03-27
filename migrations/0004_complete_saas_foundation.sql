create table if not exists workspaces (
  id text primary key default nanoid('ws_', 22),
  name text not null,
  slug text not null,
  owner_user_id text not null,
  billing_email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists workspace_members (
  id text primary key default nanoid('wsm_', 22),
  workspace_id text not null references workspaces(id) on delete cascade,
  user_id text not null references users(id) on delete cascade,
  role text not null default 'owner',
  joined_at timestamptz default now(),
  created_at timestamptz default now(),
  unique (workspace_id, user_id),
  check (role in ('owner', 'admin', 'member'))
);

create table if not exists workspace_invites (
  id text primary key default nanoid('inv_', 22),
  workspace_id text not null references workspaces(id) on delete cascade,
  email text not null,
  role text not null default 'member',
  invited_by_user_id text not null references users(id) on delete cascade,
  status text not null default 'pending',
  token text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  check (role in ('owner', 'admin', 'member')),
  check (status in ('pending', 'accepted', 'revoked', 'expired'))
);

create table if not exists billing_subscriptions (
  id text primary key default nanoid('sub_', 22),
  workspace_id text not null unique references workspaces(id) on delete cascade,
  provider text not null default 'manual',
  provider_customer_id text,
  provider_subscription_id text,
  plan_slug text not null default 'free_user',
  status text not null default 'trialing',
  interval text not null default 'month',
  currency text not null default 'sek',
  amount_sek integer not null default 0,
  trial_ends_at timestamptz,
  current_period_ends_at timestamptz,
  cancel_at_period_end boolean not null default false,
  dunning_status text not null default 'clear',
  last_invoice_url text,
  checkout_url text,
  portal_url text,
  updated_at timestamptz default now(),
  created_at timestamptz default now(),
  check (status in ('trialing', 'active', 'past_due', 'canceled', 'incomplete')),
  check (dunning_status in ('clear', 'at_risk', 'in_dunning', 'write_off'))
);

create table if not exists onboarding_states (
  id text primary key default nanoid('onb_', 22),
  workspace_id text not null unique references workspaces(id) on delete cascade,
  has_added_website boolean not null default false,
  has_run_first_scan boolean not null default false,
  has_viewed_report boolean not null default false,
  has_configured_alerts boolean not null default false,
  has_connected_integration boolean not null default false,
  completed_at timestamptz,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists audit_logs (
  id text primary key default nanoid('audit_', 22),
  workspace_id text not null references workspaces(id) on delete cascade,
  actor_user_id text references users(id) on delete set null,
  target_type text not null,
  target_id text,
  action text not null,
  summary text not null,
  metadata jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_audit_logs_workspace_id_created_at
  on audit_logs (workspace_id, created_at desc);

create table if not exists notification_deliveries (
  id text primary key default nanoid('nd_', 22),
  workspace_id text not null references workspaces(id) on delete cascade,
  website_id text references websites(id) on delete set null,
  channel text not null,
  event_type text not null,
  destination text not null,
  status text not null default 'pending',
  provider_message_id text,
  attempts integer not null default 0,
  last_attempt_at timestamptz,
  delivered_at timestamptz,
  error_message text,
  payload jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  check (channel in ('email', 'slack', 'webhook')),
  check (status in ('pending', 'sent', 'failed', 'retrying'))
);

create index if not exists idx_notification_deliveries_workspace_id_created_at
  on notification_deliveries (workspace_id, created_at desc);

alter table users add column if not exists active_workspace_id text;
alter table websites add column if not exists workspace_id text references workspaces(id) on delete cascade;
alter table webhook_destinations add column if not exists workspace_id text references workspaces(id) on delete cascade;

create index if not exists idx_websites_workspace_id on websites (workspace_id);
create index if not exists idx_webhook_destinations_workspace_id on webhook_destinations (workspace_id);
