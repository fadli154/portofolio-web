---
name: ui-ux-pro-max
description: Anti-slop design intelligence and UX rules for mobile & web. Enforces cohesive color systems, WCAG contrast, 4/8pt spacing rhythm, touch ergonomics, micro-interactions, and prevents generic AI styling. Use when designing screens, creating UI components, refactoring styling, or reviewing visual polish.
---

# UI/UX Pro Max (Mobile & Flutter Anti-Slop Guide)

Gunakan skill ini setiap kali merancang antarmuka (UI), memilih warna, menyusun komponen, atau melakukan visual review pada aplikasi Flutter/mobile agar hasilnya profesional, berkarakter, dan bebas dari **"AI Slop"** (desain malas/generik bawaan AI).

---

## 1. Anti-Slop Manifesto (Aturan Wajib)

Hindari pola desain AI generik yang membuat aplikasi terlihat murahan:
1. **Dilarang Gradasi Neon Sembarangan:** Jangan menggunakan background gradasi ungu-cyan/pink-violet tanpa alasan brand yang jelas. Utamakan permukaan solid atau subtle tonal variation sesuai Material 3 elevation.
2. **Dilarang Hero Section Kosong:** Jangan membuat layar dengan satu ikon besar mengambang di tengah dan tombol raksasa tanpa informasi fungsional yang bernilai bagi pengguna.
3. **Dilarang Magic Numbers & Spasi Acak:** Jangan menulis padding seperti `EdgeInsets.all(13.5)` atau `SizedBox(height: 27)`. Seluruh spasi wajib mengikuti kelipatan 4pt/8pt.
4. **Semua Elemen Interaktif Wajib Memiliki State:**
   * Default
   * Pressed / Tapped (Ink splash atau opacity feedback)
   * Hover (untuk tablet/desktop/web)
   * Disabled (kontras redup, tap dinonaktifkan)
   * Loading state (gunakan skeleton placeholder, hindari spinner tanpa konteks)
5. **No Blind Placeholder Content:** Hindari teks "Lorem ipsum dolor sit amet". Gunakan data mock yang realistis dan kontekstual sesuai domain aplikasi.

---

## 2. Ergonomi & Standar Touch Target Mobile

* **Minimum Tap Target:** Minimal 48×48 logical pixels (`kMinInteractiveDimension`). Jika ikon berukuran 24×24dp, bungkus dalam `IconButton` atau `Padding` dengan hit-test area minimal 48dp.
* **Thumb Zone Optimization:**
  * Tombol aksi primer (CTA) ditempatkan di sepertiga bawah layar (mudah dijangkau jempol satu tangan).
  * Aksi destruktif (hapus akun, batalkan transaksi) dijauhkan dari jangkauan refleks jempol dan membutuhkan konfirmasi modal.
* **Separasi Antar Elemen:** Jarak antar elemen tappable minimal 8dp untuk mencegah salah klik (misclick).
* **Keyboard Awareness:** Semua formulir wajib dibungkus dengan scrollable widget dan padding otomatis saat keyboard virtual muncul (`viewInsets.bottom`).

---

## 3. Sistem Warna & Kontras (Aturan 60-30-10)

* **60% Dominan (Surface & Background):** Latar belakang bersih, netral, atau muted surface.
* **30% Struktural (Surface Container & Secondary):** Card, app bar, bottom navigation, container card.
* **10% Aksen (Primary Brand / CTA):** Tombol aksi utama, active badge, indikator progres.
* **Aksesibilitas Kontras (WCAG AA Compliance):**
  * Teks normal (<18pt): rasio kontras minimal **4.5:1** terhadap latar belakang.
  * Teks besar (>=18pt tebal atau >=24pt normal): rasio kontras minimal **3:1**.
* **Zero Hardcoded Colors:** Jangan gunakan `Colors.black`, `Colors.white`, atau hex acak di dalam widget tree. Selalu ambil dari `Theme.of(context).colorScheme`:
  * `colorScheme.surface`
  * `colorScheme.onSurface`
  * `colorScheme.primary`
  * `colorScheme.onPrimary`
  * `colorScheme.outlineVariant`

---

## 4. Skala Spasi & Tipografi 8-Point Grid

### Skala Spasi (dp)
* `xs`: 4dp (jarak ikon ke teks kecil)
* `sm`: 8dp (jarak antar elemen rapat / chip padding)
* `md`: 16dp (padding standar screen & margin card)
* `lg`: 24dp (jarak antar grup section)
* `xl`: 32dp (header hero margin)
* `xxl`: 48dp (jarak batas section besar)

### Skala Tipografi Flutter
Gunakan `Theme.of(context).textTheme`:
* `displayLarge` / `displayMedium`: Angka dashboard, stat hero (ringkas, tegas).
* `headlineMedium` / `headlineSmall`: Judul utama layar.
* `titleMedium` / `titleSmall`: Judul card atau section item.
* `bodyLarge` / `bodyMedium`: Konten baca utama (line-height ~1.4–1.5 untuk kenyamanan mata).
* `labelLarge` / `labelMedium`: Teks tombol, chip, dan caption status.

---

## 5. Mikrointeraksi & Feedback

* **Tap Feedback:** Bungkus komponen custom dengan `InkWell` atau `GestureDetector` dengan animasi visual yang jelas.
* **Haptic Feedback:** Gunakan `HapticFeedback.lightImpact()` atau `HapticFeedback.selectionClick()` saat pengguna mengaktifkan toggle switch, memilih opsi di picker, atau menyelesaikan aksi penting.
* **Feedback Error:** Tampilkan pesan error inline di dekat input form terkait dengan warna `colorScheme.error`, bukan hanya pop-up dialog yang mengganggu alur pengguna.

---

## 6. Checklist Verifikasi Desain Sebelum Selesai
- [ ] Apakah semua warna diambil dari `Theme.of(context).colorScheme`?
- [ ] Apakah kontras teks dan latar belakang memenuhi syarat WCAG AA?
- [ ] Apakah semua tap target berukuran minimal 48×48dp?
- [ ] Apakah ada state loading, kosong (empty state), dan error state?
- [ ] Apakah tampilan mendukung Light Mode dan Dark Mode secara mulus?
- [ ] Apakah layout tidak mengalami pixel overflow saat layar diperkecil atau font diperbesar?
