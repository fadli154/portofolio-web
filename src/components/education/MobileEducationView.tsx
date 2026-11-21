"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  GraduationCap,
  FolderGit2,
  Cpu,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Layers,
  ArrowRight,
  Hand,
} from "lucide-react";
import type { EducationItem } from "@/data/site";
import CardSwap, { Card, type CardSwapHandle } from "@/components/CardSwap";
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
  const cardSwapRef = useRef<CardSwapHandle | null>(null);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);

  // Responsive dimensions for CardSwap stage based on viewport
  const [dimensions, setDimensions] = useState({
    width: 350,
    height: 350,
    cardDistance: 24,
    verticalDistance: 28,
    depth: 50,
    skewAmount: 2.5,
  });

  useEffect(() => {
    const updateDimensions = () => {
      const w = window.innerWidth;
      if (w < 480) {
        setDimensions({
          width: Math.min(350, w - 32),
          height: 360,
          cardDistance: 20,
          verticalDistance: 26,
          depth: 45,
          skewAmount: 2,
        });
      } else if (w < 768) {
        setDimensions({
          width: Math.min(440, w - 48),
          height: 355,
          cardDistance: 26,
          verticalDistance: 30,
          depth: 55,
          skewAmount: 2.5,
        });
      } else {
        // Tablet (768px - 1023px)
        setDimensions({
          width: 520,
          height: 360,
          cardDistance: 32,
          verticalDistance: 34,
          depth: 65,
          skewAmount: 3,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const handleNext = () => {
    playMechanicalClick(720);
    cardSwapRef.current?.next();
  };

  const handlePrev = () => {
    playMechanicalClick(680);
    cardSwapRef.current?.prev();
  };

  const cardLabels = [
    { title: "S1 UIN Banten", icon: <GraduationCap className="h-3.5 w-3.5 text-cyan-400" /> },
    { title: "Research Lab", icon: <Cpu className="h-3.5 w-3.5 text-[#c4e22e]" /> },
    { title: "SMKN 4 Tangerang", icon: <GraduationCap className="h-3.5 w-3.5 text-emerald-400" /> },
    { title: "Deployments", icon: <FolderGit2 className="h-3.5 w-3.5 text-cyan-400" /> },
  ];

  return (
    <div className="w-full px-4 sm:px-6 py-10 sm:py-14 overflow-hidden">
      {/* 1. Header Section */}
      <div className="text-center max-w-2xl mx-auto mb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#c4e22e]/30 bg-[#c4e22e]/10 px-3 py-1 font-mono text-[11px] font-bold text-[#c4e22e] uppercase tracking-wider mb-2.5">
          <GraduationCap className="h-3.5 w-3.5" />
          <span>{locale === "id" ? "Jejak Akademis & Rekayasa" : "Academic Pedigree & Engineering"}</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          {locale === "id" ? "Pendidikan & Jejak Akademik." : "Education & Academic Journey."}
        </h2>
        <p className="mt-2 font-sans text-xs sm:text-sm text-white/70 leading-relaxed max-w-xl mx-auto">
          {locale === "id"
            ? "Fondasi kejuruan Rekayasa Perangkat Lunak SMKN 4 Tangerang hingga studi S1 Teknik Informatika & Riset Edge AI di UIN SMH Banten."
            : "Progression from Software Engineering at SMKN 4 Tangerang to computer science degree and AI research at UIN SMH Banten."}
        </p>

        {/* 2. Executive HRD Quick Highlights Bar */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3 text-left">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 sm:p-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#c4e22e] font-semibold block">
              Pendidikan Terkini
            </span>
            <span className="font-display text-xs sm:text-sm font-bold text-white block mt-0.5 truncate">
              S1 Teknik Informatika
            </span>
            <span className="font-mono text-[10px] text-white/50 block mt-0.5 truncate">
              UIN SMH Banten · Aktif (2024–Kini)
            </span>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 sm:p-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 font-semibold block">
              Fondasi Kejuruan
            </span>
            <span className="font-display text-xs sm:text-sm font-bold text-white block mt-0.5 truncate">
              Rekayasa Perangkat Lunak
            </span>
            <span className="font-mono text-[10px] text-white/50 block mt-0.5 truncate">
              SMKN 4 Tangerang · Lulus 2024
            </span>
          </div>
        </div>

        {/* 3. Card Selector & Quick Navigation Dock */}
        <div className="mt-5 flex items-center justify-center gap-2 flex-wrap">
          <div className="inline-flex p-1 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
            {cardLabels.map((item, idx) => (
              <button
                key={item.title}
                type="button"
                onClick={() => {
                  playMechanicalClick(650);
                  // Trigger swap until target index is reached
                  cardSwapRef.current?.next();
                }}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl font-mono text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${activeCardIndex === idx
                    ? "bg-[#c4e22e] text-[#111213] shadow-md shadow-[#c4e22e]/20"
                    : "text-white/60 hover:text-white"
                  }`}
              >
                {item.icon}
                <span className="hidden xs:inline">{item.title}</span>
              </button>
            ))}
          </div>

          {/* Prev / Next Stepper Controls */}
          <div className="inline-flex items-center gap-1.5 p-1 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Kartu Sebelumnya"
              className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-mono text-[11px] font-bold text-white/70 px-1.5">
              {activeCardIndex + 1} / 4
            </span>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Kartu Berikutnya"
              className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Swappable 3D Card Stage (CardSwap Powered) */}
      <div className="w-full flex flex-col items-center justify-center relative my-2">
        <div
          className="w-full flex items-center justify-center relative"
          style={{ minHeight: `${dimensions.height + 70}px` }}
        >
          <CardSwap
            ref={cardSwapRef}
            width={dimensions.width}
            height={dimensions.height}
            cardDistance={dimensions.cardDistance}
            verticalDistance={dimensions.verticalDistance}
            depth={dimensions.depth}
            skewAmount={dimensions.skewAmount}
            visibleCards={4}
            autoplay={false}
            pauseOnHover={true}
            draggable={true}
            speed={1.2}
            cardRadius={22}
            theme="dark"
            onChange={(idx) => setActiveCardIndex(idx)}
            className="relative z-10"
          >
            {/* KARTU 1: UIN S1 TEKNIK INFORMATIKA (SPEC-02) */}
            <Card className="border border-white/10 bg-[#0c1219] p-5 sm:p-6 flex flex-col justify-between shadow-2xl rounded-2xl sm:rounded-3xl">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="font-mono text-[11px] font-bold text-cyan-400 flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5" />
                    SPEC-02 // PENDIDIKAN TINGGI
                  </span>
                  <span className="font-mono text-[10px] text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 rounded-full px-2.5 py-0.5 font-bold">
                    2024 – Sekarang · Aktif
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                    UIN Sultan Maulana Hasanuddin
                  </h3>
                  <div className="mt-1 flex items-center gap-2 flex-wrap text-xs text-white/70">
                    <span className="font-semibold text-white/90">Sarjana Komputer (S1) · TI</span>
                    <span className="text-white/30 hidden sm:inline">·</span>
                    <span className="font-mono text-[10px] text-white/50 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Serang, Banten
                    </span>
                  </div>
                </div>

                <div className="mt-3.5 rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs text-white/80">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-400 font-bold block mb-1">
                    Spesialisasi Arsitektur & Riset:
                  </span>
                  <p className="line-clamp-2 text-white/70 text-[11px] leading-relaxed">
                    Prinsip ilmu komputer tingkat lanjut, arsitektur Next.js 15, ekosistem Firebase & Supabase PostgreSQL RLS, dan riset on-device AI.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between mt-3">
                <button
                  type="button"
                  onClick={() => onOpenDetail(uinEdu)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/15 px-3 py-1.5 font-mono text-xs font-bold text-cyan-300 hover:bg-cyan-500/25 transition-all cursor-pointer"
                >
                  <span>Buka Detail Kurikulum</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <span className="font-mono text-[10px] text-white/40">
                  Semester 3
                </span>
              </div>
            </Card>

            {/* KARTU 2: RESEARCH LAB & EDGE AI */}
            <Card className="border border-white/10 bg-[#14121a] p-5 sm:p-6 flex flex-col justify-between shadow-2xl rounded-2xl sm:rounded-3xl">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="font-mono text-[11px] font-bold text-[#c4e22e] flex items-center gap-1.5">
                    <Cpu className="h-3.5 w-3.5" />
                    RESEARCH LAB // EDGE AI & CLOUD
                  </span>
                  <span className="font-mono text-[10px] text-[#c4e22e] bg-[#c4e22e]/10 border border-[#c4e22e]/30 rounded-full px-2.5 py-0.5 font-bold">
                    Next-Gen Stack
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                    Embedded AI & Web Scale
                  </h3>
                  <p className="mt-1 text-xs text-white/60">
                    Computer Vision on-device dan rekayasa cloud terisolasi
                  </p>
                </div>

                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1.5 text-[11px]">
                    <span className="text-white/80">HajjCare AI & Smart Assistant</span>
                    <span className="font-mono text-[10px] text-[#c4e22e]">TFLite / Vision</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1.5 text-[11px]">
                    <span className="text-white/80">Cloud Database (Supabase & Firebase)</span>
                    <span className="font-mono text-[10px] text-cyan-400">100% RLS Policy</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1.5 text-[11px]">
                    <span className="text-white/80">Portfolio Web & CMS Architecture</span>
                    <span className="font-mono text-[10px] text-white/60">Next.js 15 SSG</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between mt-3">
                <button
                  type="button"
                  onClick={() => onOpenDetail(uinEdu)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#c4e22e]/30 bg-[#c4e22e]/10 px-3 py-1.5 font-mono text-xs font-bold text-[#c4e22e] hover:bg-[#c4e22e]/20 transition-all cursor-pointer"
                >
                  <span>Rincian Riset</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <span className="font-mono text-[10px] text-[#c4e22e]">
                  OASE III Finalist
                </span>
              </div>
            </Card>

            {/* KARTU 3: SMKN 4 TANGERANG (SPEC-01) */}
            <Card className="border border-white/10 bg-[#0e1214] p-5 sm:p-6 flex flex-col justify-between shadow-2xl rounded-2xl sm:rounded-3xl">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="font-mono text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5" />
                    SPEC-01 // FASE KEJURUAN
                  </span>
                  <span className="font-mono text-[10px] text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 rounded-full px-2.5 py-0.5 font-bold">
                    2021 – 2024 · Lulus
                  </span>
                </div>

                <div className="mt-3">
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

                <div className="mt-3.5 rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs text-white/80">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400 font-bold block mb-1">
                    Fokus Rekayasa & Kompetensi:
                  </span>
                  <p className="line-clamp-2 text-white/70 text-[11px] leading-relaxed">
                    Fondasi rekayasa perangkat lunak, pemrograman OOP, perancangan basis data relasional MySQL, dan arsitektur REST API.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between mt-3">
                <button
                  type="button"
                  onClick={() => onOpenDetail(smkEdu)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-3 py-1.5 font-mono text-xs font-bold text-emerald-300 hover:bg-emerald-500/25 transition-all cursor-pointer"
                >
                  <span>Buka Detail Kurikulum</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <span className="font-mono text-[10px] text-white/40">
                  Akreditasi A
                </span>
              </div>
            </Card>

            {/* KARTU 4: DEPLOYMENTS & PROYEK KLIEN PEMERINTAH */}
            <Card className="border border-white/10 bg-[#0f1418] p-5 sm:p-6 flex flex-col justify-between shadow-2xl rounded-2xl sm:rounded-3xl">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="font-mono text-[11px] font-bold text-cyan-400 flex items-center gap-1.5">
                    <FolderGit2 className="h-3.5 w-3.5" />
                    DEPLOYMENTS // KLIEN PEMERINTAH
                  </span>
                  <span className="font-mono text-[10px] text-white/50 bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5 font-bold">
                    4 Proyek Produksi
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                    Sistem Nyata & Tata Usaha
                  </h3>
                  <p className="mt-1 text-xs text-white/60">
                    Solusi digital instansi pemerintah dan administrasi sekolah
                  </p>
                </div>

                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1.5 text-[11px]">
                    <span className="text-white/80">Aduan Salah Susu</span>
                    <span className="font-mono text-[10px] text-cyan-400">Client Pemerintah</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1.5 text-[11px]">
                    <span className="text-white/80">Dispress (Disposisi Surat)</span>
                    <span className="font-mono text-[10px] text-white/50">TU SMKN 4 Tangerang</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1.5 text-[11px]">
                    <span className="text-white/80">E-SPP & Project Warga</span>
                    <span className="font-mono text-[10px] text-emerald-400">Magang Kominfo</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between mt-3">
                <button
                  type="button"
                  onClick={() => onOpenDetail(smkEdu)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/15 px-3 py-1.5 font-mono text-xs font-bold text-cyan-300 hover:bg-cyan-500/25 transition-all cursor-pointer"
                >
                  <span>Rincian Produksi</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <span className="font-mono text-[10px] text-white/40">
                  Ready Deploy
                </span>
              </div>
            </Card>
          </CardSwap>
        </div>

        {/* Interaction Hint underneath */}
        <div className="mt-4 flex items-center justify-center gap-2 text-white/40 font-mono text-[11px]">
          <Hand className="h-3.5 w-3.5 text-[#c4e22e] animate-pulse" />
          <span>Ketuk atau geser kartu untuk mengganti kartu selanjutnya</span>
        </div>
      </div>
    </div>
  );
}
