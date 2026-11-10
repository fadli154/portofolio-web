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

