# Website modern / portofolio / SaaS

Resep alur kerja terstruktur untuk aplikasi Web modern (React / Next.js / Vite SPA), mulai dari desain visual tingkat tinggi, pengujian browser otomatis, audit keamanan OWASP/RLS, audit kualitas Core Web Vitals, hingga deployment CI/CD otomatis.

## Kandidat katalog
- [[03-Skills/superpowers]]
- [[03-Skills/last30days]]
- [[03-Skills/humanizer]]
- [[03-Skills/ui-ux-pro-max]]
- [[03-Skills/awwwards]]
- [[03-Skills/anatomy]]
- [[03-Skills/hallmark]]
- [[03-Skills/impeccable]]
- [[03-Skills/vercel-skills]]
- [[03-Skills/supabase-skills]]
- [[03-Skills/playwright]]
- [[03-Skills/trailofbits-skills]]
- [[03-Skills/cloudflare-security-audit]]
- [[03-Skills/jury]]
- [[03-Skills/web-quality-skills]]
- [[03-Skills/github-devops-actions]]
- [[03-Skills/context7]]

## Urutan keputusan & tahapan SDLC

1. **Inisiasi, Riset Pasar & Copywriting:**
   - Gunakan `last30days` untuk meneliti sentimen riil, tren, dan masalah nyata pengguna di Reddit/X/HN/YouTube (mencegah asumsi produk usang).
   - Gunakan `superpowers` untuk brainstorming, perancangan PRD, dan pemecahan tugas terisolasi.
   - Terapkan `humanizer` untuk membersihkan copywriting awal, PRD, dan teks UX dari klise AI (*AI tells*).
2. **Desain Antarmuka & Identitas Visual (Anti-Slop UI):**
   - Terapkan `ui-ux-pro-max` (rekomendasi sistem) untuk token desain terstruktur (warna HSL, dark mode, ritme 4/8pt) atau `awwwards` untuk *art direction* kreatif kelas dunia berstandar *Site of the Day*.
   - Gunakan `anatomy` jika membutuhkan diagram teknis isometrik interaktif berbasis objek fisik nyata (menggantikan diagram kotak panah generik).
   - Opsional: `impeccable` atau `hallmark` sebagai pendukung audit visual dan aksesibilitas.
3. **Build Frontend & Backend:**
   - Gunakan `vercel-skills` untuk best practices Next.js App Router (Server Components, streaming, optimasi gambar).
   - Gunakan `supabase-skills` untuk perancangan skema database PostgreSQL, manajemen migrasi, dan autentikasi.
   - Gunakan `context7` untuk dokumentasi library versi mutakhir.
4. **Automated Testing:**
   - Terapkan `playwright` untuk pengujian end-to-end (E2E) alur bisnis penting (login, form submission, responsive viewport).
5. **Security Audit Gate (Wajib sebelum rilis):**
   - Gunakan `trailofbits-skills` dan `cloudflare-security-audit` untuk multi-phase source-first security audit: pemindaian rahasia (`.env`/API keys), validasi batas kepercayaan (*trust boundary*), sanitasi input XSS/CSRF/SSRF, dan kerentanan dependensi (`npm audit`).
   - Gunakan `supabase-skills` untuk memverifikasi seluruh tabel PostgreSQL dilindungi Row Level Security (RLS) dan `service_role_key` tidak bocor ke bundle client.
6. **Quality, Blind Design QA & Deploy Gate:**
   - Gunakan `jury` untuk menjalankan *blind audit* desain dan scoring (Design, Usability, Creativity, Content) berbasis bukti tangkapan layar browser tanpa bias kode perancang.
   - Gunakan `web-quality-skills` untuk audit Lighthouse: pastikan Core Web Vitals memenuhi target (LCP $\le 2.5\text{s}$, INP $\le 200\text{ms}$, CLS $\le 0.1$), WCAG 2.1 AA, dan security headers (CSP, HSTS).
   - Bangun pipeline `github-devops-actions` yang aman (pinned actions, least-privilege token) untuk menjalankan build, test gate, dan trigger deployment otomatis ke hosting produksi (Vercel / Cloudflare).

## Exit criteria
- [ ] PRD disetujui di `docs/prd.md` dengan copy yang bersih dari pola klise AI via `humanizer`.
- [ ] Design system konsisten, ramah aksesibilitas, responsive, dan bebas dari AI slop via `ui-ux-pro-max` / `awwwards`.
- [ ] Diagram arsitektur presisi terpasang via `anatomy` (jika ada komponen sistem teknis).
- [ ] Database PostgreSQL terlindungi RLS aktif pada 100% tabel via `supabase-skills`.
- [ ] Security audit `trailofbits-skills` & `cloudflare-security-audit` lulus: 0 confirmed vulnerabilities, 0 secret leaks, dan 0 high/critical CVE.
- [ ] E2E browser tests lulus di pipeline CI/CD via `playwright`.
- [ ] Skor evaluasi `jury` memenuhi standar ($\ge 8.0/10$) pada kategori Design & Usability.
- [ ] Core Web Vitals memenuhi ambang batas Google (LCP $\le 2.5\text{s}$, INP $\le 200\text{ms}$, CLS $\le 0.1$) via `web-quality-skills`.
- [ ] HTTP Security headers terpasang (CSP, HSTS, X-Frame-Options: DENY).
- [ ] Pipeline `github-devops-actions` berhasil deploy ke produksi dengan monitoring Sentry aktif.
