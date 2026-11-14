# Panduan Remote Prompting Smartphone (Cloud Web IDE)

Panduan ini memungkinkan Anda melakukan **remote prompting, pengembangan, dan git push langsung dari smartphone** saat laptop Anda dalam kondisi **mati / shutdown total**.

---

## 🏗️ Cara Kerja Arsitektur

```
[ Smartphone / Tablet ] (Browser: Chrome / Safari)
          │
          ▼ HTTPS (Web IDE)
[ GitHub Codespaces Cloud Container ] (Node.js 20 Linux)
    ├── Antigravity CLI / Gemini AI Agent (Cloud Model Google)
    ├── Local Git Repo (Terhubung otomatis ke akun GitHub)
    ├── Port 3000 Web Preview (Bisa dilihat langsung dari HP)
    └── .agents/skills/ (Semua skill proyek aktif otomatis)
          │
          ▼ Auto Auth & Push
[ GitHub Repository: fadli154/portofolio-web ]
```

- **Laptop Status:** Bebas shutdown / dimatikan.
- **Model AI:** Tetap menggunakan model cloud Google (Gemini 3.8 Flash, Gemini 4 Argon, dll).
- **Kredensial Git:** Otomatis tersambung ke akun GitHub Anda tanpa perlu login token manual.
- **Biaya:** Gratis 60 jam per bulan (kuota bawaan setiap akun GitHub). Mesin otomatis mati sendiri (*auto-suspend*) setelah 30 menit tidak aktif.

---

## 📱 Langkah Membuka & Prompting dari Smartphone

### 1. Buka Repositori di Browser HP
1. Buka browser di smartphone (Chrome atau Safari) lalu masuk ke:
   `https://github.com/fadli154/portofolio-web`
2. Pastikan Anda sudah login ke akun GitHub Anda.
3. Tekan tombol hijau **`<> Code`**.
4. Pilih tab **`Codespaces`**.
5. Tekan tombol **`Create codespace on main`** (atau buka Codespace yang sudah pernah dibuat).

### 2. Tampilan Web IDE di Smartphone
1. Browser smartphone akan memuat tampilan VS Code Web lengkap dengan:
   - Sidebar Explorer (berkas-berkas proyek)
   - Terminal terintegrasi
   - Port forwarding (Preview Web)
2. Dependensi proyek (`npm install`) akan terpasang otomatis dari berkas [devcontainer.json](file:///c:/fadli/portofolio-web/.devcontainer/devcontainer.json).

### 3. Menjalankan Preview Web di HP
1. Di terminal VS Code Web pada smartphone, jalankan:
   ```bash
   npm run dev
   ```
2. Klik tab **`Ports`** di bagian bawah, lalu klik ikon **Open in Browser** (atau globe) di sebelah port **`3000`**.
3. Browser akan membuka tab baru menampilkan website portofolio Anda secara live dari smartphone.

### 4. Prompting Agent & Git Push
1. Buka terminal di Codespaces smartphone Anda.
2. Jalankan:
   ```bash
   npm run agent
   ```
   Atau jalankan `agy` (Antigravity CLI) langsung dari terminal.
3. Berikan instruksi prompt seperti biasa, misalnya:
   - *"Tolong perbaiki responsive layout di section stack"*
   - *"Tolong tambahkan proyek baru di data/site.ts"*
   - *"Tolong jalankan typecheck, dan jika lulus langsung commit serta push ke GitHub"*
4. Agen di cloud akan langsung mengedit kode, menjalankan verifikasi, dan melakukan `git push` langsung ke repositori GitHub Anda.

---

## 💡 Tips Penggunaan di Smartphone

1. **Jadikan Web App (Add to Home Screen):**
   - Di Safari iOS: Tap tombol *Share* -> *Add to Home Screen*.
   - Di Chrome Android: Tap titik tiga -> *Install app / Add to Home screen*.
   - VS Code Web akan terbuka dalam mode layar penuh (fullscreen) seperti aplikasi native.
2. **Hemat Kuota Codespaces:**
   - Codespaces otomatis *sleep* setelah 30 menit tidak ada aktivitas.
   - Anda juga bisa mematikannya manual melalui menu titik tiga -> *Stop Current Codespace*.
