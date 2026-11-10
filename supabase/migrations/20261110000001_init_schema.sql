-- =============================================================================
-- Migration: 20261110000001_init_schema.sql
-- Purpose: Core PostgreSQL Schema for Fadli Hifziansyah Developer Portfolio & CMS
-- Best Practices Applied: supabase-postgres-best-practices
--   - UUID primary keys with gen_random_uuid()
--   - Explicit foreign key constraints & indexes on all FK/filter/sort columns
--   - Strict CHECK constraints for enums and status states
--   - Automatic updated_at trigger with SECURITY DEFINER SET search_path = ''
-- =============================================================================

create extension if not exists "pgcrypto";

-- Automatic updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- 1. Admin Users Allowlist
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'owner' check (role in ('owner', 'editor')),
  created_at timestamptz not null default timezone('utc'::text, now())
);

-- 2. Profiles (Single-owner portfolio identity & dual-lens configuration)
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  headline_en text not null,
  headline_id text not null,
  recruiter_Pitch_en text not null,
  recruiter_pitch_id text not null,
  craft_pitch_en text not null,
  craft_pitch_id text not null,
  bio_en text not null,
  bio_id text not null,
  location text not null default 'Indonesia (UTC+7)',
  email text not null,
  whatsapp_url text,
  cal_url text,
  github_url text not null,
  linkedin_url text not null,
  instagram_url text,
  cv_url text,
  avatar_url text,
  available_for_hire boolean not null default true,
  availability_label_en text not null default 'Available for Q1/Q2 Full-Stack & AI Roles',
  availability_label_id text not null default 'Tersedia untuk Peran Full-Stack & AI Q1/Q2',
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- 3. Technologies (Skills & Stack Taxonomy)
create table if not exists public.technologies (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  category text not null check (category in ('Frontend & Creative', 'Backend & Database', 'AI & Agentic Systems', 'DevOps & Cloud', 'Mobile & Cross-Platform')),
  proficiency text not null default 'Production' check (proficiency in ('Core Architecture', 'Production', 'Active Exploration')),
  years_used numeric(3,1) not null default 2.0,
  icon_name text,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_technologies_category_sort on public.technologies (category, sort_order) where is_visible = true;

-- 4. Projects (Deep-Dive Case Studies)
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  index_code text not null default '01',
  category text not null,
  year text not null,
  client_or_context text not null,
  role_en text not null,
  role_id text not null,
  summary_en text not null,
  summary_id text not null,
  problem_en text not null,
  problem_id text not null,
  architecture_en text not null,
  architecture_id text not null,
  tradeoffs_json jsonb not null default '[]'::jsonb,
  metrics_json jsonb not null default '[]'::jsonb,
  cover_image_url text,
  video_embed_url text,
  gallery_urls text[] not null default '{}',
  live_url text,
  repo_url text,
  is_featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_projects_status_sort on public.projects (status, is_featured desc, sort_order asc);
create index if not exists idx_projects_slug on public.projects (slug);

create trigger set_projects_updated_at
  before update on public.projects
  for each row execute function public.handle_updated_at();

-- 5. Project Technologies (Many-to-Many Join Table)
create table if not exists public.project_technologies (
  project_id uuid not null references public.projects(id) on delete cascade,
  technology_id uuid not null references public.technologies(id) on delete cascade,
  primary key (project_id, technology_id)
);

create index if not exists idx_project_technologies_project_id on public.project_technologies (project_id);
create index if not exists idx_project_technologies_technology_id on public.project_technologies (technology_id);

-- 6. Experiences (Work, Freelance, Leadership Ledger)
create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role_en text not null,
  role_id text not null,
  employment_type text not null default 'Full-Time',
  location text not null,
  start_date text not null,
  end_date text,
  is_current boolean not null default false,
  summary_en text not null,
  summary_id text not null,
  highlights_en text[] not null default '{}',
  highlights_id text[] not null default '{}',
  metrics_badge text,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_experiences_visible_sort on public.experiences (is_visible, sort_order asc);

-- 7. Educations (Academic Track)
create table if not exists public.educations (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  degree_en text not null,
  degree_id text not null,
  period text not null,
  location text not null,
  gpa_or_honors text,
  focus_en text not null,
  focus_id text not null,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_educations_visible_sort on public.educations (is_visible, sort_order asc);

-- 8. Certificates (Verified Credentials & Licenses)
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  issue_date text not null,
  credential_id text not null,
  verify_url text,
  file_url text,
  category text not null default 'Engineering',
  summary_en text not null,
  summary_id text not null,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_certificates_visible_sort on public.certificates (is_visible, sort_order asc);

-- 9. Contact Messages (Smart Inquiry Funnel)
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  sender_name text not null check (char_length(sender_name) between 2 and 120),
  sender_email text not null check (char_length(sender_email) between 5 and 180),
  company_or_org text,
  inquiry_scope text not null default 'full-time' check (inquiry_scope in ('full-time', 'contract', 'advisory', 'general')),
  timeline_or_budget text,
  message text not null check (char_length(message) between 10 and 4000),
  status text not null default 'unread' check (status in ('unread', 'read', 'replied', 'archived')),
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_contact_messages_status_created on public.contact_messages (status, created_at desc);

-- 10. Media Assets (Supabase Storage Metadata Registry)
create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket_name text not null check (bucket_name in ('project-media', 'profile-assets', 'certificates', 'short-videos')),
  storage_path text not null unique,
  public_url text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 26214400),
  alt_text text not null default '',
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_media_assets_bucket_created on public.media_assets (bucket_name, created_at desc);

