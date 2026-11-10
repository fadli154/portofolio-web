-- =============================================================================
-- Migration: 20261110000002_rls_policies.sql
-- Purpose: 100% Row-Level Security (RLS) Coverage across all 10 tables
-- Best Practices Applied: supabase-postgres-best-practices & security-predeploy-gate
--   - Uses `(select auth.uid())` subselect caching for O(1) per-query evaluation
--   - Public (`anon`) can only SELECT published/visible portfolio rows
--   - Public (`anon`) can INSERT into contact_messages with schema constraints
--   - Only verified admins in `public.admin_users` can perform CRUD operations
-- =============================================================================

-- Helper function to verify if current authenticated user is a registered admin
create or replace function public.is_portfolio_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where id = (select auth.uid())
  );
$$;

-- Enable RLS on every table without exception
alter table public.admin_users enable row level security;
alter table public.profiles enable row level security;
alter table public.technologies enable row level security;
alter table public.projects enable row level security;
alter table public.project_technologies enable row level security;
alter table public.experiences enable row level security;
alter table public.educations enable row level security;
alter table public.certificates enable row level security;
alter table public.contact_messages enable row level security;
alter table public.media_assets enable row level security;

-- 1. admin_users policies
create policy "Admins can read own admin record"
  on public.admin_users for select
  to authenticated
  using (id = (select auth.uid()));

-- 2. profiles policies
create policy "Public can view portfolio profile"
  on public.profiles for select
  to anon, authenticated
  using (true);

create policy "Admins can manage portfolio profile"
  on public.profiles for all
  to authenticated
  using ((select public.is_portfolio_admin()))
  with check ((select public.is_portfolio_admin()));

-- 3. technologies policies
create policy "Public can view visible technologies"
  on public.technologies for select
  to anon, authenticated
  using (is_visible = true or (select public.is_portfolio_admin()));

create policy "Admins can manage technologies"
  on public.technologies for all
  to authenticated
  using ((select public.is_portfolio_admin()))
  with check ((select public.is_portfolio_admin()));

-- 4. projects policies
create policy "Public can view published projects only"
  on public.projects for select
  to anon, authenticated
  using (status = 'published' or (select public.is_portfolio_admin()));

create policy "Admins can manage all projects"
  on public.projects for all
  to authenticated
  using ((select public.is_portfolio_admin()))
  with check ((select public.is_portfolio_admin()));

-- 5. project_technologies policies
create policy "Public can view project technology links"
  on public.project_technologies for select
  to anon, authenticated
  using (true);

create policy "Admins can manage project technology links"
  on public.project_technologies for all
  to authenticated
  using ((select public.is_portfolio_admin()))
  with check ((select public.is_portfolio_admin()));

-- 6. experiences policies
create policy "Public can view visible experiences"
  on public.experiences for select
  to anon, authenticated
  using (is_visible = true or (select public.is_portfolio_admin()));

create policy "Admins can manage experiences"
  on public.experiences for all
  to authenticated
  using ((select public.is_portfolio_admin()))
  with check ((select public.is_portfolio_admin()));

-- 7. educations policies
create policy "Public can view visible educations"
  on public.educations for select
  to anon, authenticated
  using (is_visible = true or (select public.is_portfolio_admin()));

create policy "Admins can manage educations"
  on public.educations for all
  to authenticated
  using ((select public.is_portfolio_admin()))
  with check ((select public.is_portfolio_admin()));

-- 8. certificates policies
create policy "Public can view visible certificates"
  on public.certificates for select
  to anon, authenticated
  using (is_visible = true or (select public.is_portfolio_admin()));

create policy "Admins can manage certificates"
  on public.certificates for all
  to authenticated
  using ((select public.is_portfolio_admin()))
  with check ((select public.is_portfolio_admin()));

-- 9. contact_messages policies
create policy "Public can submit contact inquiries"
  on public.contact_messages for insert
  to anon, authenticated
  with check (status = 'unread');

create policy "Admins can read and manage contact inquiries"
  on public.contact_messages for all
  to authenticated
  using ((select public.is_portfolio_admin()))
  with check ((select public.is_portfolio_admin()));

-- 10. media_assets policies
create policy "Public can view registered media assets"
  on public.media_assets for select
  to anon, authenticated
  using (true);

create policy "Admins can manage media assets"
  on public.media_assets for all
  to authenticated
  using ((select public.is_portfolio_admin()))
  with check ((select public.is_portfolio_admin()));

