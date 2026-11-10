# 🔒 Security, Quality & Zero-Cost Architecture Standards

Pedoman teknis untuk memastikan website portofolio aman, cepat, dan beroperasi dalam batas biaya Rp0 (Free Tier):

---

## 1. Keamanan & Secret Management
1. **0 Secret Leaks**: Dilarang melakukan commit terhadap file `.env`, service keys, atau credential pribadi.
2. **Supabase Row Level Security (RLS)**:
   - 100% tabel database wajib memiliki `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`.
   - Data publik (proyek, keahlian, pengalaman) hanya boleh dibaca secara anonim (`SELECT` policy).
   - Operasi tulis/ubah/hapus (`INSERT`, `UPDATE`, `DELETE`) hanya boleh diakses oleh authenticated user pemilik website.
3. **Client-Side Safety**:
   - `SUPABASE_SERVICE_ROLE_KEY` HANYA boleh diakses di Next.js Server Components, Server Actions, atau Route Handlers.
   - Jangan pernah menyertakan `NEXT_PUBLIC_` pada kunci admin/service role.

---

## 2. Kepatuhan Bebas Biaya Awal (Rp0 Operating Cost)
1. **Supabase Free Tier**:
   - Database storage $\le 500\text{ MB}$.
   - File storage $\le 1\text{ GB}$.
   - Terapkan kompresi gambar (WebP/AVIF) sebelum upload untuk menghemat bandwidth dan kapasitas storage.
2. **Vercel Free Tier**:
   - Edge request and serverless execution bounds dioptimalkan dengan Static Generation (SSG / ISR) untuk halaman publik.

---

## 3. Standar Kualitas Desain & Aksesibilitas
1. **WCAG 2.1 AA**: Kontras rasio teks minimal 4.5:1 untuk normal text, 3:1 untuk large text.
2. **Touch Ergonomics**: Ukuran target sentuh interaktif minimal 44x44px untuk mobile.
3. **Core Web Vitals**:
   - $\text{LCP} \le 2.5\text{s}$ (Largest Contentful Paint)
   - $\text{INP} \le 200\text{ms}$ (Interaction to Next Paint)
   - $\text{CLS} \le 0.1$ (Cumulative Layout Shift)

