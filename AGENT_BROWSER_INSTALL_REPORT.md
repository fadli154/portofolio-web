# Laporan Instalasi & Konfigurasi Vercel Agent Browser + Dogfood Skill di Google Antigravity

**Tanggal:** 21 November 2026  
**Target Host:** Microsoft Windows 11 (64-bit)  
**Agent Harness:** Google Antigravity (AGY)  
**Status Keseluruhan:** ✅ **SELESAI & TERVERIFIKASI PENUH (READY FOR PRODUCTION QA)**

---

## 1. Status Node.js & npm
- **Sistem Operasi:** Windows NT 10.0.26300.0 (64-bit)
- **Node.js:** `v22.19.0` (Terpasang & Aktif)
- **npm:** `10.9.3` (Terpasang & Aktif)
- **Path Bin:** `C:\Program Files\nodejs\node.exe`

---

## 2. Status Instalasi Vercel Agent Browser CLI
- **Status:** ✅ Terpasang secara global (`npm install -g agent-browser`)
- **Versi:** `0.43.0`
- **Exec Binary:** `agent-browser` (terdaftar di PATH global sistem Windows)
- **Lokasi Package:** `C:\Users\Fadli\AppData\Roaming\npm\node_modules\agent-browser`
- **Fitur Utama:** Fast Rust/Node automation client, built-in CDP bridge, daemon persistence, accessibility snapshot, video recorder, network HAR/routing.

---

## 3. Status Instalasi Chrome for Testing
- **Status:** ✅ Terpasang & Siap Digunakan
- **Versi Browser:** Chrome for Testing `158.0.8127.36 (win64)`
- **Lokasi Executable:** `C:\Users\Fadli\.agent-browser\browsers\chrome-158.0.8127.36\chrome-win64\chrome.exe`
- **System Chrome Cadangan:** `C:\Program Files\Google\Chrome\Application\chrome.exe`

---

## 4. Status Instalasi Skill Antigravity
- **Status:** ✅ Terpasang Global via `npx skills add vercel-labs/agent-browser --agent antigravity --global --yes`
- **Skill Terdaftar:** `agent-browser`
- **Struktur Berkas:**
  - `SKILL.md` (metadata frontmatter, prompt routing trigger, allowed tools)

---

## 5. Lokasi Skill Global
Skill discovery telah dipetakan dan disinkronisasi ke direktori global resmi Google Antigravity:
1. **Google Antigravity Global Skill Root:**
   `C:\Users\Fadli\.gemini\config\skills\agent-browser\SKILL.md`
2. **Global Agent Skills Fallback Root:**
   `C:\Users\Fadli\.agents\skills\agent-browser\SKILL.md`

Tidak ada file konfigurasi atau skill lain yang terhapus atau tertimpa selama proses instalasi.

---

## 6. Status Dogfood & Core Skills
`agent-browser` menyertakan skill resmi version-matched langsung di dalam CLI package:
- **`core`:** ✅ Tersedia (`agent-browser skills get core`)
  - Menyediakan panduan perintah dasar, ref handling (`@e1`), chaining, cookies, state storage, network interception.
- **`dogfood`:** ✅ Tersedia (`agent-browser skills get dogfood --full`)
  - Menyediakan taksonomi bug (*Visual/UI, Functional, UX, Content, Performance, Console/Errors, Accessibility*), alur *Repro-First*, screenshot beranotasi, perekaman video bug, dan template laporan QA terstruktur.
- **Skill Pendukung Lainnya:**
  - `agentcore`, `derive-client`, `electron`, `modern-web-guidance`, `protected-vercel-deployments`, `slack`, `vercel-sandbox`, `webmcp-gen`.

---

## 7. Hasil Smoke Test (Pengujian Nyata di Browser)
Pengujian dasar dilakukan terhadap `https://example.com` menggunakan sesi terisolasi (`--session smoke-test`):

1. **Navigasi & Peluncuran Browser:**
   ```powershell
   agent-browser --session smoke-test open https://example.com
   ```
   *Hasil:* Browser Chromium berhasil diluncurkan di background; halaman dimuat dengan status sukses.

2. **Pengambilan Accessibility Tree Snapshot:**
   ```powershell
   agent-browser --session smoke-test snapshot -i
   ```
   *Hasil:* Mengembalikan elemen interaktif terindeks:
   `- link "Learn more" [ref=e1]`

3. **Interaksi & Pembacaan Teks Berdasarkan Ref:**
   ```powershell
   agent-browser --session smoke-test get text '@e1'
   ```
   *Hasil:* Mengembalikan teks: `"Learn more"`.

4. **Tangkapan Layar (Screenshot Proof):**
   ```powershell
   agent-browser --session smoke-test screenshot 'nav_audit/133_agent_browser_smoke_test.png'
   ```
   *Hasil:* Berhasil disimpan (bukti file valid di folder audit).

5. **Penutupan Sesi:**
   ```powershell
   agent-browser --session smoke-test close
   ```
   *Hasil:* Proses browser ditutup bersih tanpa meninggalkan proses zombie.

---

## 8. Kendala yang Ditemukan & Solusi
| No | Kendala | Solusi yang Dilakukan |
|---|---|---|
| 1 | Koneksi unduhan Google Cloud Storage untuk Chrome for Testing sempat mengalami socket reset pada percobaan pertama dan kedua. | Dibiarkan auto-retry built-in `agent-browser install` hingga attempt ke-3 berhasil 100% dan terverifikasi di disk. |
| 2 | Perintah PowerShell memperlakukan `@e1` sebagai ekspresi *array splatting*. | Gunakan tanda petik tunggal saat mereferensikan ref ID di PowerShell: `'@e1'`. |
| 3 | `npx skills` meng-copy file ke `~/.agents/skills/agent-browser` secara default. | Disinkronkan ke direktori resmi Antigravity: `~/.gemini/config/skills/agent-browser` sehingga langsung dapat dideteksi oleh runtime Antigravity. |

---

## 9. Cara Menggunakan Agent Browser & Dogfood di Antigravity

### A. Pola Dasar Perintah CLI
Setiap sesi pengujian sebaiknya menggunakan parameter `--session <nama-sesi>` agar terisolasi:

```powershell
# 1. Buka URL target
agent-browser --session qa open http://localhost:3000/admin

# 2. Ambil snapshot pohon interaktif (AI refs)
agent-browser --session qa snapshot -i

# 3. Klik elemen berdasarkan ref
agent-browser --session qa click '@e1'

# 4. Isi form input
agent-browser --session qa fill '@e2' "fadli@example.com"

# 5. Ambil screenshot dengan anotasi bounding box
agent-browser --session qa screenshot --annotate ./dogfood-output/screenshots/step-1.png

# 6. Periksa error console dan exception
agent-browser --session qa errors
agent-browser --session qa console

# 7. Tutup sesi
agent-browser --session qa close
```

### B. Menjalankan Dogfood Exploratory QA
1. **Inisialisasi Direktori QA:**
   ```powershell
   mkdir -p ./dogfood-output/screenshots ./dogfood-output/videos
   ```
2. **Baca Instruksi Dogfood:**
   ```powershell
   agent-browser skills get dogfood --full
   ```
3. **Mulai Sesi QA Repro-First:**
   - Jelajahi alur halaman, navigasi, dan tombol.
   - Jika menemukan bug, ambil video reproduksi:
     ```powershell
     agent-browser --session qa record start ./dogfood-output/videos/bug-001.webm
     # Ulangi langkah pemicu bug...
     agent-browser --session qa record stop
     ```
   - Catat temuan ke laporan menggunakan template resmi `dogfood-report-template.md`.
