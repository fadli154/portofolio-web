---
title: "Design System Contract — Fadli Hifziansyah Portfolio"
version: "2.1.0"
archetype: "Swiss Minimalist Editorial Portfolio (Light-First)"
tokens:
  colors:
    ground: "#FAFAFA"
    ground_secondary: "#F3F4F6"
    card: "#FFFFFF"
    ink: "#0F172A"
    muted: "#475569"
    line: "rgba(15, 23, 42, 0.09)"
    accent: "#2563EB"
    accent_ink: "#FFFFFF"
    status_emerald: "#16A34A"
    curtain: "#0F172A"
  typography:
    display: "Plus Jakarta Sans"
    sans: "Plus Jakarta Sans"
    mono: "JetBrains Mono"
  spacing:
    base_unit: "8px"
    container_max: "1280px"
    gutter: "clamp(1.25rem, 3vw, 2.5rem)"
  shape:
    radius_sm: "8px"
    radius_md: "12px"
    radius_lg: "16px"
---

# Design System & Art Direction (`DESIGN.md`)

## 1. Concept Card (`/awwwards` Phase 1)

```text
Idea:        Portofolio developer minimalis, dominan putih, dan elegan yang menyajikan bukti karya nyata secara jernih.
Metaphor:    Meja kerja arsitek perangkat lunak yang terang, bersih, dan terorganisasi rapi.
Signature:   Workstation komputer isometrik interaktif (/anatomy) di bagian Tentang Saya yang merespons ketikan keyboard pengunjung secara langsung.
Emotion:     Jernih, tepercaya, rapi, dan ramah dijelajahi dalam 3 detik pertama.
Motion verb: Settle like paper (transisi halus, singkat, dan presisi tanpa menghambat pembacaan).
Screenshot:  Komposisi hero minimalis di atas kertas putih dengan kartu profil terstruktur dan workstation isometrik di bagian profil.
```

## 2. Prinsip Desain Utama (Sesuai PRD Bagian 9)

1. **Minimalis & Dominan Putih**: Latar utama menggunakan `#FAFAFA` (Warm Paper White) dan `#FFFFFF` (Pure Card Surface) dengan selingan `#F3F4F6` (Soft Neutral) untuk membedakan karakter antar bagian tanpa mengubah sistem desain secara acak.
2. **Tipografi Jelas & Konsisten**: Menggunakan **Plus Jakarta Sans** untuk judul dan teks baca utama agar bersih dan mudah dipindai, dipadukan dengan **JetBrains Mono** untuk tag teknologi, tanggal, dan metadata kode.
3. **Karakter Visual Berbeda Per Bagian**:
   - **Hero (`#hero`)**: Split layout 7:5 dengan headline tegas, CTA langsung, dan kartu ringkasan profil profesional.
   - **About (`#about`)**: Narasi profil dipadukan dengan figur interaktif `/anatomy` **Developer Workstation (`DeskComputerFigure`)** bertema terang (`data-theme="light"`).
   - **Skills (`#skills`)**: Bento matriks 4 kategori teknologi tanpa bar persentase subjektif.
   - **Projects (`#projects`)**: Kartu studi kasus dengan ilustrasi antarmuka aplikasi, ringkasan masalah-solusi, tag teknologi, serta tautan Demo & GitHub.
   - **Experience & Education (`#experience`)**: Linimasa kronologis dua kolom untuk riwayat pengalaman dan pendidikan akademik.
   - **Certificates (`#certificates`)**: Grid kredensial terverifikasi dengan modal pratinjau sertifikat.
   - **Contact (`#contact`)**: Formulir kontak langsung di halaman utama berdampingan dengan kanal komunikasi langsung.
4. **Motion Singkat & Menghormati Aksesibilitas**: Seluruh animasi berjalan di atas satu `gsap.ticker` dan otomatis nonaktif ketika pengguna mengaktifkan `prefers-reduced-motion: reduce`.
