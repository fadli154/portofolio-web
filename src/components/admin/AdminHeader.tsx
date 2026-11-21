"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  Briefcase,
  FolderGit2,
  Award,
  GraduationCap,
  Inbox,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import BranchedMenu, { type BranchedMenuItem } from "@/components/BranchedMenu";
import { playMechanicalClick } from "@/lib/audio/sound-effects";

export type AdminTab =
  | "bento"
  | "coursework"
  | "projects"
  | "experiences"
  | "certificates"
  | "educations"
  | "inbox";

export interface AdminHeaderProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  dataSource?: "supabase-live" | "local-seed-fallback";
  isMobileDrawerOpen: boolean;
  onToggleMobileDrawer: () => void;
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

export function AdminHeader({
  activeTab,
  onTabChange,
  isMobileDrawerOpen,
  onToggleMobileDrawer,
  onLogoutClick,
  counts,
}: AdminHeaderProps) {
  const menuItems: BranchedMenuItem[] = useMemo(
    () => [
      {
        value: "brand_section",
        label: (
          <div className="flex items-center gap-2 font-mono text-sm font-bold tracking-tight text-white py-1">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c4e22e] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#c4e22e]" />
            </span>
            <span>
              FADLI<span className="text-[#c4e22e]">.CMS</span>
            </span>
          </div>
        ),
        children: [
          {
            value: "bento",
            label: "Overview",
            icon: <BarChart3 className="h-4 w-4" />,
          },
          {
            value: "coursework",
            label: `Coursework K-1 (${counts.coursework})`,
            icon: <BookOpen className="h-4 w-4" />,
          },
          {
            value: "projects",
            label: `Studi Kasus (${counts.projects})`,
            icon: <FolderGit2 className="h-4 w-4" />,
          },
          {
            value: "experiences",
            label: `Pengalaman (${counts.experiences})`,
            icon: <Briefcase className="h-4 w-4" />,
          },
          {
            value: "certificates",
            label: `Sertifikat (${counts.certificates})`,
            icon: <Award className="h-4 w-4" />,
          },
          {
            value: "educations",
            label: `Pendidikan (${counts.educations})`,
            icon: <GraduationCap className="h-4 w-4" />,
          },
          {
            value: "inbox",
            label: `Kotak Masuk (${counts.inquiries})`,
            icon: <Inbox className="h-4 w-4" />,
          },
        ],
      },
      {
        value: "system_section",
        label: (
          <div className="font-mono text-xs uppercase tracking-wider text-white/50 font-semibold py-1">
            Akses & Navigasi
          </div>
        ),
        children: [
          {
            value: "website",
            label: "Lihat Website ↗",
            icon: <ExternalLink className="h-4 w-4 text-white/70" />,
          },
          {
            value: "logout",
            label: "Logout Admin",
            icon: <LogOut className="h-4 w-4 text-rose-400" />,
          },
        ],
      },
    ],
    [counts]
  );

  const handleSelect = (value: string) => {
    playMechanicalClick(680);
    if (value === "website") {
      window.open("/", "_blank");
      if (isMobileDrawerOpen) onToggleMobileDrawer();
      return;
    }
    if (value === "logout") {
      if (isMobileDrawerOpen) onToggleMobileDrawer();
      onLogoutClick();
      return;
    }
    onTabChange(value as AdminTab);
    if (isMobileDrawerOpen) onToggleMobileDrawer();
  };

  return (
    <>
      {/* 1. Mobile Topbar Header (lg:hidden) */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-white/10 bg-[#090a0d]/95 px-4 backdrop-blur-md lg:hidden">
        <Link
          href="/admin"
          className="flex items-center gap-2 font-mono text-sm font-bold tracking-tight text-white"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c4e22e] opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#c4e22e]" />
          </span>
          <span>
            FADLI<span className="text-[#c4e22e]">.CMS</span>
          </span>
        </Link>

        <button
          type="button"
          onClick={() => {
            playMechanicalClick(720);
            onToggleMobileDrawer();
          }}
          aria-label={isMobileDrawerOpen ? "Tutup Menu" : "Buka Menu Admin"}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white hover:bg-white/10 transition-colors"
        >
          {isMobileDrawerOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* 2. Mobile Slide-out Drawer (lg:hidden) */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-start bg-black/80 backdrop-blur-md transition-opacity lg:hidden">
          <div className="absolute inset-0" onClick={onToggleMobileDrawer} />
          <aside
            className="relative z-10 flex h-full w-72 flex-col justify-between border-r border-white/10 bg-[#090a0d] p-6 shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-5">
                <span className="font-mono text-xs uppercase tracking-wider text-white/50">
                  Navigasi Cabang
                </span>
                <button
                  type="button"
                  onClick={onToggleMobileDrawer}
                  className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <BranchedMenu
                items={menuItems}
                active={activeTab}
                onSelect={handleSelect}
                defaultOpen="all"
                color="#ffffff"
                accentColor="#c4e22e"
                lineColor="rgba(255, 255, 255, 0.15)"
                width={240}
                rowHeight={38}
                indent={34}
              />
            </div>

            <div className="pt-4 border-t border-white/10 font-mono text-[11px] text-white/40 flex items-center justify-between">
              <span>Command Center</span>
              <span className="flex items-center gap-1.5 text-[#c4e22e]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c4e22e]" />
                Online
              </span>
            </div>
          </aside>
        </div>
      )}

      {/* 3. Desktop Sticky Left Sidebar (hidden lg:flex) */}
      <aside className="hidden lg:flex w-72 shrink-0 flex-col justify-between border-r border-white/10 bg-[#090a0d] sticky top-0 h-screen overflow-y-auto p-6">
        <div>
          {/* Subtitle Header */}
          <div className="pb-5 border-b border-white/10 mb-5 flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-white/40 font-semibold">
              Command Center
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-[#c4e22e]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c4e22e]" />
              Active
            </span>
          </div>

          {/* ReactBits BranchedMenu */}
          <BranchedMenu
            items={menuItems}
            active={activeTab}
            onSelect={handleSelect}
            defaultOpen="all"
            color="#ffffff"
            accentColor="#c4e22e"
            lineColor="rgba(255, 255, 255, 0.15)"
            width={240}
            rowHeight={38}
            indent={34}
          />
        </div>

        {/* Footer Credit & Status */}
        <div className="pt-5 border-t border-white/10 font-mono text-[11px] text-white/40 flex items-center justify-between">
          <span>Fadli Portofolio</span>
          <span className="text-white/30">v2.4</span>
        </div>
      </aside>
    </>
  );
}
