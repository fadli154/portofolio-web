"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2, FileText, Calendar, Camera, ArrowUpRight } from "lucide-react";
import { playMechanicalClick } from "@/lib/audio/sound-effects";

export interface FlexCarouselItem {
  id: string | number;
  badge?: string;
  title: string;
  subtitle?: string;
  src?: string;
  status?: string;
  taskTitle?: string;
  taskStatus?: string;
  date?: string;
  raw?: any;
}

export interface FlexCarouselProps {
  items: FlexCarouselItem[];
  autoplay?: boolean;
  interval?: number;
  focusOnClick?: boolean;
  squeeze?: number;
  captions?: boolean;
  captureWheel?: boolean;
  className?: string;
  onSelect?: (item: FlexCarouselItem, index: number) => void;
  onOpenModal?: (item: FlexCarouselItem) => void;
}

export function FlexCarousel({
  items,
  autoplay = false,
  interval = 4500,
  focusOnClick = true,
  squeeze = 0.2,
  captions = true,
  captureWheel = true,
  className = "",
  onSelect,
  onOpenModal,
}: FlexCarouselProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const currentDragRef = useRef(0);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const total = items.length;

  const goTo = useCallback(
    (nextIdx: number) => {
      const clamped = Math.max(0, Math.min(total - 1, nextIdx));
      setActiveIdx(clamped);
      playMechanicalClick(560 + (clamped % 6) * 45);
      if (onSelect && items[clamped]) {
        onSelect(items[clamped]!, clamped);
      }
    },
    [total, onSelect, items]
  );

  const goNext = useCallback(() => {
    goTo((activeIdx + 1) % total);
  }, [activeIdx, total, goTo]);

  const goPrev = useCallback(() => {
    goTo((activeIdx - 1 + total) % total);
  }, [activeIdx, total, goTo]);

  // Autoplay timer
  useEffect(() => {
    if (!autoplay || isPaused || total <= 1) return;
    autoPlayTimerRef.current = setInterval(() => {
      goTo((activeIdx + 1) % total);
    }, interval);
    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [autoplay, isPaused, total, interval, activeIdx, goTo]);

  // Wheel capture: scroll horizontally on vertical wheel when over carousel
  const handleWheel = (e: React.WheelEvent) => {
    if (!captureWheel) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // Already horizontal
    if (Math.abs(e.deltaY) > 25) {
      if (e.deltaY > 0) goNext();
      else goPrev();
    }
  };

  // Pointer drag start
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setIsPaused(true);
    startXRef.current = e.clientX;
    currentDragRef.current = 0;
    setDragOffset(0);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  // Pointer drag move
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - startXRef.current;
    currentDragRef.current = delta;
    setDragOffset(delta * 0.45);
  };

  // Pointer drag end
  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setIsPaused(false);
    const delta = currentDragRef.current;
    setDragOffset(0);

    if (delta < -50) {
      goNext();
    } else if (delta > 50) {
      goPrev();
    }
  };

  // Card click handler
  const handleCardClick = (idx: number, item: FlexCarouselItem) => {
    if (Math.abs(currentDragRef.current) > 10) return; // Prevent click on drag
    if (idx === activeIdx) {
      if (onOpenModal) onOpenModal(item);
    } else if (focusOnClick) {
      goTo(idx);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") goNext();
    if (e.key === "ArrowLeft") goPrev();
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full select-none py-4 ${className}`}
      onWheel={handleWheel}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      tabIndex={0}
      role="region"
      aria-label="Kewirausahaan Flex Carousel"
    >
      {/* Top Controls & Counter Bar */}
      {captions && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 px-1">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--mute)]">
              FOCUS CAROUSEL
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-black/5 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[var(--ink)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c4e22e]" />
              {activeIdx + 1} / {total}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goPrev}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] bg-white text-[var(--ink)] shadow-sm transition-all hover:bg-[var(--ink)] hover:text-white"
              aria-label="Slide sebelumnya"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] bg-white text-[var(--ink)] shadow-sm transition-all hover:bg-[var(--ink)] hover:text-white"
              aria-label="Slide berikutnya"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Flex Carousel Track */}
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          cursor: isDragging ? "grabbing" : "grab",
          transform: `translateX(${dragOffset}px)`,
        }}
        className="flex items-stretch gap-4 overflow-visible pb-4 transition-transform duration-200 ease-out sm:gap-5"
      >
        {items.map((item, idx) => {
          const isFocused = idx === activeIdx;
          const status = item.status || "Hadir";
          const isAttended = status === "Hadir";

          return (
            <div
              key={item.id}
              onClick={() => handleCardClick(idx, item)}
              style={{
                transition: "all 0.45s cubic-bezier(0.25, 1, 0.3, 1)",
                transform: isFocused
                  ? "scale(1.01)"
                  : `scale(${1 - squeeze * 0.4})`,
                opacity: isFocused ? 1 : 0.72,
              }}
              className={`group relative flex cursor-pointer flex-col justify-between rounded-[28px] border p-6 transition-all duration-300 ${
                isFocused
                  ? "min-w-[340px] flex-[2.6] border-[var(--ink)] bg-white shadow-xl sm:min-w-[420px]"
                  : "min-w-[240px] flex-[1] border-[var(--line)] bg-white/70 hover:border-black/30 hover:bg-white hover:opacity-90 sm:min-w-[280px]"
              }`}
            >
              <div>
                {/* Header Row: Badge & Status */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`rounded-full px-3 py-1 font-mono text-[11px] font-semibold transition-colors ${
                      isFocused
                        ? "bg-[var(--ink)] text-[var(--cream)]"
                        : "bg-black/10 text-[var(--ink)] group-hover:bg-[var(--ink)] group-hover:text-white"
                    }`}
                  >
                    {item.badge || `SESI 0${idx + 1}`}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium ${
                      isAttended
                        ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-800"
                        : "border-amber-500/30 bg-amber-500/15 text-amber-800"
                    }`}
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Absen: {status}</span>
                  </span>
                </div>

                {/* Topic Title */}
                <h3
                  className={`mt-4 font-medium tracking-tight transition-all ${
                    isFocused
                      ? "text-xl text-[var(--ink)] md:text-2xl"
                      : "text-base text-[var(--ink)]/80 line-clamp-2 md:text-lg"
                  }`}
                >
                  {item.title}
                </h3>

                {/* Subtitle / Description */}
                <p
                  className={`mt-2 text-xs leading-relaxed text-[var(--mute)] transition-all ${
                    isFocused ? "line-clamp-3 md:text-sm" : "line-clamp-2"
                  }`}
                >
                  {item.subtitle}
                </p>

                {/* Proof Photo Thumbnail or Camera Placeholder */}
                <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bone)]">
                  {item.src ? (
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.src}
                        alt={`Bukti kehadiran ${item.badge}`}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-black/60 px-2 py-0.5 font-mono text-[10px] text-white backdrop-blur-sm">
                        <Camera className="h-2.5 w-2.5 text-[#c4e22e]" />
                        <span>Foto Kehadiran</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-1.5 p-4 text-center">
                      <Camera className="h-6 w-6 text-[var(--mute)]" />
                      <span className="font-mono text-[11px] text-[var(--mute)]">
                        Kehadiran Tercatat di Sistem
                      </span>
                      {item.date && (
                        <span className="font-mono text-[10px] text-[var(--mute)]/70">
                          {item.date}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Meta & Task Strip */}
              <div className="mt-5 border-t border-[var(--line)] pt-4">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-[var(--mute)]">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{item.date || `Minggu ${idx + 1} · 2026`}</span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold ${
                      item.taskStatus === "Selesai"
                        ? "bg-emerald-500/15 text-emerald-800"
                        : "bg-amber-500/15 text-amber-800"
                    }`}
                  >
                    <FileText className="h-3 w-3" />
                    <span>Tugas: {item.taskStatus || "Selesai"}</span>
                  </span>
                </div>

                {/* Expanded Action CTA on Focus */}
                {isFocused && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenModal) onOpenModal(item);
                    }}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--ink)] py-2.5 px-4 font-mono text-xs font-semibold text-[var(--cream)] shadow-sm transition-all hover:bg-[var(--violet)]"
                  >
                    <span>Buka Rincian Pertemuan &amp; Bukti Tugas</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Dots Indicator */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {items.map((_, dotIdx) => (
          <button
            key={dotIdx}
            type="button"
            onClick={() => goTo(dotIdx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              dotIdx === activeIdx
                ? "w-8 bg-[var(--ink)]"
                : "w-2 bg-black/20 hover:bg-black/40"
            }`}
            aria-label={`Pindah ke slide ${dotIdx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default FlexCarousel;

