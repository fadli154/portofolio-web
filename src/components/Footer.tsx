"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePortfolioState } from "@/lib/i18n/context";
import { SITE_PROFILE } from "@/data/site";
import FadeContent from "@/components/reactbits/FadeContent";

export function Footer() {
  const pathname = usePathname();
  const { locale } = usePortfolioState();

  // Hide public footer on private Admin CMS routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-[#111213] py-16 text-[#f5f5f2]">
      <FadeContent blur={6} duration={0.7} ease="power2.out" threshold={0.08} initialOpacity={0} once={true}>
        <div className="keffi-wrap">
        <div className="keffi-grid items-start border-b border-white/12 pb-14">
          <div className="col-span-12 lg:col-span-6">
            <Link
              href="/"
              className="inline-flex min-h-[36px] items-center gap-3 text-2xl font-medium tracking-tight text-[#f5f5f2]"
            >
              <span>{SITE_PROFILE.fullName}</span>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
              {locale === "id"
                ? "Portofolio Pribadi & Rekayasa Mahasiswa Informatika (Kelompok K-1). Mendokumentasikan aplikasi Web & Mobile, sistem instansi publik (Project Warga Kominfo & Kopmas GovTech), serta ekosistem IoT & Edge AI (HajiCare & Sign2Speech)."
                : "Personal & Engineering Portfolio of Informatics Student (Group K-1). Documenting Web & Mobile engineering, public-sector systems (Project Warga Kominfo & Kopmas GovTech), and IoT & Edge AI ecosystems (HajiCare & Sign2Speech)."}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${SITE_PROFILE.email}`}
                className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 font-mono text-xs text-white/90 transition hover:-translate-y-0.5 hover:border-white hover:bg-[#f5f5f2] hover:text-[#111213]"
              >
                <span>{SITE_PROFILE.email}</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <div className="col-span-6 mt-8 sm:col-span-4 lg:col-span-3 lg:mt-0">
            <div className="font-mono text-[11px] uppercase tracking-widest text-white/60">
              {locale === "id" ? "Navigasi" : "Navigation"}
            </div>
            <ul className="mt-3 space-y-1 text-sm text-white/80">
              <li>
                <Link href="/#about" className="inline-flex min-h-[32px] items-center transition hover:translate-x-0.5 hover:text-white">
                  {locale === "id" ? "Profil & Metrik" : "About & Metrics"}
                </Link>
              </li>
              <li>
                <Link href="/#work" className="inline-flex min-h-[32px] items-center transition hover:translate-x-0.5 hover:text-white">
                  {locale === "id" ? "Pengalaman & Proyek" : "Selected Work & Experience"}
                </Link>
              </li>
              <li>
                <Link href="/#stack" className="inline-flex min-h-[32px] items-center transition hover:translate-x-0.5 hover:text-white">
                  {locale === "id" ? "Tech Stack & Arsitektur" : "Tech Stack & Architecture"}
                </Link>
              </li>
              <li>
                <Link href="/#coursework" className="inline-flex min-h-[32px] items-center transition hover:translate-x-0.5 hover:text-white">
                  {locale === "id" ? "Kewirausahaan (Kelompok K-1)" : "Coursework & Group K-1"}
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="inline-flex min-h-[32px] items-center transition hover:translate-x-0.5 hover:text-white">
                  {locale === "id" ? "Hubungi Saya" : "Contact"}
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-6 mt-8 sm:col-span-4 lg:col-span-3 lg:mt-0">
            <div className="font-mono text-[11px] uppercase tracking-widest text-white/60">
              {locale === "id" ? "Jejaring & Ekosistem" : "Socials & Ecosystem"}
            </div>
            <ul className="mt-3 space-y-1 text-sm text-white/80">
              <li>
                <a
                  href={SITE_PROFILE.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[32px] items-center gap-1.5 transition hover:translate-x-0.5 hover:text-white"
                >
                  <span>GitHub (@fadli154)</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
              <li>
                <a
                  href={SITE_PROFILE.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[32px] items-center gap-1.5 transition hover:translate-x-0.5 hover:text-white"
                >
                  <span>LinkedIn</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
              <li>
                <a
                  href={SITE_PROFILE.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[32px] items-center gap-1.5 transition hover:translate-x-0.5 hover:text-white"
                >
                  <span>Instagram (@fadli.890)</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
              <li>
                <a
                  href={SITE_PROFILE.socials.googleSites}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[32px] items-center gap-1.5 transition hover:translate-x-0.5 hover:text-white"
                >
                  <span>Google Sites Pribadi</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
              <li>
                <a
                  href={SITE_PROFILE.socials.kelompokK1}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[32px] items-center gap-1.5 transition hover:translate-x-0.5 hover:text-white"
                >
                  <span>Portal Kelompok K-1</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-white/45">
          <span>
            © {new Date().getFullYear()} {SITE_PROFILE.fullName} · Informatika Kelompok K-1
          </span>
          <span>@fadli154 · Next.js 15 · ReactBits · Supabase</span>
        </div>
        </div>
      </FadeContent>
    </footer>
  );
}
