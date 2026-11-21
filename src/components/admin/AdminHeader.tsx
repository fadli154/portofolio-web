"use client";

import React, { useMemo, useState } from "react";
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
  PanelLeftClose,
  PanelLeftOpen,
  Tags,
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
  | "categories"
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
    categories?: number;
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
  // Desktop collapsed state (persisted to localStorage)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem("admin_sidebar_collapsed") === "true";
    }
    return false;
  });

  const toggleCollapsed = () => {
    playMechanicalClick(750);
    setIsCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        window.localStorage.setItem("admin_sidebar_collapsed", String(next));
      }
      return next;
    });
  };

  const menuItems: BranchedMenuItem[] = useMemo(
    () => [
      {
        value: "brand_section",
        label: (
          <div className="flex items-center gap-2 font-mono text-sm font-bold tracking-tight text-white py-1">
            <span className="relative flex h-2.5 w-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#c4e22e]" />
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
            value: "categories",
            label: `Kategori (${counts.categories ?? 0})`,
            icon: <Tags className="h-4 w-4" />,
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

  const iconNavItems: {
    id: AdminTab;
    label: string;
    count?: number;
    icon: React.ReactNode;
  }[] = [
    { id: "bento", label: "Overview", icon: <BarChart3 className="h-4 w-4" /> },
    { id: "coursework", label: "Coursework K-1", count: counts.coursework, icon: <BookOpen className="h-4 w-4" /> },
    { id: "projects", label: "Studi Kasus", count: counts.projects, icon: <FolderGit2 className="h-4 w-4" /> },
    { id: "experiences", label: "Pengalaman", count: counts.experiences, icon: <Briefcase className="h-4 w-4" /> },
    { id: "certificates", label: "Sertifikat", count: counts.certificates, icon: <Award className="h-4 w-4" /> },
    { id: "educations", label: "Pendidikan", count: counts.educations, icon: <GraduationCap className="h-4 w-4" /> },
    { id: "categories", label: "Kategori", count: counts.categories ?? 0, icon: <Tags className="h-4 w-4" /> },
    { id: "inbox", label: "Kotak Masuk", count: counts.inquiries, icon: <Inbox className="h-4 w-4" /> },
  ];

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
            <span className="h-2.5 w-2.5 rounded-full bg-[#c4e22e]" />
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

      {/* 2. Mobile Slide-out Drawer (lg:hidden) with Smooth Slide-in Animation from Left */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 lg:hidden ${
          isMobileDrawerOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop overlay with blur */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
          onClick={onToggleMobileDrawer}
        />

        {/* Sliding Panel from left as a modern floating card */}
        <aside
          className={`absolute top-4 bottom-4 left-4 z-10 flex w-72 flex-col justify-between rounded-3xl border border-white/10 bg-[#0c0d12]/98 p-6 shadow-2xl backdrop-blur-2xl overflow-y-auto transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isMobileDrawerOpen ? "translate-x-0" : "-translate-x-[calc(100%+2rem)]"
          }`}
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

      {/* 3. Desktop Floating Left Sidebar (Card Island) with Collapsible Icon-Rail Mode */}
      {/* Layout Spacer so desktop document flow never shifts or clips during scroll */}
      <div
        className={`hidden lg:block shrink-0 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isCollapsed ? "w-[100px]" : "w-[296px]"
        }`}
        aria-hidden="true"
      />

      {/* Permanently Fixed Floating Left Sidebar (100% viewport locked, zero scroll-cut) */}
      <aside
        className={`hidden lg:flex fixed left-4 top-4 bottom-4 z-40 flex-col justify-between rounded-3xl border border-white/10 bg-[#0c0d12]/95 backdrop-blur-xl shadow-2xl shadow-black/80 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-visible admin-shiny-sidebar ${
          isCollapsed ? "w-[76px] p-3.5" : "w-[272px] p-5"
        }`}
      >
        <div>
          {/* Header with Minimalist Dock Toggle (replaces old "Active" text) */}
          <div
            className={`pb-4 border-b border-white/10 mb-4 flex items-center ${
              isCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            {!isCollapsed ? (
              <div className="flex items-center gap-2 font-mono text-sm font-bold tracking-tight text-white">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#c4e22e]" />
                </span>
                <span>
                  FADLI<span className="text-[#c4e22e]">.CMS</span>
                </span>
              </div>
            ) : null}
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label={isCollapsed ? "Perluas Sidebar" : "Persempit Sidebar"}
              title={isCollapsed ? "Perluas Sidebar (Menu Cabang)" : "Persempit Sidebar (Icon Only)"}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 hover:border-[#c4e22e]/40 hover:text-[#c4e22e] hover:bg-[#c4e22e]/10 transition-all cursor-pointer"
            >
              {isCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Conditional Display: Expanded BranchedMenu vs Collapsed Icon Rail */}
          {!isCollapsed ? (
            <div>
              <div className="px-1 mb-2 text-[10px] font-mono font-bold tracking-wider text-white/35 uppercase">
                APPS & COMMAND
              </div>
              <div className="overflow-y-auto max-h-[calc(100vh-14rem)] pr-1">
                <BranchedMenu
                  items={menuItems}
                  active={activeTab}
                  onSelect={handleSelect}
                  defaultOpen="all"
                  color="#ffffff"
                  accentColor="#c4e22e"
                  lineColor="rgba(255, 255, 255, 0.15)"
                  width={232}
                  rowHeight={38}
                  indent={32}
                />
              </div>
            </div>
          ) : (
            <nav className="flex flex-col items-center gap-2">
              {/* Category Eyebrow like Image 2 */}
              <div className="text-[10px] font-mono font-bold tracking-wider text-white/35 uppercase mb-1">
                APPS
              </div>

              {/* Module Icons Stack with Non-Clipping Floating Tooltips */}
              {iconNavItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <div key={item.id} className="relative group">
                    <button
                      type="button"
                      onClick={() => handleSelect(item.id)}
                      aria-label={item.label}
                      className={`relative flex h-11 w-11 items-center justify-center rounded-2xl transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#c4e22e]/15 text-[#c4e22e] border border-[#c4e22e]/40 shadow-lg shadow-[#c4e22e]/10"
                          : "text-white/60 hover:bg-white/10 hover:text-white border border-transparent"
                      }`}
                    >
                      {item.icon}
                    </button>

                    {/* Floating Tooltip Pill - Outside Sidebar & Never Clipped */}
                    <div className="pointer-events-none absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-2 rounded-xl border border-white/15 bg-[#12141a]/98 backdrop-blur-md px-3.5 py-1.5 shadow-2xl shadow-black z-50 whitespace-nowrap">
                      <span className="font-sans text-xs font-semibold text-white">
                        {item.label}
                      </span>
                      {typeof item.count === "number" && (
                        <span className="rounded-full bg-white/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#c4e22e]">
                          {item.count}
                        </span>
                      )}
                      {/* Left pointer notch */}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-y-[5px] border-y-transparent border-r-[6px] border-r-white/15" />
                    </div>
                  </div>
                );
              })}

              {/* System Separator & Actions */}
              <div className="my-2 h-px w-6 bg-white/10" />

              {/* Website */}
              <div className="relative group">
                <button
                  type="button"
                  onClick={() => handleSelect("website")}
                  aria-label="Lihat Website"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl text-white/60 hover:bg-white/10 hover:text-white transition-all cursor-pointer border border-transparent"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
                <div className="pointer-events-none absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 hidden group-hover:flex items-center rounded-xl border border-white/15 bg-[#12141a]/98 backdrop-blur-md px-3.5 py-1.5 shadow-2xl shadow-black z-50 whitespace-nowrap">
                  <span className="font-sans text-xs font-semibold text-white">
                    Lihat Website ↗
                  </span>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-y-[5px] border-y-transparent border-r-[6px] border-r-white/15" />
                </div>
              </div>

              {/* Logout */}
              <div className="relative group">
                <button
                  type="button"
                  onClick={() => handleSelect("logout")}
                  aria-label="Logout Admin"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl text-rose-400 hover:bg-rose-500/15 hover:text-rose-300 transition-all cursor-pointer border border-transparent"
                >
                  <LogOut className="h-4 w-4" />
                </button>
                <div className="pointer-events-none absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 hidden group-hover:flex items-center rounded-xl border border-rose-500/30 bg-[#12141a]/98 backdrop-blur-md px-3.5 py-1.5 shadow-2xl shadow-black z-50 whitespace-nowrap">
                  <span className="font-sans text-xs font-semibold text-rose-400">
                    Logout Admin
                  </span>
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-y-[5px] border-y-transparent border-r-[6px] border-r-rose-500/30" />
                </div>
              </div>
            </nav>
          )}
        </div>

        {/* Footer */}
        <div
          className={`pt-4 border-t border-white/10 font-mono text-[11px] text-white/40 flex items-center ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!isCollapsed ? (
            <>
              <span>Fadli Portofolio</span>
              <span className="text-white/30">v2.4</span>
            </>
          ) : (
            <span className="relative flex h-2 w-2" title="System Online">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c4e22e] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#c4e22e]" />
            </span>
          )}
        </div>
      </aside>
    </>
  );
}
