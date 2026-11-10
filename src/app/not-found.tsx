import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="section-shell flex min-h-[72vh] items-center bg-[var(--bg)]">
      <div className="page-grid">
        <div className="surface-card col-span-12 p-8 md:p-14">
          <div className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            <span>Error 404 · Halaman Tidak Ditemukan</span>
          </div>
          <h1 className="page-display-title mt-4">
            Halaman yang Anda cari tidak tersedia.
          </h1>
          <p className="mt-4 max-w-xl text-base text-[var(--ink-muted)]">
            Tautan mungkin telah berubah atau halaman proyek belum dipublikasikan. Silakan kembali ke halaman utama atau telusuri daftar proyek yang tersedia.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/" className="btn-primary">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Kembali ke Beranda</span>
            </Link>
            <Link href="/projects" className="btn-secondary">
              <span>Lihat Daftar Proyek</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
