-- 0004_create_audit_logs.sql
-- Creates admin audit log table for tracking all administrative actions

-- Create audit log table
create table if not exists admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  resource_type text not null,
  resource_id text,
  ip_address text,
  user_agent text,
  metadata jsonb,
  created_at timestamp with time zone default now()
);

-- Add indexes for common queries
create index if not exists idx_audit_logs_user_id on admin_audit_logs(user_id);
create index if not exists idx_audit_logs_created_at on admin_audit_logs(created_at desc);
create index if not exists idx_audit_logs_resource on admin_audit_logs(resource_type, resource_id);
create index if not exists idx_audit_logs_action on admin_audit_logs(action);

-- Add comments for documentation
comment on table admin_audit_logs is 'Stores all administrative actions for security auditing';
comment on column admin_audit_logs.user_id is 'Admin user who performed the action';
comment on column admin_audit_logs.action is 'Action type: CREATE, UPDATE, DELETE, etc.';
comment on column admin_audit_logs.resource_type is 'Type of resource: project, blog, experience, etc.';
comment on column admin_audit_logs.resource_id is 'ID of the specific resource affected';
comment on column admin_audit_logs.metadata is 'Additional context about the action';

-- Enable RLS
alter table admin_audit_logs enable row level security;

-- Only admins can read logs
create policy "Admins can read audit logs"
on admin_audit_logs for select
to authenticated
using (
  auth.jwt()->>'role' = 'admin'
);

-- Service role can insert logs (used by server-side code)
create policy "Service role can insert audit logs"
on admin_audit_logs for insert
to service_role
with check (true);

-- Prevent updates and deletes (audit logs should be immutable)
create policy "Audit logs are immutable"
on admin_audit_logs for update
to authenticated
using (false);

create policy "Audit logs cannot be deleted"
on admin_audit_logs for delete
to authenticated
using (false);
