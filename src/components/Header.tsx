"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, Sparkles } from "lucide-react";
import { usePortfolioState } from "@/lib/i18n/context";
import { SITE_PROFILE } from "@/data/site";
import { Magnet } from "@/components/reactbits/Magnet";
import { playMechanicalClick } from "@/lib/audio/sound-effects";

export function Header() {
  const pathname = usePathname();
  const { locale, toggleLocale } = usePortfolioState();
  const [isCompact, setIsCompact] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsCompact(window.scrollY > 90);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Handle ESC key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleNavClick = useCallback(() => {
    playMechanicalClick(620);
    setIsMobileMenuOpen(false);
  }, []);

  // Hide public header on private Admin CMS routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    {
      href: "/#about",
      label: locale === "id" ? "Profil" : "About",
      num: "01",
      desc: locale === "id" ? "Biografi & Rekapitulasi" : "Biography & Summary",
    },
    {
      href: "/#work",
      label: locale === "id" ? "Karya" : "Work",
      num: "02",
      desc: locale === "id" ? "3D Folder Galeri & Proyek" : "3D Folder Gallery & Projects",
    },
    {
      href: "/#stack",
      label: "Stack",
      num: "03",
      desc: locale === "id" ? "Arsitektur & Instrumen 3D" : "Architecture & 3D Instruments",
    },
    {
      href: "/#coursework",
      label: locale === "id" ? "Kuliah (K-1)" : "Coursework",
      num: "04",
      desc: locale === "id" ? "Log Absensi Kewirausahaan" : "Entrepreneurship Sessions",
    },
  ];

  return (
    <>
      <header className={`hdr ${isCompact ? "is-compact" : ""}`}>
        <div className="hdr__bar">
          {/* Left: Studio Keffi Minimal Brand */}
          <Link
            href="/"
            className="hdr__brand"
            aria-label={SITE_PROFILE.fullName}
            onClick={() => playMechanicalClick(520)}
          >
            <span className="hdr__brand-dot" aria-hidden="true" />
            <span>{SITE_PROFILE.shortName}</span>
          </Link>

          {/* Center: Desktop Floating Blurred Pill Navigation (4 Concise Items Only) */}
          <nav className="hdr__nav hidden md:inline-flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="hdr__link">
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right: Language Pill + Contact CTA (Desktop) / Hamburger Trigger (Mobile) */}
          <div className="hdr__right">
            <button
              type="button"
              onClick={() => {
                playMechanicalClick(480);
                toggleLocale();
              }}
              aria-label={
                locale === "id"
                  ? "Switch language to English"
                  : "Ubah bahasa ke Indonesia"
              }
              className="hdr__lang"
            >
              <span className={locale === "id" ? "opacity-100" : "opacity-45"}>ID</span>
              <span className="opacity-30">/</span>
              <span className={locale === "en" ? "opacity-100" : "opacity-45"}>EN</span>
            </button>

            {/* Desktop Contact CTA */}
            <div className="hidden md:block">
              <Magnet strength={0.18}>
                <Link
                  href="/#contact"
                  className="hdr__cta"
                  onClick={() => playMechanicalClick(680)}
                >
                  <span>{locale === "id" ? "Kontak" : "Contact"}</span>
                  <span aria-hidden="true">↗</span>
                </Link>
              </Magnet>
            </div>

            {/* Mobile Hamburger Trigger */}
            <button
              type="button"
              onClick={() => {
                playMechanicalClick(isMobileMenuOpen ? 450 : 650);
                setIsMobileMenuOpen((prev) => !prev);
              }}
              className="hdr__hamburger md:hidden"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Tutup Menu" : "Buka Menu Navigasi"}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-[var(--ink)]" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5 text-[var(--ink)]" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[70] flex flex-col bg-[#0c0d12]/95 backdrop-blur-2xl md:hidden transition-opacity duration-300 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          {/* Top Bar inside Drawer */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--violet)] animate-pulse" />
              <span className="text-base font-semibold tracking-tight text-white">
                {SITE_PROFILE.shortName}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/50 ml-2">
                // NAV
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  playMechanicalClick(480);
                  toggleLocale();
                }}
                className="hdr__lang !bg-white/10 !text-white !border-white/15"
                aria-label="Ubah Bahasa"
              >
                <span className={locale === "id" ? "opacity-100" : "opacity-45"}>ID</span>
                <span className="opacity-30">/</span>
                <span className={locale === "en" ? "opacity-100" : "opacity-45"}>EN</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playMechanicalClick(420);
                  setIsMobileMenuOpen(false);
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Tutup Menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Links List */}
          <div className="flex-1 overflow-y-auto px-6 py-8">
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  className="group flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 p-4 text-white hover:border-[var(--violet)] hover:bg-white/10 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs font-bold text-[var(--violet)]">
                      {item.num}
                    </span>
                    <div>
                      <div className="text-lg font-semibold tracking-tight text-white group-hover:text-[var(--lime)] transition-colors">
                        {item.label}
                      </div>
                      <div className="font-mono text-xs text-white/50">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-white/40 group-hover:text-white transition-colors" />
                </Link>
              ))}
            </div>

            {/* Contact CTA inside Drawer */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <Link
                href="/#contact"
                onClick={handleNavClick}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--lime)] py-4 px-6 text-sm font-bold text-[#111213] shadow-lg hover:brightness-110 transition-all"
              >
                <span>{locale === "id" ? "Kirim Pesan / Kontak" : "Get In Touch / Contact"}</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Bottom Drawer Meta */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-black/40 font-mono text-[11px] text-white/50">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-[var(--lime)]" />
              <span>{locale === "id" ? "Tersedia untuk Proyek" : "Available for Projects"}</span>
            </div>
            <span>Jakarta · 2026</span>
          </div>
        </div>
      )}
    </>
  );
}
