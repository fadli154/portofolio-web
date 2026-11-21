"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  ExternalLink,
  LogOut,
  X,
  Database,
  BarChart3,
  BookOpen,
  Briefcase,
  FolderGit2,
  Award,
  GraduationCap,
  Inbox,
  ShieldCheck,
} from "lucide-react";
import { playMechanicalClick } from "@/lib/audio/sound-effects";
import type { AdminTab } from "./AdminHeader";

interface AdminNavDrawerProps {
  open: boolean;
  onClose: () => void;
  activeTab: AdminTab;
  onTabSelect: (tab: AdminTab) => void;
  dataSource: "supabase-live" | "local-seed-fallback";
  onLogoutClick: () => void;
  counts: {
    coursework: number;
    projects: number;
    experiences: number;
    certificates: number;
    educations: number;
    inquiries: number;
  };
}

export function AdminNavDrawer({
  open,
  onClose,
  activeTab,
  onTabSelect,
  dataSource,
  onLogoutClick,
  counts,
}: AdminNavDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const isSupabase = dataSource === "supabase-live";

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode; count?: number; desc: string }[] = [
    {
      id: "bento",
      label: "Overview",
      desc: "Ringkasan sistem & statistik performa",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      id: "coursework",
      label: "Coursework K-1",
      desc: "Log absensi & rincian tugas kuliah",
      icon: <BookOpen className="h-5 w-5" />,
      count: counts.coursework,
    },
    {
      id: "projects",
      label: "Studi Kasus",
      desc: "Katalog proyek unggulan & software",
      icon: <FolderGit2 className="h-5 w-5" />,
      count: counts.projects,
    },
    {
      id: "experiences",
      label: "Pengalaman Kerja",
      desc: "Riwayat magang, klien & rekayasa",
      icon: <Briefcase className="h-5 w-5" />,
      count: counts.experiences,
    },
    {
      id: "certificates",
      label: "Sertifikat & Prestasi",
      desc: "Juara OASE III & kredensial resmi",
      icon: <Award className="h-5 w-5" />,
      count: counts.certificates,
    },
    {
      id: "educations",
      label: "Jejak Pendidikan",
      desc: "Riwayat akademik SMKN 4 & UIN Banten",
      icon: <GraduationCap className="h-5 w-5" />,
      count: counts.educations,
    },
    {
      id: "inbox",
      label: "Kotak Masuk",
      desc: "Pesan & kontak penawaran kolaborasi",
      icon: <Inbox className="h-5 w-5" />,
      count: counts.inquiries,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md transition-opacity">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-out Panel */}
      <aside
        className="relative z-10 flex h-full w-full max-w-xs sm:max-w-sm flex-col justify-between border-l border-white/10 bg-[#0d0e12] p-5 shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#c4e22e] animate-pulse" />
              <span className="font-mono text-sm font-bold tracking-tight text-white">
                FADLI<span className="text-[#c4e22e]">.CMS</span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                playMechanicalClick(620);
                onClose();
              }}
              className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Database Status Card */}
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase text-white/50">Koneksi Database</span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold ${
                  isSupabase
                    ? "bg-[#c4e22e]/15 text-[#c4e22e]"
                    : "bg-white/10 text-white/70"
                }`}
              >
                <Database className="h-3 w-3" />
                <span>{isSupabase ? "Supabase Live" : "Local Store"}</span>
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="mt-5 space-y-1.5">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    playMechanicalClick(700);
                    onTabSelect(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between rounded-xl px-3.5 py-3 text-left transition-all ${
                    active
                      ? "bg-[#c4e22e] text-[#111213] font-bold shadow-md shadow-[#c4e22e]/20"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={active ? "text-[#111213]" : "text-white/60"}>
                      {item.icon}
                    </span>
                    <div>
                      <div className="font-sans text-sm font-semibold">{item.label}</div>
                      <div className={`text-[10px] ${active ? "text-[#111213]/80" : "text-white/40"}`}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                  {typeof item.count === "number" && (
                    <span
                      className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                        active ? "bg-black/20 text-[#111213]" : "bg-white/10 text-white/60"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 border-t border-white/10 pt-4 space-y-2">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 font-mono text-xs font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Kunjungi Website Publik</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              onClose();
              onLogoutClick();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 py-2.5 font-mono text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition-all"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Keluar dari Admin</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
