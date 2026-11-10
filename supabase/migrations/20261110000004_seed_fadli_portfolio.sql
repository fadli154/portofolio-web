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

