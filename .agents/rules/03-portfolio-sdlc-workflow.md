# 📋 Portfolio SDLC Workflow (Resep Website-Modern.md)

Alur kerja pengembangan website portofolio Fadli Hifziansyah mengikuti 5 fase SDLC:

```
Phase 1: Inisiasi & Copywriting   ──►  Phase 2: Visual & Anti-Slop UI  ──►  Phase 3: Implementation
(last30days + humanizer)              (awwwards + ui-ux-pro-max)             (Next.js App Router + Supabase)
                                                                                       │
Phase 5: Blind QA & Deploy        ◄──  Phase 4: Security Gate          ◄───────────────┘
(jury + ci-cd-release-ready)          (cloudflare-sec-audit + sec-gate)
```

---

## Rincian Tahapan:

### Phase 1 — Inisiasi & Copywriting Otentik
- Jalankan `last30days` untuk memvalidasi tren portofolio software engineer modern dan sentimen recruiter.
- Gunakan `brainstorming` untuk mengeksplorasi struktur konten dan kebutuhan fungsional (berkaca pada `PRD_Personal_Developer_Portfolio_Fadli_Hifziansyah.md`).
- Saring seluruh teks UX, judul, dan deskripsi proyek dengan `humanizer` untuk mengeliminasi bahasa robotik.

### Phase 2 — Desain Visual & Anti-Slop UI
- Terapkan `ui-ux-pro-max` untuk fondasi sistem warna HSL (dark mode onyx), tipografi, dan ritme ruang 4/8pt.
- Gunakan `awwwards` untuk *art direction* kreatif kelas dunia berstandar *Site of the Day* (motion terukur, interaktivitas taktil, tanpa gradien generik).
- Pasang diagram teknis arsitektur isometrik via `anatomy` untuk memvisualisasikan alur sistem full-stack secara elegan.

### Phase 3 — Implementasi Frontend & Backend
- Stack: **Next.js 15 App Router**, **TypeScript**, **Tailwind CSS**, **Supabase** (Auth, Database, Storage), dan **Vercel**.
- Halaman publik (*public portfolio*) berfokus pada kecepatan muat dan SEO.
- Halaman privat (*private admin CMS*) untuk pengelolaan konten mandiri tanpa menyentuh source code.

### Phase 4 — Security Gate (Wajib Sebelum Rilis)
- Audit keamanan sumber via `cloudflare-security-audit` dan `security-predeploy-gate`.
- Verifikasi 100% tabel Supabase dilindungi Row Level Security (RLS).
- Pastikan tidak ada `service_role_key` atau secret environment variables yang bocor ke client bundle.

### Phase 5 — Blind Design QA & Deployment Gate
- Lakukan evaluasi visual independen via `jury` (*target skor $\ge 8.0/10$* pada Design & Usability).
- Pastikan Core Web Vitals memenuhi target Google (LCP $\le 2.5\text{s}$, INP $\le 200\text{ms}$, CLS $\le 0.1$).
- Siapkan pipeline GitHub Actions via `ci-cd-release-ready` untuk deployment otomatis ke Vercel dengan proteksi zero-downtime.

