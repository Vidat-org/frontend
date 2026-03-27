create table if not exists api_keys (
  id text primary key default nanoid('key_', 22),
  workspace_id text not null references workspaces(id) on delete cascade,
  created_by_user_id text not null references users(id) on delete cascade,
  label text not null,
  key_prefix text not null,
  key_hash text not null,
  last_used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_api_keys_workspace_id on api_keys (workspace_id);

create table if not exists support_requests (
  id text primary key default nanoid('sup_', 22),
  workspace_id text not null references workspaces(id) on delete cascade,
  created_by_user_id text not null references users(id) on delete cascade,
  subject text not null,
  priority text not null default 'normal',
  category text not null default 'support',
  message text not null,
  status text not null default 'open',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  check (priority in ('low', 'normal', 'high', 'urgent')),
  check (category in ('support', 'billing', 'security', 'success')),
  check (status in ('open', 'in_progress', 'resolved', 'closed'))
);

create index if not exists idx_support_requests_workspace_id on support_requests (workspace_id);
