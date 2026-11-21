-- =============================================================================
-- Migration: 20261121000008_categories_relational_schema.sql
-- Purpose: Centralized Dynamic Categories Schema & Many-to-Many Relational Mappings
-- Best Practices Applied: supabase-postgres-best-practices & security-predeploy-gate
--   - UUID primary keys with gen_random_uuid()
--   - Strict foreign keys with ON DELETE CASCADE
--   - B-Tree indexes on all FKs, slugs, and filter/sort columns
--   - 100% RLS Coverage using subselect cached `(select public.is_portfolio_admin())`
--   - Automatic updated_at trigger via public.handle_updated_at()
--   - Dual-mode backward compatibility for existing project/cert category strings
-- =============================================================================

begin;

-- 1. Master Categories Table
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  slug text not null unique,
  scope text not null default 'all' check (scope in ('all', 'projects', 'certificates', 'experiences', 'technologies', 'general')),
  color_hex text not null default '#c4e22e' check (color_hex ~ '^#[0-9a-fA-F]{6}$'),
  description text default '',
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_categories_slug on public.categories (slug);
create index if not exists idx_categories_scope_sort on public.categories (scope, sort_order asc) where is_visible = true;

drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at
  before update on public.categories
  for each row execute function public.handle_updated_at();

-- 2. Project Categories Junction Table (Many-to-Many)
create table if not exists public.project_categories (
  project_id uuid not null references public.projects(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  created_at timestamptz not null default timezone('utc'::text, now()),
  primary key (project_id, category_id)
);

create index if not exists idx_project_categories_project_id on public.project_categories (project_id);
create index if not exists idx_project_categories_category_id on public.project_categories (category_id);

-- 3. Certificate Categories Junction Table (Many-to-Many)
create table if not exists public.certificate_categories (
  certificate_id uuid not null references public.certificates(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  created_at timestamptz not null default timezone('utc'::text, now()),
  primary key (certificate_id, category_id)
);

create index if not exists idx_certificate_categories_cert_id on public.certificate_categories (certificate_id);
create index if not exists idx_certificate_categories_cat_id on public.certificate_categories (category_id);

-- 4. Experience Categories Junction Table (Many-to-Many)
create table if not exists public.experience_categories (
  experience_id uuid not null references public.experiences(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  created_at timestamptz not null default timezone('utc'::text, now()),
  primary key (experience_id, category_id)
);

create index if not exists idx_experience_categories_exp_id on public.experience_categories (experience_id);
create index if not exists idx_experience_categories_cat_id on public.experience_categories (category_id);

-- 5. Row-Level Security (RLS) Coverage
alter table public.categories enable row level security;
alter table public.project_categories enable row level security;
alter table public.certificate_categories enable row level security;
alter table public.experience_categories enable row level security;

-- Categories RLS
drop policy if exists "Public can view visible categories" on public.categories;
create policy "Public can view visible categories"
  on public.categories for select
  to anon, authenticated
  using (is_visible = true or (select public.is_portfolio_admin()));

drop policy if exists "Admins can manage categories" on public.categories;
create policy "Admins can manage categories"
  on public.categories for all
  to authenticated
  using ((select public.is_portfolio_admin()))
  with check ((select public.is_portfolio_admin()));

-- Project Categories RLS
drop policy if exists "Public can view project categories" on public.project_categories;
create policy "Public can view project categories"
  on public.project_categories for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can manage project categories" on public.project_categories;
create policy "Admins can manage project categories"
  on public.project_categories for all
  to authenticated
  using ((select public.is_portfolio_admin()))
  with check ((select public.is_portfolio_admin()));

-- Certificate Categories RLS
drop policy if exists "Public can view certificate categories" on public.certificate_categories;
create policy "Public can view certificate categories"
  on public.certificate_categories for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can manage certificate categories" on public.certificate_categories;
create policy "Admins can manage certificate categories"
  on public.certificate_categories for all
  to authenticated
  using ((select public.is_portfolio_admin()))
  with check ((select public.is_portfolio_admin()));

-- Experience Categories RLS
drop policy if exists "Public can view experience categories" on public.experience_categories;
create policy "Public can view experience categories"
  on public.experience_categories for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can manage experience categories" on public.experience_categories;
create policy "Admins can manage experience categories"
  on public.experience_categories for all
  to authenticated
  using ((select public.is_portfolio_admin()))
  with check ((select public.is_portfolio_admin()));

-- 6. Initial Seed Data (Categories)
insert into public.categories (name, slug, scope, color_hex, description, sort_order, is_visible)
values
  -- Project Categories
  ('AI & Computer Vision', 'ai-computer-vision', 'projects', '#c4e22e', 'Model vision on-device, deteksi objek, dan klasifikasi multimodal', 1, true),
  ('Mobile Accessibility', 'mobile-accessibility', 'projects', '#38bdf8', 'Aplikasi mobile inklusif, teks-ke-suara, dan ramah disabilitas', 2, true),
  ('GovTech & Sektor Publik', 'govtech-public-sector', 'projects', '#34d399', 'Sistem administrasi kependudukan, pelaporan, dan tata kelola instansi', 3, true),
  ('Web Application & Architecture', 'web-architecture', 'projects', '#a78bfa', 'Arsitektur web modern full-stack berbasis Next.js, Laravel, dan relasional DB', 4, true),
  ('IoT & Edge AI', 'iot-edge-ai', 'projects', '#fbbf24', 'Ekosistem IoT smartband, sensorik cerdas, dan embedded computing', 5, true),
  ('Academic & Research', 'academic-research', 'projects', '#f472b6', 'Portal studi akademik, matriks SWOT, dan komputasi riset perkuliahan', 6, true),

  -- Certificate Categories
  ('Kompetisi Nasional', 'kompetisi-nasional', 'certificates', '#c4e22e', 'Kejuaraan sains, inovasi teknologi, dan olimpiade tingkat nasional', 7, true),
  ('Kompetensi & Lisensi', 'kompetensi-lisensi', 'certificates', '#38bdf8', 'Sertifikasi kompetensi keahlian dan lisensi profesional terverifikasi', 8, true),
  ('Kursus & Pelatihan', 'kursus-pelatihan', 'certificates', '#a78bfa', 'Bootcamp, kursus intensif teknologi web, mobile, dan kecerdasan buatan', 9, true),
  ('Akademik Perguruan Tinggi', 'akademik-pt', 'certificates', '#fbbf24', 'Penghargaan akademik, dekan, dan prestasi perkuliahan', 10, true),

  -- Experience Categories
  ('Pemerintahan & Dinas Kominfo', 'exp-govtech', 'experiences', '#34d399', 'Pengalaman kerja dan magang resmi pada dinas/instansi pemerintah', 11, true),
  ('Proyek Klien & Freelance', 'exp-freelance', 'experiences', '#38bdf8', 'Pengerjaan perangkat lunak komersial untuk klien mandiri dan institusi', 12, true),
  ('Kepemimpinan & Organisasi', 'exp-leadership', 'experiences', '#f472b6', 'Manajemen tim, kepengurusan himpunan, dan kolaborasi kelompok riset', 13, true),

  -- Universal Categories
  ('General Engineering', 'general-engineering', 'all', '#c4e22e', 'Domain rekayasa perangkat lunak dan arsitektur sistem umum', 14, true)
on conflict (slug) do update set
  name = excluded.name,
  scope = excluded.scope,
  color_hex = excluded.color_hex,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_visible = excluded.is_visible;

-- 7. Backfill Existing Projects into project_categories
insert into public.project_categories (project_id, category_id)
select p.id, c.id
from public.projects p
cross join public.categories c
where (
  (p.slug = 'smart-hajj-vision-ai' and c.slug in ('ai-computer-vision', 'mobile-accessibility', 'iot-edge-ai'))
  or (p.slug = 'kominfo-simduk-laravel' and c.slug in ('govtech-public-sector', 'web-architecture'))
  or (p.slug = 'govtech-portal-system' and c.slug in ('govtech-public-sector', 'web-architecture'))
  or (p.slug = 'kewirausahaan-k1-ecosystem' and c.slug in ('academic-research', 'web-architecture'))
)
on conflict (project_id, category_id) do nothing;

-- 8. Backfill Existing Certificates into certificate_categories
insert into public.certificate_categories (certificate_id, category_id)
select cert.id, c.id
from public.certificates cert
cross join public.categories c
where (
  (cert.title ilike '%OASE%' and c.slug in ('kompetisi-nasional', 'akademik-pt'))
  or (cert.title ilike '%IT''s Day%' and c.slug in ('kompetisi-nasional', 'web-architecture'))
  or (c.slug = 'kompetisi-nasional')
)
on conflict (certificate_id, category_id) do nothing;

commit;
