-- ============================================================================
-- Migration: 20261111000007_seed_tech_certificates_and_oase.sql
-- Purpose: Self-contained, defensive migration to:
--   1. Ensure `image_url` and `updated_at` columns exist on `public.certificates`
--   2. Configure safe defaults, constraints, and handle_updated_at trigger
--   3. Seed/Update OASE III PTKIN (Juara II Nasional · Crown Achievement)
--   4. Seed/Update IT's Day 2025 UMKM
--   5. Seed/Update 5 ID-Networkers credentials (Cyber Security, Cisco, MikroTik, Jaringan, Linux)
-- ============================================================================

begin;

-- 1. Defensive DDL: Ensure required columns exist
alter table public.certificates
  add column if not exists image_url text,
  add column if not exists updated_at timestamptz not null default timezone('utc'::text, now());

-- 2. Ensure sensible defaults
alter table public.certificates alter column credential_id set default '';
alter table public.certificates alter column summary_en set default '';
alter table public.certificates alter column summary_id set default '';
alter table public.certificates alter column category set default 'Kompetisi';

-- 3. URL & Title safety constraints (idempotent)
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

-- 4. Shared updated_at trigger function & trigger
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

drop trigger if exists set_certificates_updated_at on public.certificates;
create trigger set_certificates_updated_at
  before update on public.certificates
  for each row execute function public.handle_updated_at();

-- 5. Update Storage bucket mime types if bucket exists
do $$
begin
  if exists (select 1 from storage.buckets where id = 'certificates') then
    update storage.buckets
    set allowed_mime_types = array['image/webp', 'image/png', 'image/jpeg', 'application/pdf']
    where id = 'certificates';
  end if;
end $$;

-- 6. Seed / Upsert all 7 verified certificates idempotently
insert into public.certificates (
  id, title, issuer, issue_date, credential_id, verify_url, file_url, image_url,
  category, summary_id, summary_en, sort_order, is_visible
)
values
  -- [01] Crown Achievement: Juara II OASE III PTKIN 2026 (Kemenag RI)
  (
    '6f1d2c3a-0001-4a5b-9c01-0e0f00000001',
    'Juara II Literasi Inovasi Teknologi · OASE III PTKIN 2026',
    'Kementerian Agama Republik Indonesia',
    '7 November 2026',
    '712/Dt.I.III/PP.01/11/2026',
    null,
    '/sertif/oase-juara-2-lit.pdf',
    '/sertif/oase-juara-2-lit.webp',
    'Prestasi Nasional',
    'Juara II cabang Literasi Inovasi Teknologi pada Olimpiade Agama, Sains, dan Riset (OASE) III PTKIN se-Indonesia, UIN Sunan Kalijaga Yogyakarta, 3–7 November 2026. Mewakili UIN Sultan Maulana Hasanuddin Banten dengan karya inovasi HajiCare.',
    'Second place, Technology Innovation Literacy, at the 3rd Olympiad of Religion, Science and Research (OASE) for Indonesian Islamic universities, UIN Sunan Kalijaga Yogyakarta, 3–7 November 2026 with HajiCare innovation.',
    1,
    true
  ),

  -- [02] IT's Day 2025 UMKM (Jakarta Global University)
  (
    '6f1d2c3a-0002-4a5b-9c01-0e0f00000002',
    'Peserta Lomba Nasional Website UMKM · IT''s Day 2025',
    'Jakarta Global University',
    '5 Juli 2025',
    'ITSDAY-UMKM-2025',
    null,
    '/sertif/itsday-2025-lomba-website-umkm.jpg',
    '/sertif/itsday-2025-lomba-website-umkm.webp',
    'Kompetisi',
    'Sertifikat penghargaan atas partisipasi dalam Lomba Nasional Website UMKM pada acara IT''s Day 2025, Fakultas Teknik dan Ilmu Komputer, Jakarta Global University, Depok.',
    'Certificate of participation in the National UMKM Website Competition at IT''s Day 2025, Faculty of Engineering and Computer Science, Jakarta Global University, Depok.',
    2,
    true
  ),

  -- [03] Cyber Security Dasar (ID-Networkers)
  (
    '6f1d2c3a-0003-4a5b-9c01-0e0f00000003',
    'Cyber Security Dasar: Belajar Cyber Security dari Nol',
    'ID-Networkers (IDN.ID)',
    '26 November 2025',
    'IDN-1764150580-13888-68703',
    'https://lms.idn.id/cert-verification',
    '/sertif/Fadli-Hifziansyah-Belajar-Cyber-Security-dari-Nol-Sertifikat-Cyber-Security-Dasar-LMS-ID-Networkers.pdf',
    '/sertif/cyber-security-dasar.webp',
    'Cyber Security',
    'Sertifikasi kompetensi fundamental keamanan siber, mencakup konsep CIA triad, analisis ancaman siber, mitigasi kerentanan sistem, dan prinsip dasar pertahanan keamanan jaringan.',
    'Fundamental cybersecurity competency certification covering the CIA triad, cyber threat landscape, vulnerability mitigation, and basic defense principles for IT infrastructure.',
    3,
    true
  ),

  -- [04] Cisco Networking Dasar (ID-Networkers)
  (
    '6f1d2c3a-0004-4a5b-9c01-0e0f00000004',
    'Cisco Networking Dasar: Routing & Switching',
    'ID-Networkers (IDN.ID)',
    '26 November 2025',
    'IDN-1764151131-184-68703',
    'https://lms.idn.id/cert-verification',
    '/sertif/Fadli-Hifziansyah-Cisco-Dasar-Sertifikat-Cisco-Dasar-LMS-ID-Networkers.pdf',
    '/sertif/cisco-dasar.webp',
    'Jaringan Komputer',
    'Sertifikasi penguasaan perangkat jaringan Cisco IOS, konfigurasi routing statis & dinamis, VLAN, inter-VLAN routing, dan administrasi switch level pemula.',
    'Cisco IOS networking competency certification covering static and dynamic routing, VLAN segmentation, inter-VLAN routing, and enterprise switch configuration.',
    4,
    true
  ),

  -- [05] MikroTik RouterOS Dasar (ID-Networkers)
  (
    '6f1d2c3a-0005-4a5b-9c01-0e0f00000005',
    'MikroTik RouterOS Dasar: MTCNA Fundamentals',
    'ID-Networkers (IDN.ID)',
    '26 November 2025',
    'IDN-1764150580-13888-68703',
    'https://lms.idn.id/cert-verification',
    '/sertif/Fadli-Hifziansyah-Mikrotik-Dasar-Sertifikat-Mikrotik-Dasar-LMS-ID-Networkers.pdf',
    '/sertif/mikrotik-dasar.webp',
    'Jaringan Komputer',
    'Sertifikasi pengelolaan MikroTik RouterOS mencakup konfigurasi IP, DHCP Server/Client, firewall filtering, NAT masquerade, bandwidth management, dan routing dasar.',
    'MikroTik RouterOS administration certification covering IP assignment, DHCP Server/Client, firewall filtering, NAT masquerading, queue bandwidth limits, and basic routing.',
    5,
    true
  ),

  -- [06] Jaringan Komputer Dasar (ID-Networkers)
  (
    '6f1d2c3a-0006-4a5b-9c01-0e0f00000006',
    'Jaringan Komputer Dasar: Fundamental TCP/IP & Subnetting',
    'ID-Networkers (IDN.ID)',
    '26 November 2025',
    'IDN-1764150580-13888-68703',
    'https://lms.idn.id/cert-verification',
    '/sertif/Fadli-Hifziansyah-Jaringan-Dasar-Sertifikat-Jaringan-Komputer-Dasar-LMS-ID-Networkers.pdf',
    '/sertif/jaringan-komputer-dasar.webp',
    'Jaringan Komputer',
    'Sertifikasi pemahaman arsitektur jaringan komputer, model referensi OSI 7 layer, TCP/IP stack, kalkulasi subnetting VLSM/CIDR, serta pengkabelan dan topologi LAN.',
    'Foundational computer networking certification covering the OSI 7-layer model, TCP/IP protocol suite, VLSM/CIDR subnetting arithmetic, and LAN topologies.',
    6,
    true
  ),

  -- [07] Linux System Administration (ID-Networkers)
  (
    '6f1d2c3a-0007-4a5b-9c01-0e0f00000007',
    'Linux System Administration: Belajar Linux dari Nol',
    'ID-Networkers (IDN.ID)',
    '26 November 2025',
    'IDN-1764150580-13888-68703',
    'https://lms.idn.id/cert-verification',
    '/sertif/Fadli-Hifziansyah-Belajar-Linux-dari-Nol-Sertifikat-Belajar-Linux-dari-Nol-LMS-ID-Networkers.pdf',
    '/sertif/belajar-linux-dasar.webp',
    'Sistem Operasi & Cloud',
    'Sertifikasi administrasi sistem operasi Linux: navigasi CLI Bash, manajemen izin file (chmod/chown), manajemen paket (apt/yum), manajemen proses, dan konfigurasi server dasar.',
    'Linux system administration certification covering Bash CLI navigation, file permission governance (chmod/chown), package management, process scheduling, and server config.',
    7,
    true
  )
on conflict (id) do update set
  title = excluded.title,
  issuer = excluded.issuer,
  issue_date = excluded.issue_date,
  credential_id = excluded.credential_id,
  verify_url = excluded.verify_url,
  file_url = excluded.file_url,
  image_url = excluded.image_url,
  category = excluded.category,
  summary_id = excluded.summary_id,
  summary_en = excluded.summary_en,
  sort_order = excluded.sort_order,
  is_visible = excluded.is_visible,
  updated_at = timezone('utc'::text, now());

commit;
