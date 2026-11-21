"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  FolderGit2,
  Cpu,
  MapPin,
  ChevronRight,
  Sparkles,
  Calendar,
  Layers,
  Award,
} from "lucide-react";
import type { EducationItem } from "@/data/site";
import { playMechanicalClick } from "@/lib/audio/sound-effects";

interface MobileEducationViewProps {
  smkEdu: EducationItem;
  uinEdu: EducationItem;
  locale: "id" | "en";
  onOpenDetail: (edu: EducationItem) => void;
}

export function MobileEducationView({
  smkEdu,
  uinEdu,
  locale,
  onOpenDetail,
}: MobileEducationViewProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "uin" | "smk">("all");

  const handleFilterChange = (filter: "all" | "uin" | "smk") => {
    playMechanicalClick(650);
    setActiveFilter(filter);
  };

  return (
    <div className="w-full px-4 sm:px-6 py-12 sm:py-16">
      {/* 1. Header Section (Optimized for Mobile/Tablet Scanning) */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#c4e22e]/30 bg-[#c4e22e]/10 px-3 py-1 font-mono text-[11px] font-bold text-[#c4e22e] uppercase tracking-wider mb-3">
          <GraduationCap className="h-3.5 w-3.5" />
          <span>{locale === "id" ? "Jejak Akademis & Rekayasa" : "Academic Pedigree & Engineering"}</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          {locale === "id" ? "Pendidikan & Jejak Akademik." : "Education & Academic Journey."}
        </h2>
        <p className="mt-2.5 font-sans text-xs sm:text-sm text-white/70 leading-relaxed">
          {locale === "id"
            ? "Perjalanan akademis dari Rekayasa Perangkat Lunak di SMKN 4 Tangerang hingga studi S1 Teknik Informatika & Riset Edge AI di UIN SMH Banten."
            : "Academic progression from Software Engineering at SMKN 4 Tangerang to computer science degree and systems research at UIN SMH Banten."}
        </p>

        {/* 2. Executive HRD Quick Highlights Bar */}
        <div className="mt-5 grid grid-cols-2 gap-2 sm:gap-3 text-left">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:p-3.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#c4e22e] font-semibold block">
              Pendidikan Terkini
            </span>
            <span className="font-display text-sm font-bold text-white block mt-0.5">
              S1 Teknik Informatika
            </span>
            <span className="font-mono text-[10px] text-white/50 block mt-0.5">
              UIN SMH Banten · Aktif (2024–Kini)
            </span>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:p-3.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 font-semibold block">
              Fondasi Kejuruan
            </span>
            <span className="font-display text-sm font-bold text-white block mt-0.5">
              Rekayasa Perangkat Lunak
            </span>
            <span className="font-mono text-[10px] text-white/50 block mt-0.5">
              SMKN 4 Tangerang · Lulus 2024
            </span>
          </div>
        </div>

        {/* 3. Segmented Filter Tabs for Quick HRD Navigation */}
        <div className="mt-6 inline-flex p-1 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
          <button
            type="button"
            onClick={() => handleFilterChange("all")}
            className={`px-3 sm:px-4 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
              activeFilter === "all"
                ? "bg-[#c4e22e] text-[#111213] shadow-md shadow-[#c4e22e]/20"
                : "text-white/60 hover:text-white"
            }`}
          >
            Semua (4)
          </button>
          <button
            type="button"
            onClick={() => handleFilterChange("uin")}
            className={`px-3 sm:px-4 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
              activeFilter === "uin"
                ? "bg-[#c4e22e] text-[#111213] shadow-md shadow-[#c4e22e]/20"
                : "text-white/60 hover:text-white"
            }`}
          >
            🎓 S1 UIN Banten
          </button>
          <button
            type="button"
            onClick={() => handleFilterChange("smk")}
            className={`px-3 sm:px-4 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
              activeFilter === "smk"
                ? "bg-[#c4e22e] text-[#111213] shadow-md shadow-[#c4e22e]/20"
                : "text-white/60 hover:text-white"
            }`}
          >
            🏫 SMKN 4 Tangerang
          </button>
        </div>
      </div>

      {/* 4. Responsive Card Grid (1 col phone, 2 col tablet, 100% visible, zero clipping) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
        
        {/* KARTU 1: UIN S1 TEKNIK INFORMATIKA */}
        {(activeFilter === "all" || activeFilter === "uin") && (
          <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0c1219] p-5 sm:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-[11px] font-bold text-cyan-400 flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4" />
                  SPEC-02 // PENDIDIKAN TINGGI
                </span>
                <span className="font-mono text-[10px] text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 rounded-full px-2.5 py-0.5 font-bold">
                  2024 – Sekarang · Aktif
                </span>
              </div>

              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                  UIN Sultan Maulana Hasanuddin
                </h3>
                <div className="mt-1 flex items-center gap-2 flex-wrap text-xs text-white/70">
                  <span className="font-semibold text-white/90">Sarjana Komputer (S1) · Teknik Informatika</span>
                  <span className="text-white/30 hidden sm:inline">·</span>
                  <span className="font-mono text-[10px] text-white/50 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Kota Serang, Banten
                  </span>
                </div>
              </div>

              <div className="pt-2.5 border-t border-white/5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-white/40 block mb-1 font-semibold">
                  Spesialisasi Arsitektur & Riset:
                </span>
                <p className="text-xs text-white/80 leading-relaxed">
                  Prinsip ilmu komputer tingkat lanjut, arsitektur Next.js 15, ekosistem Firebase & Supabase PostgreSQL RLS, dan riset on-device AI.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onOpenDetail(uinEdu)}
                className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 font-mono text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <span>Buka Detail Kurikulum</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
              <span className="font-mono text-[10px] text-cyan-400/80 bg-cyan-500/10 px-2 py-0.5 rounded">
                Semester 3
              </span>
            </div>
          </div>
        )}

        {/* KARTU 2: RESEARCH LAB // EDGE AI & CLOUD */}
        {(activeFilter === "all" || activeFilter === "uin") && (
          <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-[#14121a] p-5 sm:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-[11px] font-bold text-[#c4e22e] flex items-center gap-1.5">
                  <Cpu className="h-4 w-4" />
                  RESEARCH LAB // EDGE AI & CLOUD
                </span>
                <span className="font-mono text-[10px] text-[#c4e22e] bg-[#c4e22e]/10 border border-[#c4e22e]/30 rounded-full px-2.5 py-0.5 font-bold">
                  Next-Gen Stack
                </span>
              </div>

              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                  Embedded AI & Web Scale
                </h3>
                <p className="text-xs text-white/70 font-sans mt-0.5">
                  Computer Vision on-device dan rekayasa cloud terisolasi
                </p>
              </div>

              <div className="space-y-1.5 border-t border-white/5 pt-2.5">
                <div className="flex items-center justify-between text-xs bg-white/[0.03] border border-white/5 rounded-lg px-3 py-1.5">
                  <span className="font-medium text-white/90">HajjCare AI & Smart Assistant</span>
                  <span className="font-mono text-[10px] text-[#c4e22e]">TFLite / Vision</span>
                </div>
                <div className="flex items-center justify-between text-xs bg-white/[0.03] border border-white/5 rounded-lg px-3 py-1.5">
                  <span className="font-medium text-white/90">Cloud Database (Supabase & Firebase)</span>
                  <span className="font-mono text-[10px] text-cyan-300">100% RLS Policy</span>
                </div>
                <div className="flex items-center justify-between text-xs bg-white/[0.03] border border-white/5 rounded-lg px-3 py-1.5">
                  <span className="font-medium text-white/90">Portfolio Web & CMS Architecture</span>
                  <span className="font-mono text-[10px] text-white/60">Next.js 15 SSG</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onOpenDetail(uinEdu)}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-white px-4 py-2 font-mono text-xs font-bold transition-all cursor-pointer"
              >
                <span>Rincian Riset</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
              <span className="font-mono text-[10px] text-[#c4e22e] bg-[#c4e22e]/10 px-2 py-0.5 rounded">
                OASE III Finalist
              </span>
            </div>
          </div>
        )}

        {/* KARTU 3: SMKN 4 TANGERANG (RPL) */}
        {(activeFilter === "all" || activeFilter === "smk") && (
          <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0e1214] p-5 sm:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4" />
                  SPEC-01 // FASE KEJURUAN
                </span>
                <span className="font-mono text-[10px] text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 rounded-full px-2.5 py-0.5 font-bold">
                  2021 – 2024 · Lulus
                </span>
              </div>

              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                  SMK Negeri 4 Tangerang
                </h3>
                <div className="mt-1 flex items-center gap-2 flex-wrap text-xs text-white/70">
                  <span className="font-semibold text-white/90">Rekayasa Perangkat Lunak (RPL)</span>
                  <span className="text-white/30 hidden sm:inline">·</span>
                  <span className="font-mono text-[10px] text-white/50 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Kota Tangerang, Banten
                  </span>
                </div>
              </div>

              <div className="pt-2.5 border-t border-white/5">
                <span className="font-mono text-[10px] uppercase tracking-wider text-white/40 block mb-1 font-semibold">
                  Fokus Rekayasa & Kompetensi:
                </span>
                <p className="text-xs text-white/80 leading-relaxed">
                  Fondasi rekayasa perangkat lunak, pemrograman OOP, perancangan basis data relasional MySQL, dan arsitektur REST API.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onOpenDetail(smkEdu)}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 font-mono text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <span>Buka Detail Kurikulum</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
              <span className="font-mono text-[10px] text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded">
                Nilai Uji Kompetensi A
              </span>
            </div>
          </div>
        )}

        {/* KARTU 4: DEPLOYMENTS // KLIEN PEMERINTAH */}
        {(activeFilter === "all" || activeFilter === "smk") && (
          <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0f1418] p-5 sm:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-[11px] font-bold text-cyan-400 flex items-center gap-1.5">
                  <FolderGit2 className="h-4 w-4" />
                  DEPLOYMENTS // KLIEN PEMERINTAH
                </span>
                <span className="font-mono text-[10px] text-white/50 bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5 font-bold">
                  4 Proyek Produksi
                </span>
              </div>

              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                  Sistem Nyata & Tata Usaha
                </h3>
                <p className="text-xs text-white/70 font-sans mt-0.5">
                  Solusi digital instansi pemerintah dan administrasi sekolah
                </p>
              </div>

              <div className="space-y-1.5 border-t border-white/5 pt-2.5">
                <div className="flex items-center justify-between text-xs bg-white/[0.03] border border-white/5 rounded-lg px-3 py-1.5">
                  <span className="font-medium text-white/90">Aduan Salah Susu</span>
                  <span className="font-mono text-[10px] text-cyan-300">Client Pemerintah</span>
                </div>
                <div className="flex items-center justify-between text-xs bg-white/[0.03] border border-white/5 rounded-lg px-3 py-1.5">
                  <span className="font-medium text-white/90">Dispress (Disposisi Surat)</span>
                  <span className="font-mono text-[10px] text-white/60">TU SMKN 4 Tangerang</span>
                </div>
                <div className="flex items-center justify-between text-xs bg-white/[0.03] border border-white/5 rounded-lg px-3 py-1.5">
                  <span className="font-medium text-white/90">E-SPP & Project Warga</span>
                  <span className="font-mono text-[10px] text-emerald-300">Magang Kominfo</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onOpenDetail(smkEdu)}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-white px-4 py-2 font-mono text-xs font-bold transition-all cursor-pointer"
              >
                <span>Rincian Sistem</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
              <span className="font-mono text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                Full Production
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
