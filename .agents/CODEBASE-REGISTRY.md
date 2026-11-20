# 🗂️ Katalog & Indeks Kode Terpusat (Codebase Registry: Next.js Portfolio)

> **PANDUAN HEMAT TOKEN UNTUK AI AGENT (MANDATORY WRITE-THROUGH INDEX):**
> 1. **BACA FILE INI DULU SEBELUM NGODING:** Sebelum membuat fungsi helper, formatter, komponen UI, atau service baru, **baca tabel di bawah ini**. Jika sudah ada, langsung `import` dan gunakan sesuai *Signature*-nya **tanpa perlu membuka/membaca isi file aslinya** (sangat menghemat kuota token).
> 2. **WAJIB UPDATE SAAT MENAMBAH / MENGUBAH / MENGHAPUS:** Setiap kali Anda menambahkan, mengubah parameter/return, atau menghapus fungsi/service/komponen di `src/lib`, `src/components`, atau `src/engine`, Anda **WAJIB memperbarui tabel di file ini pada giliran (turn) yang sama**.
> 3. **FORMAT HEMAT TOKEN (ULTRA-COMPACT):** Tulis **1 baris per item**. Dilarang menaruh blok kode panjang di file ini agar ukuran file tetap ringkas ($\le 800$ token) dan instan dibaca.

---

## 1. Kategori `/core` & Infrastruktur Dasar (`src/lib/supabase`, `src/engine`, `src/app`)

| Nama Modul / Config | Lokasi File (`Path`) | Signature Utama (`Method / Export -> Return`) | Kegunaan Singkat (1 Kalimat) |
| :--- | :--- | :--- | :--- |
| `Theme & CSS Variables` | `src/app/globals.css` | `--bg`, `--fg`, `--primary`, `--border`, `@theme inline` | Token tema warna monokrom-cyan dan styling utilitas Tailwind v4. |
| `AppFonts` | `src/app/fonts.ts` | `sansFont`, `monoFont`, `displayFont` -> `NextFont` | Konfigurasi font Geist Sans, Geist Mono, dan Inter Display. |
| `Supabase Browser Client` | `src/lib/supabase/client.ts` | `createClient() -> SupabaseClient \| null` | Instance Supabase browser-side client dengan proteksi fallback jika env belum diset. |
| `Supabase Server Client` | `src/lib/supabase/server.ts` | `createClient()`, `createPublicSupabaseClient()` | Instance Supabase server-side client (App Router cookies & public read). |
| `Supabase Middleware` | `src/lib/supabase/middleware.ts` | `updateSession(request: NextRequest) -> Promise<NextResponse>` | Refresh auth token pada Next.js Edge middleware. |
| `Site Profile & Fallbacks` | `src/data/site.ts` | `SITE_PROFILE`, `PROJECTS`, `EXPERIENCES`, `CERTIFICATES` | Master data statis lokal untuk profil, portofolio, dan sertifikat (seed data). |
| `Creative Engine` | `src/engine/index.ts` | `bootEngine(opts)`, `destroyEngine()`, `scrollTo(target)` | Inisialisasi Lenis scroll, WebGL, reveal animations, dan interaksi pointer. |

---

## 2. Kategori `/common/widgets` & Komponen UI (`src/components`)

| Nama Komponen | Lokasi File (`Path`) | Props Utama (`Props / Args`) | Kegunaan Singkat (1 Kalimat) |
| :--- | :--- | :--- | :--- |
| `Header` | `src/components/Header.tsx` | `({ currentPath?: string })` | Bilah navigasi fixed atas dengan status availability, switch bahasa, & CTA. |
| `Footer` | `src/components/Footer.tsx` | `()` | Footer minimalis dengan copyright, link sosial media, dan quick navigation. |
| `CommandPalette` | `src/components/CommandPalette.tsx` | `()` | Shortcut keyboard (`Cmd+K` / `Ctrl+K`) untuk navigasi cepat dan pencarian aksi. |
| `SmartInquiryModal` | `src/components/SmartInquiryModal.tsx` | `({ isOpen, onClose })` | Modal form kontak interaktif dengan validasi input dan integrasi API `/api/contact`. |
| `SpotlightCard` | `src/components/reactbits/SpotlightCard.tsx` | `({ children, spotlightColor, className })` | Kartu interaktif dengan efek sorot radial gradient mengikuti kursor kursor. |
| `TiltedCard` | `src/components/reactbits/TiltedCard.tsx` | `({ imageSrc, altText, captionText, scaleOnHover })` | Efek tilt 3D interaktif pada hover kartu preview proyek. |
| `Magnet` | `src/components/reactbits/Magnet.tsx` | `({ children, padding, disabled, magnetStrength })` | Pembungkus tombol/elemen dengan efek daya tarik magnetik ke kursor. |
| `BlurText` | `src/components/reactbits/BlurText.tsx` | `({ text, delay, animateBy, direction })` | Animasi teks muncul per huruf/kata dari efek blur halus. |
| `DecryptedText` | `src/components/reactbits/DecryptedText.tsx` | `({ text, speed, maxIterations, characters })` | Efek animasi decoding teks sci-fi saat hover/in-view. |
| `CountUp` | `src/components/reactbits/CountUp.tsx` | `({ to, from, duration, separator })` | Animasi angka metrik menghitung naik (untuk statistik tahun/proyek). |
| `DeskComputerFigure` | `src/components/figures/desk-computer/DeskComputerFigure.tsx` | `({ liveState, interactive })` | Visual isometrik SVG/WebGL meja kerja programmer interaktif (Anatomy style). |
| `ArchitectureRigFigure` | `src/components/figures/architecture-rig/figure.tsx` | `({ activeNode, onSelectNode })` | Diagram isometrik interaktif rig arsitektur sistem teknis. |
| `ScrollExpand` | `src/components/ScrollExpand.jsx` | `({ src, title, scrollHint, useWindowScroll, children })` | Komponen animasi frame yang meluas dinamis mengikuti scroll halaman (ReactBits). |
| `FadeContent` | `src/components/FadeContent.jsx` | `({ children, blur, duration, threshold, once })` | Komponen scroll-reveal resmi ReactBits via shadcn dengan transisi blur-to-clear. |
| `DitherVeil` | `src/components/DitherVeil.jsx` | `({ src, fit, pattern, pixelSize, levels, palette, inkColor, paperColor, clickBurst, wander })` | WebGL dither canvas shader interaktif resmi ReactBits via shadcn dengan efek shockwave. |
| `CardSwap` | `src/components/CardSwap.jsx` | `({ width, height, cardDistance, verticalDistance, depth, skewAmount, visibleCards, delay, draggable, children })` | Komponen 3D stack cards swap/flick resmi ReactBits via shadcn untuk rotasi kartu interaktif. |
| `EducationSection` | `src/components/EducationSection.tsx` | `({ educations?: EducationItem[] })` | Section linimasa pendidikan dengan ScrollExpand crop frame, DitherVeil WebGL shader, dan 4 CardSwap 3D stack. |
| `EducationDetailModal` | `src/components/education/EducationDetailModal.tsx` | `({ edu: EducationItem \| null, locale, onClose })` | Modal dialog interaktif Minimalist Editorial Dark untuk kurikulum dan proyek nyata studi. |

---

## 3. Kategori `/common/utils` — Helper, Audio, Formatter (`src/lib`)

| Nama Fungsi / Utility | Lokasi File (`Path`) | Signature (`Input Params -> Return Type`) | Kegunaan Singkat (1 Kalimat) |
| :--- | :--- | :--- | :--- |
| `cn` | `src/lib/utils.ts` | `cn(...inputs: ClassValue[]) -> string` | Utility penggabung class Tailwind CSS berbasis clsx & twMerge. |
| `isSupabaseConfigured` | `src/lib/supabase/client.ts` | `isSupabaseConfigured() -> boolean` | Cek validitas URL dan Anon Key Supabase sebelum inisialisasi client. |
| `SoundEffects` | `src/lib/audio/sound-effects.ts` | `playHover(), playClick(), playSuccess(), playError()` | Synthesizer efek suara UI berbasis Web Audio API tanpa aset file eksternal. |
| `splitElement` | `src/engine/reveal.ts` | `splitElement(el: HTMLElement) -> void` | Utility pembagi teks menjadi elemen span per baris/kata untuk animasi GSAP. |

---

## 4. Kategori `Services & Repositories` — Data Fetching & CMS (`src/lib/data`)

| Nama Service / Repo | Lokasi File (`Path`) | Method Utama (`Signature -> Return Type`) | Kegunaan Singkat (1 Kalimat) |
| :--- | :--- | :--- | :--- |
| `PortfolioRepository` | `src/lib/data/portfolio-repository.ts` | `getPortfolioSnapshot() -> Promise<PortfolioSnapshot>` | SSOT data portofolio (mengambil dari Supabase live dengan fallback ke data statis). |
| `CmsPersistence` | `src/lib/data/cms-persistence.ts` | `saveProject(project), deleteProject(id), reorderProjects(ids)` | Service mutasi data admin CMS dengan sinkronisasi ke tabel Supabase. |
| `CertificatesRepo` | `src/lib/data/certificates.ts` | `mapCertificateRow(row: CertificateRow) -> CertificateItem` | Pemetaan dan normalisasi data sertifikasi dari database relasional Supabase. |
