-- =============================================================================
-- Migration: 20261110000003_storage_buckets.sql
-- Purpose: Configure Supabase Storage buckets with strict MIME and size limits
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('project-media', 'project-media', true, 5242880, array['image/webp', 'image/png', 'image/jpeg', 'image/avif']),
  ('profile-assets', 'profile-assets', true, 5242880, array['image/webp', 'image/png', 'image/jpeg', 'application/pdf']),
  ('certificates', 'certificates', true, 5242880, array['image/webp', 'image/png', 'application/pdf']),
  ('short-videos', 'short-videos', true, 26214400, array['video/mp4', 'video/webm'])
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Storage RLS Policies
create policy "Public can read portfolio storage buckets"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id in ('project-media', 'profile-assets', 'certificates', 'short-videos'));

create policy "Admins can upload to portfolio storage buckets"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id in ('project-media', 'profile-assets', 'certificates', 'short-videos')
    and (select public.is_portfolio_admin())
  );

create policy "Admins can update portfolio storage objects"
  on storage.objects for update
  to authenticated
  using (
    bucket_id in ('project-media', 'profile-assets', 'certificates', 'short-videos')
    and (select public.is_portfolio_admin())
  );

create policy "Admins can delete portfolio storage objects"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id in ('project-media', 'profile-assets', 'certificates', 'short-videos')
    and (select public.is_portfolio_admin())
  );

