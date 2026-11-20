---
name: design-md
description: Google Labs DESIGN.md specification guide and token management. Defines a structured design system contract with YAML frontmatter tokens (colors, typography, spacing, shapes, shadows) and natural language rationale. Use when establishing a design system, maintaining visual consistency across screens, auditing design drift, or implementing design tokens in Flutter/mobile apps.
---

# Google Labs DESIGN.md Guide (Mobile & Flutter Edition)

Standar spesifikasi desain dari Google Labs untuk menjaga identitas visual, mencegah **visual drift** (inkonsistensi warna/spasi antar layar), dan menjadi kontrak resmi (*Single Source of Truth*) antara AI agent dan pengembang.

---

## 1. Konsep & Struktur DESIGN.md

File `DESIGN.md` disimpan di root project atau di dalam folder `docs/DESIGN.md`. File ini memiliki dua lapisan:

1. **YAML Frontmatter (Machine-Readable Tokens):** Variabel token terstruktur yang dapat diparse secara otomatis oleh agent dan script CI/CD.
2. **Markdown Prose (Human Rationale & Guidelines):** Penjelasan prinsip estetika, aturan Do's & Don'ts, serta alasan filosofis di balik pemilihan gaya.

---

## 2. Template Spesifikasi Token untuk Flutter (`docs/DESIGN.md`)

Gunakan template di bawah ini saat menginisialisasi project Flutter:

```markdown
---
name: "App Brand Design System"
version: "1.0.0"
platform: "flutter-mobile"

colors:
  primary: "#1A56DB"
  on_primary: "#FFFFFF"
  primary_container: "#E1EFFE"
  on_primary_container: "#1E429F"
  
  secondary: "#4B5563"
  on_secondary: "#FFFFFF"
  
  surface: "#F9FAFB"
  on_surface: "#111827"
  surface_container: "#FFFFFF"
  
  error: "#E02424"
  on_error: "#FFFFFF"
  
  outline: "#D1D5DB"
  outline_variant: "#E5E7EB"

typography:
  font_family: "Inter"
  display:
    size: 32
    weight: "Bold"
    line_height: 1.2
  headline:
    size: 24
    weight: "SemiBold"
    line_height: 1.3
  title:
    size: 18
    weight: "SemiBold"
    line_height: 1.4
  body:
    size: 14
    weight: "Regular"
    line_height: 1.5
  label:
    size: 12
    weight: "Medium"
    line_height: 1.4

spacing:
  xs: 4
  sm: 8
  md: 16
  lg: 24
  xl: 32
  xxl: 48

radii:
  sm: 6
  md: 12
  lg: 20
  pill: 9999

elevation:
  card: 1.0
  dialog: 6.0
  fab: 4.0
---

# Design Identity & Brand Principles

## 1. Visual Personality
Aplikasi ini mengedepankan kesan bersih, fungsional, dan modern dengan fokus pada keterbacaan data. Menghindari ornamen visual yang tidak fungsional.

## 2. Aturan Penting (Do's and Don'ts)
* **DO:** Gunakan `surface_container` untuk card latar belakang di atas layar abu-abu terang `surface`.
* **DO:** Pastikan tombol aksi utama menggunakan warna `primary` dengan teks kontras `on_primary`.
* **DON'T:** Jangan menambahkan bayangan (box shadow) gelap pekat. Gunakan elevasi lembut atau border tipis `outline_variant`.
* **DON'T:** Dilarang menggunakan font kustom selain Inter tanpa persetujuan tim desain.
```

---

## 3. Cara Memetakan `DESIGN.md` ke Flutter Code

Ketika membuat tema di Flutter, agent wajib mengonversi token dari `DESIGN.md` ke dalam `ThemeData`:

```dart
// lib/core/theme/app_theme.dart
import 'package:flutter/material.dart';

class AppTheme {
  static ThemeData get lightTheme {
    const colorScheme = ColorScheme(
      brightness: Brightness.light,
      primary: Color(0xFF1A56DB),
      onPrimary: Color(0xFFFFFFFF),
      primaryContainer: Color(0xFFE1EFFE),
      onPrimaryContainer: Color(0xFF1E429F),
      secondary: Color(0xFF4B5563),
      onSecondary: Color(0xFFFFFFFF),
      error: Color(0xFFE02424),
      onError: Color(0xFFFFFFFF),
      surface: Color(0xFFF9FAFB),
      onSurface: Color(0xFF111827),
    );

    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: colorScheme.surface,
      cardTheme: CardTheme(
        color: const Color(0xFFFFFFFF),
        elevation: 1,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          minimumSize: const Size(double.infinity, 48),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
    );
  }
}
```

---

## 4. Alur Kerja Audit Desain (Design Drift Check)

Setiap kali agent menulis atau memodifikasi widget:
1. **Cek Token:** Apakah ada warna hex hardcoded di file widget? Jika ada, ganti dengan token tema.
2. **Cek Spasi:** Apakah nilai padding/margin cocok dengan skala spacing (`xs`, `sm`, `md`, `lg`, `xl`)?
3. **Cek Radius:** Apakah sudut tombol dan card mematuhi skala `radii` di `DESIGN.md`?
4. **Cek Tipografi:** Apakah gaya teks menggunakan `TextTheme` resmi?
