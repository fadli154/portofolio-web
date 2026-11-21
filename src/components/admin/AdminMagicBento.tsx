"use client";

import React, { useMemo } from "react";
import { Plus, Sparkles, ArrowUpRight } from "lucide-react";
import MagicBento, { type MagicBentoItem } from "@/components/MagicBento";
import { playMechanicalClick } from "@/lib/audio/sound-effects";
import type { AdminTab } from "./AdminHeader";

interface AdminMagicBentoProps {
  onNavigateTab: (tab: AdminTab) => void;
  counts: {
    coursework: number;
    projects: number;
    experiences: number;
    certificates: number;
    educations: number;
    categories?: number;
    inquiries: number;
  };
  dataSource: "supabase-live" | "local-seed-fallback";
  onQuickAdd: (type: "coursework" | "project" | "certificate" | "education") => void;
}

export function AdminMagicBento({
  onNavigateTab,
  counts,
  dataSource,
  onQuickAdd,
}: AdminMagicBentoProps) {
  const isSupabase = dataSource === "supabase-live";

  // Authentic ReactBits MagicBento items matching homepage color contract (Black, White, #c4e22e)
  const bentoItems: MagicBentoItem[] = useMemo(
    () => [
      {
        id: "coursework",
        title: "Perkuliahan K-1",
        description: `${counts.coursework} Sesi Hadir · Bukti Absensi & Tugas Terkelola`,
        label: "KEWIRAUSAHAAN",
        visual: "analytics",
        colSpan: 1,
        rowSpan: 1,
        onClick: () => {
          playMechanicalClick(720);
          onNavigateTab("coursework");
        },
      },
      {
        id: "projects",
        title: "Katalog Proyek",
        description: `${counts.projects} Studi Kasus Unggulan Terpublikasi`,
        label: "SELECTED WORK",
        visual: "dashboard",
        colSpan: 1,
        rowSpan: 1,
        onClick: () => {
          playMechanicalClick(700);
          onNavigateTab("projects");
        },
      },
      {
        id: "inbox",
        title: "Pesan Masuk",
        description: `${counts.inquiries} Pesan Masuk · Penawaran & Kolaborasi Klien`,
        label: "INBOX",
        visual: "collaboration",
        colSpan: 2,
        rowSpan: 2,
        onClick: () => {
          playMechanicalClick(680);
          onNavigateTab("inbox");
        },
      },
      {
        id: "educations",
        title: "Pendidikan & Rekayasa",
        description: "SMKN 4 Tangerang (RPL) → S1 Teknik Informatika UIN SMH Banten",
        label: "JEJAK AKADEMIK & RISET",
        visual: "education",
        colSpan: 2,
        rowSpan: 2,
        onClick: () => {
          playMechanicalClick(660);
          onNavigateTab("educations");
        },
      },
      {
        id: "certificates",
        title: "Sertifikat & Prestasi",
        description: `${counts.certificates} Kredensial Terverifikasi & Piagam Nasional`,
        label: "HONORS & BNSP",
        visual: "integration",
        colSpan: 1,
        rowSpan: 1,
        onClick: () => {
          playMechanicalClick(740);
          onNavigateTab("certificates");
        },
      },
      {
        id: "database",
        title: isSupabase ? "Supabase Live" : "Local Storage",
        description: isSupabase
          ? "PostgreSQL 15 RLS Aktif · Sinkronisasi Real-time"
          : "Browser Persistence Aktif",
        label: "DATABASE",
        visual: "security",
        colSpan: 1,
        rowSpan: 1,
        onClick: () => {
          playMechanicalClick(650);
          onNavigateTab("educations");
        },
      },
    ],
    [counts, isSupabase, onNavigateTab]
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner with Homepage Lime (#c4e22e) + Black + White */}
      <div className="relative overflow-hidden rounded-3xl border border-[#c4e22e]/20 bg-gradient-to-br from-[#131418] via-[#0d0e12] to-[#08080a] p-6 sm:p-8 shadow-2xl">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#c4e22e]/10 blur-3xl" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c4e22e]/30 bg-[#c4e22e]/10 px-3 py-1 font-mono text-[11px] font-bold text-[#c4e22e]">
              <Sparkles className="h-3 w-3" />
              <span>COMMAND CENTER</span>
            </div>
            <h1 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Selamat Datang, Fadli.
            </h1>
            <p className="mt-1 font-sans text-xs sm:text-sm text-white/70 max-w-2xl leading-relaxed">
              Kelola data portofolio, absensi perkuliahan K-1, dan pesan masuk.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                playMechanicalClick(720);
                onQuickAdd("coursework");
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-[#c4e22e] px-4 py-2.5 font-mono text-xs font-bold text-[#111213] shadow-lg shadow-[#c4e22e]/20 hover:bg-[#d6f53b] transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Sesi Kuliah</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playMechanicalClick(700);
                onQuickAdd("project");
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 font-mono text-xs font-bold text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Proyek</span>
            </button>
          </div>
        </div>
      </div>

      {/* Authentic ReactBits MagicBento Grid Component */}
      <div className="relative">
        <MagicBento
          preset="homepage"
          theme="homepage"
          glowColor="#c4e22e"
          spotlightRadius={260}
          enableStars={true}
          particleCount={18}
          enableBorderGlow={true}
          enableSpotlight={true}
          enableTilt={true}
          enableMagnetism={true}
          clickEffect={true}
          intro={true}
          columns={4}
          rowHeight={230}
          gap={20}
          radius={24}
          items={bentoItems}
        />
      </div>

      {/* Quick Nav Shortcut Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#0d0e12]/80 px-5 py-3.5 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-mono text-white/80">
          <span className="h-2 w-2 rounded-full bg-[#c4e22e] animate-pulse" />
          <span>Telemetri: {isSupabase ? "Supabase PostgreSQL RLS Live" : "Local Storage Cache Active"}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigateTab("coursework")}
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            <span>Buka Kuliah (K-1)</span>
            <ArrowUpRight className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab("projects")}
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            <span>Buka Proyek</span>
            <ArrowUpRight className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab("inbox")}
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            <span>Buka Inbox</span>
            <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
