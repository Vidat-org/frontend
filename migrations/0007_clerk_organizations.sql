alter table workspaces
  add column if not exists clerk_organization_id text;

create unique index if not exists workspaces_clerk_organization_id_key
  on workspaces (clerk_organization_id);
