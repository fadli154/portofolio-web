# 🗺️ Skill Routing Matrix (Matriks Pemilihan Skill)

Gunakan panduan ini untuk menentukan skill wajib yang harus diaktifkan berdasarkan jenis tugas:

| Kategori Tugas / Permintaan | Skill Wajib (Primary) | Skill Pendukung (Secondary) | Standar & Luaran |
| :--- | :--- | :--- | :--- |
| **Ideasi, Fitur Baru, Improvement, Arsitektur** | `brainstorming` | `last30days`, `writing-plans` | PRD terverifikasi, bebas asumsi bias, rencana terstruktur. |
| **Riset Tren & Opini Pengguna Terkini** | `last30days` | `brainstorming` | Data tren riil 30 hari terakhir dari Reddit, X, HN, GitHub. |
| **Copywriting, Teks UX, PRD, Presentasi** | `humanizer` | `brainstorming` | Teks otentik natural, bebas pola klise AI (*not-X-but-Y, forced triads*). |
| **Desain Antarmuka, Layout, Motion, Tipografi** | `awwwards` | `ui-ux-pro-max` | Standar *Site of the Day*, tipografi tegas, ritme 4/8pt, bebas AI slop. |
| **Diagram Teknis & Arsitektur Sistem** | `anatomy` | `awwwards` | Diagram isometrik interaktif SVG/WebGL berbasis objek mekanik fisik nyata. |
| **Perbaikan Bug, Error Build, Glitch UI** | `systematic-debugging` | `ui-ux-pro-max` | Investigasi akar masalah 4-langkah, bukan tambal sulam coba-coba. |
| **Frontend Next.js & React Patterns** | `vercel-react-best-practices` | `awwwards`, `ui-ux-pro-max` | Server Components, streaming, optimasi ISR, Lighthouse $\ge 90$. |
| **Backend Supabase, PostgreSQL & RLS** | `supabase-postgres-best-practices` | `cloudflare-security-audit` | Skema PostgreSQL aman, RLS 100%, 0 kebocoran draft/kontak. |
| **Audit Keamanan, Cek Secret Leak, OWASP, RLS** | `cloudflare-security-audit` | `security-predeploy-gate` | 0 secret leak, mitigasi XSS/CSRF/SSRF, audit tabel RLS Supabase. |
| **Design QA, Penilaian Visual, Review Estetika** | `jury` | `awwwards` | *Blind screenshot audit* dengan rubrik juri Awwwards (Target skor $\ge 8.0/10$). |
| **Verifikasi Penyelesaian Tugas / Sebelum Merasa "Selesai"** | `verification-before-completion` | `ci-cd-release-ready` | Bukti eksekusi nyata (test/build passing) sebelum klaim selesai. |
| **CI/CD Pipeline, Core Web Vitals, Kesiapan Rilis** | `ci-cd-release-ready` | `security-predeploy-gate` | LCP $\le 2.5\text{s}$, INP $\le 200\text{ms}$, CLS $\le 0.1$, workflow Actions siap deploy. |

---

## Hirarki Prioritas Skill
1. **Process Skills**: `brainstorming`, `systematic-debugging`, `writing-plans`, `executing-plans`.
2. **Domain Implementation Skills**: `awwwards`, `ui-ux-pro-max`, `anatomy`, `humanizer`.
3. **Verification & Quality Skills**: `jury`, `cloudflare-security-audit`, `security-predeploy-gate`, `verification-before-completion`, `ci-cd-release-ready`.

