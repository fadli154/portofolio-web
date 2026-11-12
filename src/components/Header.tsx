"use client";

import React, { useEffect, useLayoutEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { X, ArrowUpRight, Sparkles } from "lucide-react";
import { usePortfolioState } from "@/lib/i18n/context";
import { SITE_PROFILE } from "@/data/site";
import { Magnet } from "@/components/reactbits/Magnet";
import { playMechanicalClick } from "@/lib/audio/sound-effects";
import type { Locale } from "@/lib/i18n/context";

function LocaleToggleButton({
  locale,
  onToggle,
  variant = "header",
}: {
  locale: Locale;
  onToggle: () => void;
  variant?: "header" | "drawer";
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      data-locale={locale}
      aria-label={`ID / EN (${locale === "id" ? "Switch language to English" : "Ubah bahasa ke Indonesia"})`}
      className={`hdr__lang ${
        variant === "drawer" ? "hdr__lang--dark min-h-[44px]" : "min-h-[40px]"
      }`}
    >
      <span className="hdr__lang-thumb" aria-hidden="true" />
      <span className={`hdr__lang-opt ${locale === "id" ? "is-active" : ""}`}>ID</span>
      <span className={`hdr__lang-opt ${locale === "en" ? "is-active" : ""}`}>EN</span>
    </button>
  );
}

export function Header() {
  const pathname = usePathname();
  const { locale, toggleLocale } = usePortfolioState();
  const [isCompact, setIsCompact] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDrawerMounted, setIsDrawerMounted] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      setIsCompact(window.scrollY > 90);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ensure drawer mounts synchronously on open
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsDrawerMounted(true);
    }
  }, [isMobileMenuOpen]);

  // Smooth choreographed GSAP entrance/exit before paint (prevents abrupt pop-in/pop-out)
  useLayoutEffect(() => {
    if (!isDrawerMounted) return;
    const drawer = drawerRef.current;
    const panel = panelRef.current;
    if (!drawer || !panel) return;

    const items = Array.from(drawer.querySelectorAll<HTMLElement>("[data-drawer-item]"));
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    gsap.killTweensOf([drawer, panel, ...items]);

    if (isMobileMenuOpen) {
      wasOpenRef.current = true;
      if (prefersReducedMotion) {
        gsap.set(drawer, { opacity: 1 });
        gsap.set(panel, { opacity: 1, y: 0, scale: 1 });
        gsap.set(items, { opacity: 1, y: 0 });
        closeButtonRef.current?.focus({ preventScroll: true });
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          closeButtonRef.current?.focus({ preventScroll: true });
        },
      });

      tl.fromTo(
        drawer,
        { opacity: 0 },
        { opacity: 1, duration: 0.36, ease: "power3.out" },
        0
      )
        .fromTo(
          panel,
          { opacity: 0, y: -16, scale: 0.985 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.42,
            ease: "power3.out",
            clearProps: "transform",
          },
          0.02
        )
        .fromTo(
          items,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.38,
            stagger: 0.055,
            ease: "power3.out",
            clearProps: "transform",
          },
          0.08
        );

      return () => {
        tl.kill();
      };
    }

    if (prefersReducedMotion) {
      setIsDrawerMounted(false);
      return;
    }

    const exitTl = gsap.timeline({
      onComplete: () => {
        setIsDrawerMounted(false);
        if (wasOpenRef.current) {
          wasOpenRef.current = false;
          hamburgerRef.current?.focus({ preventScroll: true });
        }
      },
    });

    exitTl
      .to(
        items,
        {
          opacity: 0,
          y: -8,
          duration: 0.2,
          stagger: 0.02,
          ease: "power2.in",
        },
        0
      )
      .to(
        panel,
        {
          opacity: 0,
          y: -12,
          scale: 0.985,
          duration: 0.24,
          ease: "power2.in",
        },
        0.04
      )
      .to(
        drawer,
        {
          opacity: 0,
          duration: 0.28,
          ease: "power2.in",
        },
        0.06
      );

    return () => {
      exitTl.kill();
    };
  }, [isMobileMenuOpen, isDrawerMounted]);

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

  const isDarkRoute = pathname === "/certificates";

  return (
    <>
      <header className={`hdr ${isCompact ? "is-compact" : ""} ${isDarkRoute ? "hdr--dark" : ""}`}>
        <div className="hdr__bar">
          {/* Left: Minimal Brand */}
          <Link
            href="/"
            className="hdr__brand min-h-[40px]"
            onClick={() => playMechanicalClick(520)}
          >
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
            <LocaleToggleButton locale={locale} onToggle={toggleLocale} />

            {/* Desktop Contact CTA */}
            <div className="hidden md:block">
              <Magnet strength={0.18}>
                <Link
                  href="/#contact"
                  className="hdr__cta min-h-[40px]"
                  onClick={() => playMechanicalClick(680)}
                >
                  <span>{locale === "id" ? "Kontak" : "Contact"}</span>
                  <span aria-hidden="true">↗</span>
                </Link>
              </Magnet>
            </div>

            {/* Mobile Hamburger Trigger */}
            <button
              ref={hamburgerRef}
              type="button"
              onClick={() => {
                playMechanicalClick(isMobileMenuOpen ? 450 : 650);
                setIsMobileMenuOpen((prev) => !prev);
              }}
              className="hdr__hamburger relative !h-11 !w-11 active:scale-95 transition-transform duration-200 md:hidden"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              aria-label={isMobileMenuOpen ? "Tutup Menu" : "Buka Menu Navigasi"}
            >
              <span className="relative flex h-4 w-4 flex-col items-center justify-center" aria-hidden="true">
                <span
                  className={`absolute h-[1.75px] w-4 rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                    isMobileMenuOpen ? "translate-y-0 rotate-45" : "-translate-y-[5px] rotate-0"
                  }`}
                />
                <span
                  className={`absolute h-[1.75px] w-4 rounded-full bg-current transition-all duration-200 ease-out motion-reduce:transition-none ${
                    isMobileMenuOpen ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100"
                  }`}
                />
                <span
                  className={`absolute h-[1.75px] w-4 rounded-full bg-current transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                    isMobileMenuOpen ? "translate-y-0 -rotate-45" : "translate-y-[5px] rotate-0"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer Overlay */}
      {isDrawerMounted && (
        <div
          ref={drawerRef}
          id="mobile-navigation-drawer"
          style={{ opacity: 0 }}
          className={`fixed inset-0 z-[70] flex flex-col bg-[#0c0d12]/94 backdrop-blur-2xl md:hidden ${
            isMobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              playMechanicalClick(420);
              setIsMobileMenuOpen(false);
            }
          }}
        >
          <div ref={panelRef} className="flex h-full w-full flex-col">
            {/* Top Bar inside Drawer */}
            <div className="flex items-center justify-between px-[var(--container-gutter)] py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold tracking-tight text-white">
                  {SITE_PROFILE.shortName}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/55 ml-1">
                  NAV
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <LocaleToggleButton locale={locale} onToggle={toggleLocale} variant="drawer" />
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => {
                    playMechanicalClick(420);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 active:scale-95 transition-all duration-200"
                  aria-label="Tutup Menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Links List */}
            <div className="flex-1 overflow-y-auto px-[var(--container-gutter)] py-6">
              <div className="flex flex-col gap-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleNavClick}
                    data-drawer-item=""
                    className="group flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 p-4 text-white hover:border-[#c4e22e] hover:bg-white/10 transition-[border-color,background-color] duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs font-bold text-[#c4e22e]">
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
              <div
                data-drawer-item=""
                className="mt-8 pt-6 border-t border-white/10"
              >
                <Link
                  href="/#contact"
                  onClick={handleNavClick}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--lime)] py-4 px-6 text-sm font-bold text-[#111213] shadow-lg hover:brightness-110 active:scale-[0.99] transition-all"
                >
                  <span>{locale === "id" ? "Kirim Pesan / Kontak" : "Get In Touch / Contact"}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Bottom Drawer Meta */}
            <div
              data-drawer-item=""
              className="flex items-center justify-between px-[var(--container-gutter)] py-4 border-t border-white/10 bg-black/40 font-mono text-[11px] text-white/50"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-[var(--lime)]" />
                <span>{locale === "id" ? "Tersedia untuk Proyek" : "Available for Projects"}</span>
              </div>
              <span>Jakarta · 2026</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
