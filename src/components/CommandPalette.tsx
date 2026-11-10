"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Briefcase,
  Check,
  Copy,
  FileCode2,
  FolderGit2,
  Globe,
  Layers,
  Lock,
  Search,
  Sparkles,
  Volume2,
  X,
} from "lucide-react";
import { usePortfolioState } from "@/lib/i18n/context";
import { PROJECTS, SITE_PROFILE } from "@/data/site";
import { playMechanicalClick } from "@/lib/audio/sound-effects";

export function CommandPalette() {
  const router = useRouter();
  const {
    commandOpen,
    setCommandOpen,
    locale,
    toggleLocale,
    lens,
    toggleLens,
    toggleSound,
    soundOn,
    openInquiryWithScope,
  } = usePortfolioState();

  const [query, setQuery] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (commandOpen) {
      setQuery("");
      window.setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [commandOpen]);

  useEffect(() => {
    if (!commandOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setCommandOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [commandOpen, setCommandOpen]);

  if (!commandOpen) return null;

  const copyEmail = async () => {
    playMechanicalClick(760);
    try {
      await navigator.clipboard.writeText(SITE_PROFILE.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  const actions = [
    {
      id: "lens",
      group: locale === "id" ? "Kontrol Lensa & Instrumen" : "Lens & Instrument Controls",
      label:
        lens === "craft"
          ? locale === "id"
            ? "Beralih ke Lensa Rekruter (Swiss Editorial Light)"
            : "Switch to Recruiter Lens (Swiss Editorial Light)"
          : locale === "id"
            ? "Beralih ke Lensa Craft (Obsidian Dark)"
            : "Switch to Craft Lens (Obsidian Dark)",
      icon: lens === "craft" ? Briefcase : Sparkles,
      shortcut: "LENS",
      run: () => {
        toggleLens();
        setCommandOpen(false);
      },
    },
    {
      id: "inquiry",
      group: locale === "id" ? "Kontak & Rekrutmen" : "Hiring & Direct Contact",
      label:
        locale === "id"
          ? "Buka Formulir Diskusi Proyek / Rekrutmen"
          : "Open Smart Inquiry & Hiring Modal",
      icon: Layers,
      shortcut: "HIRE",
      run: () => {
        setCommandOpen(false);
        openInquiryWithScope("full-time");
      },
    },
    {
      id: "copy-email",
      group: locale === "id" ? "Kontak & Rekrutmen" : "Hiring & Direct Contact",
      label: copiedEmail
        ? locale === "id"
          ? `Tersalin: ${SITE_PROFILE.email}`
          : `Copied: ${SITE_PROFILE.email}`
        : locale === "id"
          ? `Salin Email (${SITE_PROFILE.email})`
          : `Copy Direct Email (${SITE_PROFILE.email})`,
      icon: copiedEmail ? Check : Copy,
      shortcut: "COPY",
      run: copyEmail,
    },
    {
      id: "locale",
      group: locale === "id" ? "Kontrol Lensa & Instrumen" : "Lens & Instrument Controls",
      label:
        locale === "en"
          ? "Switch Interface Language to Bahasa Indonesia (ID)"
          : "Ubah Bahasa Antarmuka ke Bahasa Inggris (EN)",
      icon: Globe,
      shortcut: "I18N",
      run: () => {
        toggleLocale();
        setCommandOpen(false);
      },
    },
    {
      id: "sound",
      group: locale === "id" ? "Kontrol Lensa & Instrumen" : "Lens & Instrument Controls",
      label: soundOn
        ? locale === "id"
          ? "Matikan Suara Sakelar Mekanis"
          : "Mute Mechanical Switch Audio"
        : locale === "id"
          ? "Aktifkan Suara Sakelar Mekanis"
          : "Enable Mechanical Switch Audio",
      icon: Volume2,
      shortcut: "AUDIO",
      run: () => {
        toggleSound();
      },
    },
    ...PROJECTS.map((project) => ({
      id: `proj-${project.slug}`,
      group: locale === "id" ? "Studi Kasus Arsitektur" : "Architectural Case Studies",
      label: `${project.indexCode} · ${project.title}`,
      icon: FileCode2,
      shortcut: project.year,
      run: () => {
        setCommandOpen(false);
        router.push(`/projects/${project.slug}`);
      },
    })),
    {
      id: "all-projects",
      group: locale === "id" ? "Navigasi Halaman" : "Route Navigation",
      label: locale === "id" ? "Lihat Semua Arsip Proyek (/projects)" : "View Full Project Archive (/projects)",
      icon: FolderGit2,
      shortcut: "ROUTE",
      run: () => {
        setCommandOpen(false);
        router.push("/projects");
      },
    },
  ];

  const filtered = actions.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.group.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 px-4 pt-[12vh] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={() => setCommandOpen(false)}
    >
      <div
        className="w-full max-w-2xl border border-[var(--rule-strong)] bg-[var(--bg)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-[var(--rule)] px-4 py-3.5">
          <Search className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              locale === "id"
                ? "Ketik perintah, nama studi kasus, atau aksi cepat..."
                : "Type a command, case study title, or quick action..."
            }
            className="w-full bg-transparent font-mono text-xs text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setCommandOpen(false)}
            className="border border-[var(--rule)] px-2 py-1 font-mono text-[10px] uppercase text-[var(--ink-muted)] hover:text-[var(--ink)]"
            aria-label="Close command palette"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="py-8 text-center font-mono text-xs text-[var(--ink-muted)]">
              {locale === "id" ? "Tidak ada perintah yang cocok." : "No matching command found."}
            </p>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={item.run}
                  className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[var(--bg-elevated)]"
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
                    <span>
                      <span className="block font-mono text-[10px] uppercase tracking-wider text-[var(--ink-muted)]">
                        {item.group}
                      </span>
                      <span className="text-sm text-[var(--ink)]">{item.label}</span>
                    </span>
                  </span>
                  <span className="border border-[var(--rule)] px-2 py-0.5 font-mono text-[10px] text-[var(--ink-muted)]">
                    {item.shortcut}
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[var(--rule)] px-4 py-2.5 font-mono text-[11px] text-[var(--ink-muted)]">
          <span>FADLI HIFZIANSYAH · TELEMETRY COMMAND</span>
          <span>ESC TO CLOSE</span>
        </div>
      </div>
    </div>
  );
}

