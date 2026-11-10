# Project Guidelines & Rules: Portfolio Web (Modern Website SDLC)

Proyek ini menggunakan blueprint alur kerja **Website-Modern.md** yang dikonfigurasi melalui `skill-advisor`.

---

## 🚨 MANDATORY SKILL-FIRST POLICY (HUKUM WAJIB AKTIVASI SKILL)

Setiap kali model AI menerima prompt baru, atau hendak melakukan **perubahan, perbaikan (improvement), refactoring, maupun penambahan fitur baru**, model **WAJIB** mencari dan menggunakan skill yang relevan **SEBELUM** menulis kode, mengubah berkas, membuat rencana (plan), atau mengajukan pertanyaan klarifikasi.

### Aturan Pokok:
1. **No Bare Actions**: Jangan pernah langsung mengedit atau membuat kode tanpa mengaktifkan skill pendukung yang sesuai.
2. **Process Skill First**: Jika tugas bersifat kreatif, konseptual, atau penambahan fitur, gunakan skill proses (`brainstorming`) terlebih dahulu sebelum merancang solusi atau melangkah ke skill implementasi.
3. **Pengumuman Eksplisit**: Model harus selalu secara eksplisit menyebutkan skill yang diaktifkan di awal respons atau proses pemikiran:
   > *"Mengaktifkan skill `[nama-skill]` untuk `[tujuan spesifik]`..."*
4. **Baca & Patuhi Instruksi**: Baca `SKILL.md` dari skill yang bersangkutan dan ikuti checklist/panduannya secara ketat tanpa improvisasi acak.

---

## 🗺️ SKILL ROUTING MATRIX (PANDUAN PEMILIHAN SKILL)

Gunakan matriks ini untuk menentukan skill yang **wajib** dipanggil berdasarkan jenis permintaan:

| Kategori Permintaan / Tugas | Skill Wajib (Primary) | Skill Pendukung (Secondary) | Output / Standar |
| :--- | :--- | :--- | :--- |
| **Ideasi, Fitur Baru, Improvement, Refactor Arsitektur** | `brainstorming` | `last30days`, `writing-plans` | PRD terverifikasi, validasi kebutuhan pengguna riil, rencana kerja terstruktur. |
| **Riset Pasar, Tren, Diskusi Pengguna Terkini** | `last30days` | `brainstorming` | Data tren riil 30 hari terakhir dari Reddit, X, HN, GitHub. |
| **Copywriting, Teks UX, Konten PRD, Presentasi** | `humanizer` | `brainstorming` | Teks otentik natural, bebas pola klise AI (*not-X-but-Y, forced triads*). |
| **Desain UI, Layout, Art Direction, Motion, Typography** | `awwwards` | `ui-ux-pro-max` | Standar *Site of the Day*, tipografi tegas, ritme 4/8pt, bebas AI slop. |
| **Diagram Teknis, Arsitektur Sistem, Komponen Visual** | `anatomy` | `awwwards` | Diagram isometrik interaktif SVG/WebGL berbasis objek mekanik fisik nyata. |
| **Perbaikan Bug, Error, Kegagalan Build, UI Glitch** | `systematic-debugging` | `ui-ux-pro-max` | Investigasi akar masalah 4-langkah, bukan tebak-tebak tambal sulam. |
| **Frontend Next.js & React Patterns** | `vercel-react-best-practices` | `awwwards`, `ui-ux-pro-max` | Server Components, streaming, optimasi ISR, Lighthouse $\ge 90$. |
| **Backend Supabase, PostgreSQL & RLS** | `supabase-postgres-best-practices` | `cloudflare-security-audit` | Skema PostgreSQL aman, RLS 100%, 0 kebocoran draft/kontak. |
| **Audit Keamanan, Cek Secret Leak, OWASP, RLS** | `cloudflare-security-audit` | `security-predeploy-gate` | 0 secret leak, mitigasi XSS/CSRF/SSRF, laporan keamanan terverifikasi. |
| **Design QA, Penilaian Visual, Review Estetika** | `jury` | `awwwards` | *Blind screenshot audit* dengan rubrik juri Awwwards (Target skor $\ge 8.0/10$). |
| **Verifikasi Penyelesaian Tugas / Sebelum Merasa "Selesai"** | `verification-before-completion` | `ci-cd-release-ready` | Bukti eksekusi nyata (test/build passing) sebelum klaim selesai. |
| **CI/CD Pipeline, Kesiapan Rilis, Core Web Vitals** | `ci-cd-release-ready` | `security-predeploy-gate` | LCP $\le 2.5\text{s}$, INP $\le 200\text{ms}$, CLS $\le 0.1$, workflow Actions siap deploy. |

---

## 🛑 TABEL ANTI-RASIONALISASI (RED FLAGS)

Jika muncul pemikiran berikut dalam proses penalaran (*reasoning*), **BERHENTI SEKETIKA** — ini adalah tanda rasionalisasi yang melanggar aturan:

| Pemikiran Keliru (Red Flag) | Fakta & Tindakan Wajib |
| :--- | :--- |
| *"Ini hanya perubahan 1 baris kode, tidak perlu skill"* | Perubahan kecil sering memicu regresi. Cek dan aktifkan skill yang relevan. |
| *"Saya buat kodenya dulu, nanti skill-nya menyusul"* | **DILARANG**. Skill menentukan *cara* implementasi, bukan sekadar pelengkap akhir. |
| *"Saya sudah ingat instruksi skill ini di kepala"* | Skill terus berkembang. Selalu rujuk berkas `SKILL.md` aktif. |
| *"Saya perlu eksplorasi kode dulu sebelum panggil skill"* | Skill mengatur *bagaimana* cara menjelajahi dan menganalisis kode secara disiplin. |
| *"Desain ini sudah bagus menurut saya"* | Wajib diverifikasi melalui rubrik `ui-ux-pro-max` atau audit `jury`, bukan asumsi pribadi. |

---

## 🛠️ DAFTAR SKILL LOKAL PROYEK (`.agents/skills/`)

Skill berikut terpasang langsung di dalam proyek dan siap digunakan secara instan:
1. `last30days`
2. `humanizer`
3. `awwwards`
4. `anatomy`
5. `ui-ux-pro-max`
6. `jury`
7. `cloudflare-security-audit`
8. `security-predeploy-gate`
9. `ci-cd-release-ready`

*(Skill proses seperti `brainstorming`, `systematic-debugging`, `writing-plans`, dan `verification-before-completion` aktif secara global di lingkungan Antigravity).*

---

## 📋 TAHAPAN EKSEKUSI SDLC RESEP `Website-Modern.md`

```
Phase 1: Inisiasi & Copywriting   ──►  Phase 2: Visual & Anti-Slop UI  ──►  Phase 3: Implementation
(last30days + humanizer)              (awwwards + ui-ux-pro-max)             (React/Next.js/Astro)
                                                                                       │
Phase 5: Blind QA & Deploy        ◄──  Phase 4: Security Gate          ◄───────────────┘
(jury + ci-cd-release-ready)          (cloudflare-sec-audit + sec-gate)
```

1. **Inisiasi & Copywriting:**
   - Gunakan `last30days` untuk riset opini dan kebutuhan audiens riil.
   - Gunakan `brainstorming` untuk mengeksplorasi kebutuhan dan merancang PRD.
   - Bersihkan seluruh teks dan konten menggunakan `humanizer`.

2. **Desain Visual & Anti-Slop:**
   - Terapkan `ui-ux-pro-max` untuk fondasi token desain (warna HSL, tipografi, grid).
   - Gunakan `awwwards` untuk *art direction* kreatif kelas dunia.
   - Gunakan `anatomy` jika membutuhkan diagram teknis isometrik.

3. **Implementasi Frontend:**
   - Bangun komponen UI dengan motion halus, responsive design, dan struktur kode bersih.

4. **Security Gate:**
   - Jalankan pemindaian keamanan menggunakan `cloudflare-security-audit` dan `security-predeploy-gate` (0 critical CVE, 0 secret leak).

5. **Blind Design QA & Deployment:**
   - Lakukan evaluasi visual independen via `jury` (target skor $\ge 8.0/10$).
   - Pastikan Core Web Vitals terpenuhi ($\text{LCP} \le 2.5\text{s}$, $\text{INP} \le 200\text{ms}$, $\text{CLS} \le 0.1$).
   - Siapkan pipeline deployment via `ci-cd-release-ready`.

---

## 🎯 EXIT CRITERIA CHECKLIST

- [ ] PRD & teks landing page bebas dari klise AI via `humanizer`.
- [ ] Design tokens dan layout terstruktur rapi via `ui-ux-pro-max` & `awwwards`.
- [ ] Diagram sistem isometrik terpasang via `anatomy` (jika ada komponen teknis).
- [ ] Security audit lulus: 0 confirmed vulnerabilities & 0 secret leaks via `cloudflare-security-audit`.
- [ ] Skor evaluasi `jury` memenuhi standar ($\ge 8.0/10$) pada Design & Usability.
- [ ] Core Web Vitals memenuhi batas Google (LCP $\le 2.5\text{s}$, INP $\le 200\text{ms}$, CLS $\le 0.1$).
- [ ] Pipeline CI/CD terkonfigurasi dan siap deploy via `ci-cd-release-ready`.
