"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePortfolioState } from "@/lib/i18n/context";
import { SITE_PROFILE } from "@/data/site";
import { Magnet } from "@/components/reactbits/Magnet";

export function Header() {
  const pathname = usePathname();
  const { locale, toggleLocale } = usePortfolioState();
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsCompact(window.scrollY > 90);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hide public header on private Admin CMS routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    { href: "/#about", label: locale === "id" ? "Profil" : "About" },
    { href: "/#work", label: locale === "id" ? "Karya" : "Work" },
    { href: "/#stack", label: "Stack" },
    { href: "/#coursework", label: locale === "id" ? "Kuliah (K-1)" : "Coursework" },
  ];

  return (
    <header className={`hdr ${isCompact ? "is-compact" : ""}`}>
      <div className="hdr__bar">
        {/* Left: Studio Keffi Minimal Brand */}
        <Link href="/" className="hdr__brand" aria-label={SITE_PROFILE.fullName}>
          <span className="hdr__brand-dot" aria-hidden="true" />
          <span>{SITE_PROFILE.shortName}</span>
        </Link>

        {/* Center: Floating Blurred Pill Navigation (4 Concise Items Only) */}
        <nav className="hdr__nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hdr__link">
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: Language Pill + Contact CTA */}
        <div className="hdr__right">
          <button
            type="button"
            onClick={toggleLocale}
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

          <Magnet strength={0.18}>
            <Link href="/#contact" className="hdr__cta">
              <span>{locale === "id" ? "Kontak" : "Contact"}</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </Magnet>
        </div>
      </div>
    </header>
  );
}
