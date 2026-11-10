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

-- =============================================================================
-- Migration: 20261110000004_seed_fadli_portfolio.sql
-- Purpose: Seed Fadli Hifziansyah's Real Personal, Academic & Project Data
-- Best Practices Applied: supabase-postgres-best-practices
--   - Idempotent ON CONFLICT (slug) DO UPDATE upserts
--   - Matches src/data/site.ts 100%
-- =============================================================================

-- 1. Seed Profile (Fadli Hifziansyah @fadli154)
insert into public.profiles (
  full_name,
  headline_en,
  headline_id,
  recruiter_pitch_en,
  recruiter_pitch_id,
  craft_pitch_en,
  craft_pitch_id,
  bio_en,
  bio_id,
  location,
  email,
  cal_url,
  github_url,
  linkedin_url,
  instagram_url,
  cv_url,
  avatar_url,
  available_for_hire,
  availability_label_en,
  availability_label_id
)
select
  'Fadli Hifziansyah',
  'Informatics Student · Full-Stack Web, Mobile & Computer Vision Developer',
  'Mahasiswa Informatika · Full-Stack Web, Mobile & Computer Vision Developer',
  'Full-Stack Web, Mobile & AI Developer with public-sector experience (Dinas Kominfo SIMDUK, GovTech, Smart Hajj AI).',
  'Pengembang Full-Stack Web, Mobile & AI dengan pengalaman instansi publik (SIMDUK Dinas Kominfo, GovTech, Smart Hajj AI).',
  'Building practical web, mobile, and computer vision applications.',
  'Membangun solusi aplikasi web, mobile, dan computer vision yang aplikatif.',
  'I am Fadli Hifziansyah. I use this portfolio to document my learning process, university academic works, and software projects across Laravel, Next.js, Flutter, and Computer Vision AI.',
  'Saya Fadli Hifziansyah. Portofolio ini saya gunakan untuk mendokumentasikan proses belajar, karya akademik perkuliahan, serta proyek komputasi di bidang Laravel, Next.js, Flutter, dan Computer Vision AI.',
  'Indonesia · UTC+7',
  'fadli.hifziansyah@gmail.com',
  'https://www.linkedin.com/in/fadli-hifziansyah-1b26902ba/',
  'https://github.com/fadli154',
  'https://www.linkedin.com/in/fadli-hifziansyah-1b26902ba/',
  'https://www.instagram.com/fadli.890',
  '/cv-fadli-hifziansyah.pdf',
  'https://github.com/fadli154.png',
  true,
  'Active Informatics Student (Group K-1) · Open for Internship, Freelance & Research',
  'Mahasiswa Aktif Informatika (Kelompok K-1) · Terbuka untuk Magang, Freelance & Riset'
where not exists (select 1 from public.profiles limit 1);

-- 2. Seed Technologies
insert into public.technologies (name, slug, category, proficiency, years_used, sort_order, is_visible)
values
  ('Laravel & PHP', 'laravel-php', 'Backend & Database', 'Core Architecture', 2.5, 1, true),
  ('React & Next.js', 'react-nextjs', 'Frontend & Creative', 'Core Architecture', 2.5, 2, true),
  ('TypeScript & JavaScript', 'ts-js', 'Frontend & Creative', 'Core Architecture', 2.5, 3, true),
  ('Tailwind CSS & Bootstrap', 'tailwind-bootstrap', 'Frontend & Creative', 'Core Architecture', 3.0, 4, true),
  ('MySQL, PostgreSQL & MongoDB', 'databases', 'Backend & Database', 'Core Architecture', 2.5, 5, true),
  ('Node.js & Express.js', 'nodejs-express', 'Backend & Database', 'Production', 2.0, 6, true),
  ('Flutter & Dart', 'flutter-dart', 'Mobile & Cross-Platform', 'Production', 2.0, 7, true),
  ('Python, OpenCV & MediaPipe', 'python-cv', 'AI & Agentic Systems', 'Core Architecture', 2.0, 8, true),
  ('TensorFlow, PyTorch & Scikit-Learn', 'dl-ml', 'AI & Agentic Systems', 'Production', 1.5, 9, true),
  ('Git, GitHub CI/CD & Figma', 'git-figma', 'DevOps & Cloud', 'Production', 3.0, 10, true)
on conflict (slug) do update set
  name = excluded.name,
  category = excluded.category,
  proficiency = excluded.proficiency,
  sort_order = excluded.sort_order,
  is_visible = excluded.is_visible;

-- 3. Seed Projects (4 Flagship Projects of Fadli Hifziansyah)
insert into public.projects (
  title,
  slug,
  index_code,
  category,
  year,
  client_or_context,
  role_en,
  role_id,
  summary_en,
  summary_id,
  problem_en,
  problem_id,
  architecture_en,
  architecture_id,
  live_url,
  repo_url,
  is_featured,
  status,
  sort_order
)
values
  (
    'Smart Hajj: Sistem Aksesibilitas Inklusif Berbasis AI & Computer Vision',
    'smart-hajj-vision-ai',
    '01',
    'AI & Computer Vision · Mobile Accessibility',
    '2025 - 2026',
    'Inovasi AI Unggulan · Aksesibilitas Jemaah Haji',
    'AI & Computer Vision Engineer',
    'Insinyur AI & Computer Vision',
    'Inclusive AI and computer vision platform assisting Hajj pilgrims to worship and transact independently via real-time Saudi Riyal (SAR) banknote detection and two-way sign language translation.',
    'Platform kecerdasan buatan dan visi komputer inklusif untuk mendampingi jemaah haji beribadah dan bertransaksi secara mandiri melalui deteksi uang Riyal (SAR) dan penerjemah bahasa isyarat dua arah.',
    'Elderly and deaf or speech-impaired Hajj pilgrims face communication barriers with officers and difficulty identifying Saudi Riyal banknote denominations.',
    'Jemaah haji lansia maupun penyandang disabilitas rungu dan wicara sering menghadapi kendala komunikasi dengan petugas serta kesulitan mengenali pecahan mata uang Riyal Arab Saudi (SAR).',
    'Integrated 3 AI modules: (1) Computer Vision Riyal Banknote Detector with automatic TTS readout, (2) Sign Language to Text & Speech using MediaPipe 21 hand landmarks, and (3) Officer Speech/Text to Sign Language visualization.',
    'Merancang tiga modul AI terintegrasi: (1) Pendeteksi Mata Uang Riyal berbasis Computer Vision dengan keluaran suara TTS, (2) Konversi Bahasa Isyarat ke Teks & Suara menggunakan 21 titik tangan MediaPipe, serta (3) Penerjemah Suara/Teks Petugas ke visualisasi bahasa isyarat.',
    'https://github.com/fadli154',
    'https://github.com/fadli154',
    true,
    'published',
    1
  ),
  (
    'SIMDUK: Aplikasi Web Pendataan Kependudukan (Dinas Kominfo)',
    'kominfo-simduk-laravel',
    '02',
    'GovTech & Public Administration · Laravel & MySQL',
    '2025',
    'Dinas Komunikasi dan Informatika (Kominfo)',
    'Web Developer Intern',
    'Web Developer Intern (Magang Resmi)',
    'Web-based population data management platform (SIMDUK) built on Laravel and MySQL featuring NIK/KK validation, RT/RW census aggregation, and Role-Based Access Control.',
    'Platform manajemen data kependudukan berbasis web (SIMDUK) dengan Laravel dan MySQL yang mencakup validasi NIK/KK, agregasi sensus RT/RW, serta otentikasi berjenjang (RBAC).',
    'Manual population record keeping and fragmented spreadsheets caused slow demographic aggregation and lack of tiered verification control.',
    'Pencatatan data kependudukan manual dan berkas spreadsheet yang terpisah memicu lambatnya rekapitulasi demografi serta belum adanya pembagian wewenang verifikasi.',
    'Modular MVC web application on Laravel backed by normalized MySQL relational tables, server-side NIK/KK validation, dynamic demographic filters, and RBAC authentication.',
    'Aplikasi web berarsitektur MVC dengan Laravel dan skema database relasional MySQL ternormalisasi, dilengkapi validasi NIK/KK, filter demografi dinamis, serta hak akses RBAC.',
    'https://github.com/fadli154',
    'https://github.com/fadli154',
    true,
    'published',
    2
  ),
  (
    'GovTech Portal: Sistem Pelaporan Daring & Integrasi Data Instansi Publik',
    'govtech-portal-system',
    '03',
    'Full-Stack Web · Public Sector Digitalization',
    '2024 - 2026',
    'Instansi Pemerintah & Sektor Publik (Freelance)',
    'Freelance Software Developer',
    'Freelance Software Developer',
    'Designed and delivered agency-scale software solutions supporting operational transparency, online reporting, periodic document status tracking, and inter-division data integration.',
    'Merancang dan menyelesaikan solusi perangkat lunak skala instansi untuk mendukung transparansi operasional, pelaporan daring, pelacakan status berkas berkala, dan integrasi data antardivisi.',
    'Public sector divisions relied on physical document routing and disconnected reporting formats.',
    'Divisi operasional instansi sebelumnya mengandalkan pengiriman berkas fisik dan format laporan terpisah.',
    'Centralized web portal featuring structured submission forms, staged SOP verification workflows, role-scoped dashboards, and optimized relational queries.',
    'Portal web terpusat dengan formulir pelaporan terstruktur, alur verifikasi SOP bertahap, dasbor sesuai wewenang divisi, serta optimasi kueri database.',
    'https://github.com/fadli154',
    'https://github.com/fadli154',
    true,
    'published',
    3
  ),
  (
    'Portal Akademik Kewirausahaan & Hub Kolaborasi Kelompok K-1',
    'kewirausahaan-k1-ecosystem',
    '04',
    'Academic Portal · Entrepreneurship & SWOT System',
    '2025 - 2026',
    'Program Studi Informatika · Kelompok K-1',
    'Web Developer & Member of Group K-1',
    'Pengembang Web & Anggota Kelompok K-1',
    'Interactive academic portal documenting 6 Entrepreneurship course sessions with attendance proof uploads, a 20-point personal SWOT self-evaluation matrix, and a unified directory for Informatics Group K-1.',
    'Portal dokumentasi akademik interaktif untuk mata kuliah Kewirausahaan yang memuat log bukti kehadiran 6 pertemuan, matriks evaluasi diri SWOT 20 poin, serta direktori terpadu 5 anggota Kelompok K-1 Informatika.',
    'Coursework documentation, weekly attendance evidence, and group portfolio links are often scattered across separate folders.',
    'Dokumentasi perkuliahan, bukti kehadiran mingguan, dan tautan portofolio anggota kelompok sering tersebar di berbagai tempat.',
    'Interactive two-tab academic module handling Sessions 1 to 6 attendance proof uploads and mapping all 5 Group K-1 members with their Entrepreneur vs. Employee SWOT classifications.',
    'Modul akademik dua sub-menu yang menangani unggah bukti kehadiran Pertemuan 1 s/d 6 serta memetakan 5 anggota Kelompok K-1 beserta klasifikasi profil SWOT (Pengusaha vs Pegawai).',
    'https://sites.google.com/view/reynaldi-porto/portofolio',
    'https://sites.google.com/view/pdhlii/halaman-muka',
    true,
    'published',
    4
  )
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  year = excluded.year,
  client_or_context = excluded.client_or_context,
  role_en = excluded.role_en,
  role_id = excluded.role_id,
  summary_en = excluded.summary_en,
  summary_id = excluded.summary_id,
  problem_en = excluded.problem_en,
  problem_id = excluded.problem_id,
  architecture_en = excluded.architecture_en,
  architecture_id = excluded.architecture_id,
  live_url = excluded.live_url,
  repo_url = excluded.repo_url,
  is_featured = excluded.is_featured,
  status = excluded.status,
  sort_order = excluded.sort_order;

-- ============================================================================
-- Migration: 20261110000005_coursework_and_dynamic_cms.sql
-- Purpose: Add dynamic `public.coursework_sessions` table for Mata Kuliah
--          Kewirausahaan (Pertemuan, Absen, Bukti Kehadiran, dan Tugas)
--          with 100% RLS coverage, and align initial Experience & Project
--          records to 1 flagship item each for dynamic Admin CMS management.
-- ============================================================================

begin;

create table if not exists public.coursework_sessions (
  id uuid primary key default gen_random_uuid(),
  session_number integer not null unique,
  code text not null,
  title_id text not null,
  title_en text not null,
  desc_id text not null default '',
  desc_en text not null default '',
  session_date text not null default '2026',
  attendance_status text not null default 'Hadir' check (attendance_status in ('Hadir', 'Izin', 'Sakit', 'Belum Dimulai')),
  attendance_proof_url text,
  task_title text not null default '',
  task_description text not null default '',
  task_url text not null default '',
  task_status text not null default 'Selesai' check (task_status in ('Selesai', 'Proses', 'Belum Ada Tugas')),
  is_visible boolean not null default true,
  sort_order integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_coursework_sessions_order
  on public.coursework_sessions (is_visible, session_number asc);

alter table public.coursework_sessions enable row level security;

drop policy if exists "Public anon can read visible coursework sessions" on public.coursework_sessions;
create policy "Public anon can read visible coursework sessions"
  on public.coursework_sessions
  for select
  to anon, authenticated
  using (is_visible = true or public.is_portfolio_admin());

drop policy if exists "Portfolio admin full CRUD on coursework sessions" on public.coursework_sessions;
create policy "Portfolio admin full CRUD on coursework sessions"
  on public.coursework_sessions
  for all
  to authenticated
  using (public.is_portfolio_admin())
  with check (public.is_portfolio_admin());

insert into public.coursework_sessions (
  session_number,
  code,
  title_id,
  title_en,
  desc_id,
  desc_en,
  session_date,
  attendance_status,
  attendance_proof_url,
  task_title,
  task_description,
  task_url,
  task_status,
  sort_order
)
values
  (
    1,
    'PERTEMUAN 01',
    'Pengantar & Kontrak Perkuliahan Kewirausahaan',
    'Introduction & Entrepreneurship Course Contract',
    'Dokumentasi kehadiran perdana, pembentukan Kelompok K-1, dan pengenalan visi kewirausahaan teknologi.',
    'First session attendance documentation, formation of Group K-1, and introduction to tech entrepreneurship.',
    'Minggu 1 · 2026',
    'Hadir',
    null,
    'Pembentukan Kelompok K-1 & Kontrak Belajar',
    'Menyusun struktur anggota Kelompok K-1 (5 anggota) serta membuat portal dokumentasi web masing-masing anggota.',
    'https://sites.google.com/view/reynaldi-porto/portofolio',
    'Selesai',
    1
  ),
  (
    2,
    'PERTEMUAN 02',
    'Eksplorasi Peluang & Ideasi Bisnis Teknologi',
    'Opportunity Exploration & Tech Business Ideation',
    'Dokumentasi kehadiran pertemuan ke-2 mengenai identifikasi masalah pasar dan validasi ide solusi berbasis perangkat lunak.',
    'Session 2 attendance documentation covering market problem identification and software solution validation.',
    'Minggu 2 · 2026',
    'Hadir',
    null,
    'Riset Masalah & Ideasi Solusi Digital',
    'Mengidentifikasi permasalahan layanan publik dan aksesibilitas jemaah sebagai dasar ide produk teknologi.',
    'https://sites.google.com/view/pdhlii/halaman-muka',
    'Selesai',
    2
  ),
  (
    3,
    'PERTEMUAN 03',
    'Analisis SWOT Diri & Karakteristik Wirausaha vs Intrapreneur',
    'Personal SWOT Analysis & Entrepreneur vs Intrapreneur Profile',
    'Dokumentasi kehadiran pertemuan ke-3 membahas pemetaan 10 kekuatan, 10 evaluasi diri, dan klasifikasi peran anggota Kelompok K-1.',
    'Session 3 attendance documentation discussing 10 strengths, 10 self-evaluations, and Group K-1 role mapping.',
    'Minggu 3 · 2026',
    'Hadir',
    null,
    'Penyusunan 20 Poin Evaluasi SWOT Pribadi',
    'Memetakan 10 Kekuatan Utama (Strengths) dan 10 Area Evaluasi (Weaknesses) serta menetapkan profil Intrapreneur/Pegawai.',
    'https://sites.google.com/view/pdhlii/halaman-muka',
    'Selesai',
    3
  ),
  (
    4,
    'PERTEMUAN 04',
    'Perancangan Model Bisnis & Strategi Produk',
    'Business Model Design & Product Strategy',
    'Dokumentasi kehadiran pertemuan ke-4 dalam menyusun proposisi nilai dan struktur layanan aplikasi.',
    'Session 4 attendance documentation on crafting value propositions and application service structures.',
    'Minggu 4 · 2026',
    'Hadir',
    null,
    'Business Model Canvas & Value Proposition',
    'Merancang struktur nilai produk dan keberlanjutan implementasi teknologi pada sektor instansi dan masyarakat.',
    'https://sites.google.com/view/reynaldi-porto/portofolio',
    'Selesai',
    4
  ),
  (
    5,
    'PERTEMUAN 05',
    'Pengembangan Prototipe & Integrasi Ekosistem Web K-1',
    'Prototype Development & Group K-1 Web Ecosystem Integration',
    'Dokumentasi kehadiran pertemuan ke-5 mengenai integrasi portofolio web kelompok dan kesiapan prototipe produk.',
    'Session 5 attendance documentation on integrating the group web portfolio and product prototype readiness.',
    'Minggu 5 · 2026',
    'Hadir',
    null,
    'Integrasi Tautan Portofolio Kelompok K-1',
    'Menghubungkan seluruh portofolio 5 anggota Kelompok K-1 dalam satu direktori kolaboratif yang saling terhubung.',
    'https://sites.google.com/view/reynaldi-porto/portofolio',
    'Selesai',
    5
  ),
  (
    6,
    'PERTEMUAN 06',
    'Evaluasi Kemajuan & Presentasi Proyek Kewirausahaan K-1',
    'Progress Evaluation & Group K-1 Entrepreneurship Presentation',
    'Dokumentasi kehadiran pertemuan ke-6 sebagai evaluasi berkala atas pencapaian tugas kolaboratif Kelompok K-1.',
    'Session 6 attendance documentation reviewing collaborative coursework milestones and Group K-1 presentation.',
    'Minggu 6 · 2026',
    'Hadir',
    null,
    'Laporan Evaluasi & Presentasi Kelompok K-1',
    'Menyajikan hasil dokumentasi 6 pertemuan, matriks SWOT, dan demonstrasi prototipe aplikasi di hadapan dosen pengampu.',
    'https://sites.google.com/view/pdhlii/halaman-muka',
    'Selesai',
    6
  )
on conflict (session_number) do update set
  code = excluded.code,
  title_id = excluded.title_id,
  title_en = excluded.title_en,
  desc_id = excluded.desc_id,
  desc_en = excluded.desc_en,
  session_date = excluded.session_date,
  attendance_status = excluded.attendance_status,
  task_title = excluded.task_title,
  task_description = excluded.task_description,
  task_url = excluded.task_url,
  task_status = excluded.task_status,
  sort_order = excluded.sort_order,
  updated_at = now();

commit;

-- ============================================================================
-- Migration: 20261110000006_certificates_drift_wall.sql
-- Purpose: Make `public.certificates` CMS-ready for the Drift Wall section.
--   - image_url  : tile/lightbox image (Storage public URL or /public path)
--   - file_url   : original document (PDF/JPG) shown via "Lihat Dokumen"
--   - updated_at : maintained by the shared handle_updated_at() trigger
--   - URL CHECK constraints block javascript:/data: URIs at the database level
--   - Allow JPEG uploads in the `certificates` Storage bucket
--   - Seed Fadli's first two real certificates (idempotent)
-- RLS: existing policies from 20261110000002 stay in force
--   (anon reads is_visible rows only, admins get full CRUD).
-- ============================================================================

begin;

alter table public.certificates
  add column if not exists image_url text,
  add column if not exists updated_at timestamptz not null default timezone('utc'::text, now());

alter table public.certificates alter column credential_id set default '';
alter table public.certificates alter column summary_en set default '';
alter table public.certificates alter column summary_id set default '';
alter table public.certificates alter column category set default 'Kompetisi';

alter table public.certificates drop constraint if exists certificates_title_length;
alter table public.certificates
  add constraint certificates_title_length check (char_length(title) between 3 and 200);

alter table public.certificates drop constraint if exists certificates_safe_urls;
alter table public.certificates
  add constraint certificates_safe_urls check (
    (image_url is null or image_url ~ '^(https://|/)')
    and (file_url is null or file_url ~ '^(https://|/)')
    and (verify_url is null or verify_url ~ '^https://')
  );

drop trigger if exists set_certificates_updated_at on public.certificates;
create trigger set_certificates_updated_at
  before update on public.certificates
  for each row execute function public.handle_updated_at();

update storage.buckets
set allowed_mime_types = array['image/webp', 'image/png', 'image/jpeg', 'application/pdf']
where id = 'certificates';

insert into public.certificates (
  id, title, issuer, issue_date, credential_id, verify_url, file_url, image_url,
  category, summary_id, summary_en, sort_order, is_visible
)
values
  (
    '6f1d2c3a-0001-4a5b-9c01-0e0f00000001',
    'Juara II Literasi Inovasi Teknologi · OASE III PTKIN 2026',
    'Kementerian Agama Republik Indonesia',
    '7 November 2026',
    '712/Dt.I.III/PP.01/11/2026',
    null,
    '/sertif/oase-juara-2-lit.pdf',
    '/sertif/oase-juara-2-lit.webp',
    'Kompetisi',
    'Juara II cabang Literasi Inovasi Teknologi pada Olimpiade Agama, Sains, dan Riset (OASE) III PTKIN se-Indonesia, UIN Sunan Kalijaga Yogyakarta, 3–7 November 2026. Mewakili UIN Sultan Maulana Hasanuddin Banten.',
    'Second place, Technology Innovation Literacy, at the 3rd Olympiad of Religion, Science and Research (OASE) for Indonesian Islamic universities, UIN Sunan Kalijaga Yogyakarta, 3–7 November 2026.',
    1,
    true
  ),
  (
    '6f1d2c3a-0002-4a5b-9c01-0e0f00000002',
    'Peserta Lomba Nasional Website UMKM · IT''s Day 2025',
    'Jakarta Global University',
    '5 Juli 2025',
    '',
    null,
    '/sertif/itsday-2025-lomba-website-umkm.jpg',
    '/sertif/itsday-2025-lomba-website-umkm.webp',
    'Kompetisi',
    'Sertifikat penghargaan atas partisipasi dalam Lomba Nasional Website UMKM pada acara IT''s Day 2025, Fakultas Teknik dan Ilmu Komputer, Jakarta Global University, Depok.',
    'Certificate of participation in the National UMKM Website Competition at IT''s Day 2025, Faculty of Engineering and Computer Science, Jakarta Global University, Depok.',
    2,
    true
  )
on conflict (id) do nothing;

commit;

