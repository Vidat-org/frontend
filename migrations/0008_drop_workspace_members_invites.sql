drop table if exists workspace_invites cascade;
drop table if exists workspace_members cascade;

alter table users
  drop column if exists active_workspace_id;
