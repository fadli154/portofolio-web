# 🚨 Mandatory Skill-First Policy (Hukum Wajib Aktivasi Skill)

Kebijakan ini berlaku mutlak untuk seluruh model AI dan agent yang beroperasi di dalam repositori `portofolio-web`.

---

## 1. Prinsip Utama (Invariant)

1. **No Bare Actions**: Dilarang keras menulis kode, mengedit berkas, membuat rencana (plan), atau melakukan eksplorasi tanpa mengaktifkan skill yang relevan terlebih dahulu.
2. **Process Skill First**:
   - Jika tugas berupa ideasi, pembuatan fitur baru, atau penambahan komponen: aktifkan `brainstorming` terlebih dahulu sebelum menyusun rencana kerja (`writing-plans`).
   - Jika tugas berupa perbaikan bug, error build, atau layout glitch: aktifkan `systematic-debugging` terlebih dahulu sebelum mencoba memperbaikinya.
3. **Pengumuman Eksplisit**:
   Model harus selalu menyatakan di awal output atau proses penalaran:
   > *"Mengaktifkan skill `[nama-skill]` untuk `[tujuan spesifik]`..."*
4. **Kepatuhan Terhadap `SKILL.md`**:
   Buka dan baca berkas `SKILL.md` dari skill yang diaktifkan. Ikuti urutan langkah, rubrik, dan checklist yang ada tanpa melakukan jalan pintas atau improvisasi yang tidak terverifikasi.

---

## 2. Red Flags & Anti-Rasionalisasi

Jika salah satu pemikiran berikut muncul dalam penalaran (*reasoning*), **BERHENTI SEKETIKA** — ini adalah tanda pelanggaran disiplin:

| Pemikiran Keliru (Red Flag) | Tindakan Disiplin Wajib |
| :--- | :--- |
| *"Ini perubahan sepele, cukup edit 1-2 baris langsung"* | **STOP**. Perubahan kecil sering memicu regresi. Cari dan aktifkan skill yang relevan. |
| *"Saya buat kodenya dulu, skill-nya diaktifkan menyusul"* | **DILARANG**. Skill menentukan *cara* implementasi, bukan sekadar stempel pelengkap. |
| *"Saya sudah hafal isi skill ini di kepala"* | **STOP**. Skill terus diperbarui. Selalu baca berkas `SKILL.md` yang aktif. |
| *"Saya mau utak-atik kode dulu sebelum baca skill"* | **STOP**. Skill mengatur metode eksplorasi yang benar. Buka skill sebelum menyentuh kode. |
| *"Desain ini sudah terlihat bagus menurut saya"* | **DILARANG BERASUMSI**. Wajib diverifikasi via rubrik `ui-ux-pro-max` atau audit `jury`. |

