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

