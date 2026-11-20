"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  MapPin,
  ChevronRight,
  GraduationCap,
  FolderGit2,
  Cpu,
} from "lucide-react";
import { usePortfolioState } from "@/lib/i18n/context";
import { EDUCATIONS, type EducationItem } from "@/data/site";
import { playMechanicalClick } from "@/lib/audio/sound-effects";
import DitherVeil from "@/components/DitherVeil";
import CardSwap, { Card, type CardSwapHandle } from "@/components/CardSwap";
import FadeContent from "@/components/FadeContent";
import Scanner from "@/components/Scanner";
import { EducationDetailModal } from "./education/EducationDetailModal";

interface EducationSectionProps {
  educations?: EducationItem[];
}

export function EducationSection({
  educations = EDUCATIONS,
}: EducationSectionProps) {
  const { locale } = usePortfolioState();
  const [selectedEdu, setSelectedEdu] = useState<EducationItem | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const cardSwapRef = useRef<CardSwapHandle | null>(null);
  const activeCardIdxRef = useRef(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const smkEdu = useMemo(() => educations.find((e) => e.id.includes("smk")) || educations[0], [educations]);
  const uinEdu = useMemo(() => educations.find((e) => e.id.includes("uin")) || educations[1] || educations[0], [educations]);

  // Map scroll progress with hysteresis to give generous reading time and prevent boundary jitter
  const getTargetCardIdx = useCallback((p: number, currentIdx: number) => {
    if (currentIdx === 0) {
      if (p >= 0.38) return 1;
      return 0;
    }
    if (currentIdx === 1) {
      if (p >= 0.58) return 2;
      if (p < 0.32) return 0;
      return 1;
    }
    if (currentIdx === 2) {
      if (p >= 0.78) return 3;
      if (p < 0.52) return 1;
      return 2;
    }
    // currentIdx === 3
    if (p < 0.72) return 2;
    return 3;
  }, []);

  // Smooth scroll progress tracking & auto queue sync
  const handleScroll = useCallback(() => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const trackHeight = rect.height;
    const windowH = window.innerHeight;
    const totalDistance = trackHeight - windowH;

    if (totalDistance <= 0) {
      setScrollProgress(1);
      return;
    }

    const rawP = -rect.top / totalDistance;
    const clamped = Math.min(Math.max(rawP, 0), 1);
    setScrollProgress(clamped);

    // Auto-queue: swap card when scrolling past thresholds
    const targetIdx = getTargetCardIdx(clamped, activeCardIdxRef.current);
    if (cardSwapRef.current && targetIdx !== activeCardIdxRef.current) {
      const diff = targetIdx - activeCardIdxRef.current;
      if (diff > 0) {
        for (let i = 0; i < diff; i++) {
          cardSwapRef.current.next();
        }
      } else if (diff < 0) {
        for (let i = 0; i < Math.abs(diff); i++) {
          cardSwapRef.current.prev();
        }
      }
      activeCardIdxRef.current = targetIdx;
    }
  }, [getTargetCardIdx]);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  const openDetail = (edu: EducationItem) => {
    playMechanicalClick(760);
    setSelectedEdu(edu);
  };

  const closeDetail = () => {
    playMechanicalClick(680);
    setSelectedEdu(null);
  };

  const smoothstep = (min: number, max: number, v: number) => {
    const t = Math.min(Math.max((v - min) / (max - min || 1e-6), 0), 1);
    return t * t * (3 - 2 * t);
  };

  // Choreography math:
  const shiftProgress = smoothstep(0.04, 0.22, scrollProgress);
  const cardsProgress = smoothstep(0.08, 0.24, scrollProgress);

  const isDesktop = isMounted && typeof window !== "undefined" && window.innerWidth >= 1024;

  return (
    <section
      id="education"
      style={{ scrollMarginTop: 0 }}
      className="scroll-mt-0 relative w-full bg-[#090a0d] text-white"
    >
      {/* Scroll track (440vh gives ample runway so cards don't rush past) */}
      <div ref={trackRef} className="relative w-full h-[440vh]">
        {/* Sticky stage (pinned to viewport as user scrolls) */}
        <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center pt-16 sm:pt-20 pb-6 overflow-hidden px-4 sm:px-6 lg:px-10">
          {/* Cybernetic Scanner Radar Background from ReactBits */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-30 mix-blend-screen">
            <Scanner
              color1="#06b6d4"
              color2="#c4e22e"
              color3="#a78bfa"
              speed={0.35}
              sweepSpeed={0.18}
              sweepWidth={1.8}
              scanDirection="diagonal"
              opacity={0.65}
              grain={true}
              grainIntensity={0.03}
              glow={0.5}
              vignette={0.4}
              mouseInteraction={false}
            />
          </div>

          {/* Subtle Ambient Glow */}
          <div
            className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#c4e22e]/10 blur-[120px]"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto w-full max-w-[1320px]">
            {/* Section Header (Ultra-Clean, Removed PENDIDIKAN FORMAL Pill) */}
            <div className="mb-4 sm:mb-6 text-center">
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                {locale === "id"
                  ? "Pendidikan & Jejak Akademik."
                  : "Education & Academic Journey."}
              </h2>
              <p className="mx-auto mt-2 max-w-2xl font-sans text-xs sm:text-sm text-white/70">
                {locale === "id"
                  ? "Perjalanan akademis dari Rekayasa Perangkat Lunak di SMKN 4 Tangerang hingga studi S1 Teknik Informatika di UIN SMH Banten."
                  : "Academic progression from Software Engineering at SMKN 4 Tangerang to computer science degree and systems research at UIN SMH Banten."}
              </p>
            </div>

            {/* Asymmetrical 2-Column Responsive Layout */}
            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6 w-full">
              
              {/* KIRI: DitherVeil Visualizer with FadeContent */}
              <div
                className="w-full lg:w-[42%] flex justify-center lg:justify-start z-10 will-change-transform"
                style={{
                  transform: isDesktop
                    ? `translateX(calc(${(1 - shiftProgress) * 69}% + ${(1 - shiftProgress) * 12}px))`
                    : "none",
                }}
              >
                <FadeContent
                  blur={true}
                  duration={1.2}
                  ease="power3.out"
                  initialOpacity={0}
                  trigger="scroll"
                  effect="focus"
                  className="w-full flex justify-center lg:justify-start"
                >
                  <div
                    style={{
                      width: "100%",
                      height: "480px",
                      position: "relative",
                    }}
                    className="overflow-hidden relative bg-transparent border-0 shadow-none [mix-blend-mode:screen]"
                  >
                    <DitherVeil
                      src="https://images.unsplash.com/photo-1737071371043-761e02b1ef95?q=80&w=1400&auto=format&fit=crop"
                      pattern="floyd"
                      pixelSize={2}
                      inkColor="#000000"
                      paperColor="#f4f1ea"
                      revealRadius={200}
                      softness={0.6}
                      linger={1}
                      fit="contain"
                      rimColor="#a78bfa"
                      palette="duotone"
                      levels={2}
                      contrast={1.15}
                      brightness={0}
                      rim={0}
                      reverse={false}
                      wander={false}
                      clickBurst
                      transparent={true}
                    />
                  </div>
                </FadeContent>
              </div>

              {/* KANAN: CardSwap 4-Stack Auto-Queue */}
              <div
                className="w-full lg:w-[58%] flex justify-center lg:justify-end z-20 will-change-[opacity,transform]"
                style={{
                  opacity: isDesktop ? cardsProgress : 1,
                  transform: isDesktop
                    ? `translateX(${(1 - cardsProgress) * 36}px)`
                    : "none",
                  pointerEvents: isDesktop ? (cardsProgress > 0.25 ? "auto" : "none") : "auto",
                }}
              >
                <div className="w-full max-w-[640px] h-[480px] flex items-center justify-center">
                  <CardSwap
                    ref={cardSwapRef}
                    width={550}
                    height={340}
                    cardDistance={32}
                    verticalDistance={36}
                    depth={65}
                    skewAmount={3.5}
                    visibleCards={4}
                    autoplay={false}
                    pauseOnHover={true}
                    draggable={true}
                    speed={1.2}
                    cardRadius={22}
                    theme="dark"
                  >
                    {/* KARTU 1: SMKN 4 TANGERANG (SPEC-01) */}
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
                          <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                            SMK Negeri 4 Tangerang
                          </h3>
                          <div className="mt-1 flex items-center gap-2 flex-wrap text-xs text-white/70">
                            <span>Rekayasa Perangkat Lunak (RPL)</span>
                            <span className="text-white/30 hidden sm:inline">·</span>
                            <span className="font-mono text-[10px] text-white/50 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              Kota Tangerang, Banten
                            </span>
                          </div>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-white/5">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-white/40 block mb-1 font-semibold">
                            Fokus Rekayasa & Kompetensi:
                          </span>
                          <p className="text-xs text-white/80 leading-relaxed">
                            Fondasi rekayasa perangkat lunak, pemrograman OOP, perancangan basis data relasional MySQL, dan arsitektur REST API.
                          </p>
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => openDetail(smkEdu)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black px-3.5 py-1.5 font-mono text-xs font-bold transition-all shadow-sm"
                        >
                          <span>Buka Detail Kurikulum</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                        <span className="font-mono text-[11px] text-white/40">1 / 4</span>
                      </div>
                    </Card>

                    {/* KARTU 2: PROYEK KLIEN SMKN 4 TANGERANG */}
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
                          <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                            Sistem Nyata & Tata Usaha
                          </h3>
                          <p className="text-xs text-white/70 font-sans mt-0.5">
                            Solusi digital instansi pemerintah dan administrasi sekolah
                          </p>
                        </div>

                        <div className="mt-2.5 space-y-1.5 border-t border-white/5 pt-2">
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

                      <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => openDetail(smkEdu)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-white px-3.5 py-1.5 font-mono text-xs font-bold transition-all"
                        >
                          <span>Rincian Sistem</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                        <span className="font-mono text-[11px] text-white/40">2 / 4</span>
                      </div>
                    </Card>

                    {/* KARTU 3: UIN SMH BANTEN (SPEC-02) */}
                    <Card className="border border-white/10 bg-[#0c1219] p-5 sm:p-6 flex flex-col justify-between shadow-2xl rounded-2xl sm:rounded-3xl">
                      <div>
                        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                          <span className="font-mono text-[11px] font-bold text-cyan-400 flex items-center gap-1.5">
                            <GraduationCap className="h-3.5 w-3.5" />
                            SPEC-02 // FASE AKADEMIK TINGGI
                          </span>
                          <span className="font-mono text-[10px] text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 rounded-full px-2.5 py-0.5 font-bold">
                            2024 – Sekarang · Aktif
                          </span>
                        </div>

                        <div className="mt-3">
                          <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                            UIN Sultan Maulana Hasanuddin
                          </h3>
                          <div className="mt-1 flex items-center gap-2 flex-wrap text-xs text-white/70">
                            <span>Sarjana Komputer (S1) · Teknik Informatika</span>
                            <span className="text-white/30 hidden sm:inline">·</span>
                            <span className="font-mono text-[10px] text-white/50 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              Kota Serang, Banten
                            </span>
                          </div>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-white/5">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-white/40 block mb-1 font-semibold">
                            Spesialisasi Arsitektur:
                          </span>
                          <p className="text-xs text-white/80 leading-relaxed">
                            Prinsip ilmu komputer tingkat lanjut, arsitektur Next.js 15, ekosistem Firebase & Supabase PostgreSQL RLS, dan riset on-device AI.
                          </p>
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => openDetail(uinEdu)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black px-3.5 py-1.5 font-mono text-xs font-bold transition-all shadow-sm"
                        >
                          <span>Buka Detail Kurikulum</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                        <span className="font-mono text-[11px] text-white/40">3 / 4</span>
                      </div>
                    </Card>

                    {/* KARTU 4: RISET EDGE AI & ARSITEKTUR CLOUD */}
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
                          <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                            Embedded AI & Web Scale
                          </h3>
                          <p className="text-xs text-white/70 font-sans mt-0.5">
                            Computer Vision on-device dan rekayasa cloud terisolasi
                          </p>
                        </div>

                        <div className="mt-2.5 space-y-1.5 border-t border-white/5 pt-2">
                          <div className="flex items-center justify-between text-xs bg-white/[0.03] border border-white/5 rounded-lg px-3 py-1.5">
                            <span className="font-medium text-white/90">HajjCare AI & Smart Assistant</span>
                            <span className="font-mono text-[10px] text-[#c4e22e]">TFLite / Vision</span>
                          </div>
                          <div className="flex items-center justify-between text-xs bg-white/[0.03] border border-white/5 rounded-lg px-3 py-1.5">
                            <span className="font-medium text-white/90">Cloud Database (Firebase & Supabase)</span>
                            <span className="font-mono text-[10px] text-cyan-300">100% RLS Policy</span>
                          </div>
                          <div className="flex items-center justify-between text-xs bg-white/[0.03] border border-white/5 rounded-lg px-3 py-1.5">
                            <span className="font-medium text-white/90">Portfolio Web & CMS Architecture</span>
                            <span className="font-mono text-[10px] text-white/60">Next.js 15 SSG</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => openDetail(uinEdu)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/15 text-white px-3.5 py-1.5 font-mono text-xs font-bold transition-all"
                        >
                          <span>Rincian Riset</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                        <span className="font-mono text-[11px] text-white/40">4 / 4</span>
                      </div>
                    </Card>
                  </CardSwap>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Minimalist Editorial Detail Modal Dialog */}
      <EducationDetailModal
        edu={selectedEdu}
        locale={locale}
        onClose={closeDetail}
      />
    </section>
  );
}
