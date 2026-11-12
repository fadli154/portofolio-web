"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Briefcase,
  Code2,
  FolderOpen,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  X,
  Layers,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  FileText,
  RotateCcw,
} from "lucide-react";
import { BlurText } from "@/components/reactbits/BlurText";
import FadeContent from "@/components/reactbits/FadeContent";
import CircularGalleryWrapper, { type GalleryItem } from "@/components/reactbits/CircularGalleryWrapper";
import Folder, { type FolderItem } from "@/components/reactbits/Folder";
import {
  EXPERIENCE_FOLDERS,
  type ExperienceFolderData,
  type ExperienceFolderPaper,
} from "@/data/experience-folders";
import { playMechanicalClick } from "@/lib/audio/sound-effects";

interface ExperienceFoldersSectionProps {
  locale?: "id" | "en";
}

export function ExperienceFoldersSection({
  locale = "id",
}: ExperienceFoldersSectionProps) {
  // View mode: 'circular' (3D WebGL Cylinder) or 'deck' (Direct Interactive 3D Folder)
  const [viewMode, setViewMode] = useState<"circular" | "deck">("circular");

  // Active circular index
  const [activeCircularIndex, setActiveCircularIndex] = useState(0);

  // Selected folder for modal inspection
  const [selectedFolder, setSelectedFolder] = useState<ExperienceFolderData | null>(null);

  // Active folder index for direct deck mode
  const [activeDeckIndex, setActiveDeckIndex] = useState(0);

  // Active paper index being inspected inside the folder
  const [activePaperIndex, setActivePaperIndex] = useState(0);

  // Horizontal Pills Tab Slider ref & scroll progress
  const tabsRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDraggingTabs, setIsDraggingTabs] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragScrollLeft, setDragScrollLeft] = useState(0);

  // Responsive screen width tracking
  const [screenWidth, setScreenWidth] = useState(1280);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = screenWidth < 768;

  // Track scroll position of the horizontal pills row
  const updateScrollProgress = useCallback(() => {
    const el = tabsRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setScrollProgress(0);
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    const progress = el.scrollLeft / maxScroll;
    setScrollProgress(Math.min(1, Math.max(0, progress)));
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    updateScrollProgress();
    el.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress);
    return () => {
      el.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", updateScrollProgress);
    };
  }, [updateScrollProgress, viewMode]);

  // Smoothly center the active folder pill into view whenever activeDeckIndex changes
  useEffect(() => {
    if (viewMode !== "deck") return;
    const el = tabsRef.current;
    if (!el) return;
    const activeBtn = el.children[activeDeckIndex] as HTMLElement;
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeDeckIndex, viewMode]);

  const scrollTabs = (direction: "left" | "right") => {
    const el = tabsRef.current;
    if (!el) return;
    const scrollAmount = Math.max(220, el.clientWidth * 0.45);
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
    playMechanicalClick(560);
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = tabsRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    const rect = track.getBoundingClientRect();
    const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const maxScroll = el.scrollWidth - el.clientWidth;
    el.scrollTo({
      left: clickRatio * maxScroll,
      behavior: "smooth",
    });
    playMechanicalClick(600);
  };

  const handleMouseDownTabs = (e: React.MouseEvent) => {
    const el = tabsRef.current;
    if (!el) return;
    setIsDraggingTabs(true);
    setDragStartX(e.pageX - el.offsetLeft);
    setDragScrollLeft(el.scrollLeft);
  };

  const handleMouseMoveTabs = (e: React.MouseEvent) => {
    if (!isDraggingTabs) return;
    e.preventDefault();
    const el = tabsRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - dragStartX) * 1.4;
    el.scrollLeft = dragScrollLeft - walk;
  };

  const handleMouseUpTabs = () => {
    setIsDraggingTabs(false);
  };

  const handleGalleryActiveChange = useCallback((idx: number) => {
    const normalized =
      ((idx % EXPERIENCE_FOLDERS.length) + EXPERIENCE_FOLDERS.length) %
      EXPERIENCE_FOLDERS.length;
    setActiveCircularIndex(normalized);
  }, []);

  const handleGalleryItemClick = useCallback((item: GalleryItem, index: number) => {
    const found =
      EXPERIENCE_FOLDERS[index % EXPERIENCE_FOLDERS.length] ||
      EXPERIENCE_FOLDERS.find(
        (f) =>
          f.tab === item.text ||
          f.title === item.description ||
          f.slug === item.text
      );
    if (found) {
      setSelectedFolder(found);
      setActivePaperIndex(0);
      playMechanicalClick(720);
    }
  }, []);

  // Gallery items for CircularGallery
  const galleryItems: GalleryItem[] = useMemo(() => {
    return EXPERIENCE_FOLDERS.map((f) => ({
      image: f.image,
      text: f.tab,
      description: f.title,
      alt: `${f.tab} - ${f.title} (${f.subtitle})`,
    }));
  }, []);

  // Keyboard navigation (Esc to close, Left/Right to flip)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedFolder(null);
      } else if (e.key === "ArrowLeft") {
        if (selectedFolder) {
          const currIdx = EXPERIENCE_FOLDERS.findIndex((f) => f.id === selectedFolder.id);
          const prevIdx = (currIdx - 1 + EXPERIENCE_FOLDERS.length) % EXPERIENCE_FOLDERS.length;
          setSelectedFolder(EXPERIENCE_FOLDERS[prevIdx]);
          setActivePaperIndex(0);
          playMechanicalClick(600);
        }
      } else if (e.key === "ArrowRight") {
        if (selectedFolder) {
          const currIdx = EXPERIENCE_FOLDERS.findIndex((f) => f.id === selectedFolder.id);
          const nextIdx = (currIdx + 1) % EXPERIENCE_FOLDERS.length;
          setSelectedFolder(EXPERIENCE_FOLDERS[nextIdx]);
          setActivePaperIndex(0);
          playMechanicalClick(680);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedFolder]);

  // Transform folder papers into ReactBits Folder items
  const buildFolderItems = useCallback((folder: ExperienceFolderData): FolderItem[] => {
    return folder.papers.map((paper, idx) => ({
      title: paper.code,
      description: paper.title,
      content: (
        <div className="flex h-full w-full flex-col justify-between bg-white p-5 text-[#111827] select-none">
          <div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
              <span className="rounded-full bg-black px-2.5 py-0.5 font-mono text-[9px] font-bold text-white">
                {paper.code}
              </span>
              <span className="font-mono text-[9px] font-semibold text-gray-500">
                HAL 0{idx + 1}/0{folder.papers.length}
              </span>
            </div>

            <h4 className="mt-3 text-sm font-bold leading-snug tracking-tight text-gray-900">
              {paper.title}
            </h4>

            <p className="mt-2 text-xs leading-relaxed text-gray-600">
              {paper.desc}
            </p>
          </div>

          <div className="border-t border-gray-100 pt-3">
            <div className="flex items-center justify-between font-mono text-[9px] text-gray-400">
              <span>{folder.tab}</span>
              <span className="font-bold text-[var(--violet)]">KLIK LIHAT DETAIL</span>
            </div>
          </div>
        </div>
      ),
    }));
  }, []);

  const currentFolderForDeck = EXPERIENCE_FOLDERS[activeDeckIndex];

  return (
    <section id="work" className="scroll-mt-28 overflow-hidden bg-white pb-12 md:pb-20 dark:bg-[#0a0a0c]">
      <FadeContent blur={6} duration={0.7} ease="power2.out" threshold={0.08} initialOpacity={0} once={true}>
        <div className="keffi-wrap">
          {/* Section Header */}
        <div className="sec-head dark:border-white/10 pt-14">
          <div>
            <div className="flex mb-10 items-center gap-2 font-mono text-xs font-semibold tracking-wider text-[var(--mute)] dark:text-gray-300">
              <span>
                {locale === "id"
                  ? "REKAM JEJAK & KARYA UNGGULAN · GALERI 3D"
                  : "SELECTED WORK & EXPERIENCE · 3D GALLERY"}
              </span>
            </div>
            <h2 className="sec-title mt-3 text-[var(--ink)] dark:text-[#f5f5f2]">
              <BlurText
                text={
                  locale === "id"
                    ? "Pengalaman & Studi Kasus."
                    : "Experience & Case Studies."
                }
              />
            </h2>
          </div>

          {/* Controls: View Mode Switcher & Archive Link */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-[var(--line)] bg-[#f5f5f2] p-1 dark:border-white/15 dark:bg-black/60">
              <button
                type="button"
                onClick={() => {
                  setViewMode("circular");
                  playMechanicalClick(560);
                }}
                className={`inline-flex min-h-[34px] items-center rounded-full px-3.5 py-1.5 font-mono text-xs font-semibold transition-all ${viewMode === "circular"
                  ? "bg-white text-[var(--ink)] shadow-xs dark:bg-[#1f2024] dark:text-white"
                  : "text-[var(--mute)] hover:text-[var(--ink)] dark:text-gray-400 dark:hover:text-white"
                  }`}
              >
                <span>{locale === "id" ? "Galeri Melingkar" : "Circular Gallery"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setViewMode("deck");
                  playMechanicalClick(680);
                }}
                className={`inline-flex min-h-[34px] items-center rounded-full px-3.5 py-1.5 font-mono text-xs font-semibold transition-all ${viewMode === "deck"
                  ? "bg-white text-[var(--ink)] shadow-xs dark:bg-[#1f2024] dark:text-white"
                  : "text-[var(--mute)] hover:text-[var(--ink)] dark:text-gray-400 dark:hover:text-white"
                  }`}
              >
                <span>{locale === "id" ? "Meja Berkas 3D" : "3D Folder Deck"}</span>
              </button>
            </div>

            <Link href="/projects" className="keffi-pill-outline dark:border-white/20 dark:text-white dark:hover:bg-white/10">
              <span>{locale === "id" ? "Lihat Arsip Lengkap" : "View Full Archive"}</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
        </div>
      </FadeContent>

      {/* ===================================================================
          VIEW MODE A: 3D CIRCULAR GALLERY (WebGL Curved Cylinder) - FULL BLEED
          =================================================================== */}
      <FadeContent blur={false} duration={0.7} ease="power2.out" threshold={0.08} initialOpacity={0} once={true}>
      {viewMode === "circular" && (
        <div className="relative mt-6 h-[340px] w-full overflow-hidden sm:h-[440px] md:mt-8 md:h-[520px]">
          {/* Circular Gallery WebGL Component */}
          <CircularGalleryWrapper
            items={galleryItems}
            bend={2.2}
            textColor="var(--ink)"
            itemSize={1.14}
            itemAspect={1.436}
            gap={0.24}
            borderRadius={0}
            shadow={0}
            fadeEdges={0}
            scrollSpeed={2.2}
            scrollEase={0.06}
            showTitles={false}
            snap={true}
            autoScroll={0}
            openOnClick={false}
            onActiveChange={handleGalleryActiveChange}
            onItemClick={handleGalleryItemClick}
          />

          {/* Bottom Folder Quick Launcher */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30">
            <div className="keffi-wrap flex justify-end p-4 md:p-6">
              <div className="pointer-events-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const target =
                      EXPERIENCE_FOLDERS[activeCircularIndex] || EXPERIENCE_FOLDERS[0];
                    setSelectedFolder(target);
                    setActivePaperIndex(0);
                    playMechanicalClick(640);
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-[#c4e22e] px-4 py-2 md:px-5 md:py-2.5 font-mono text-[11px] md:text-xs font-bold text-[#111213] shadow-xs transition-transform hover:scale-105 active:scale-95"
                >
                  <FolderOpen className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span>
                    {locale === "id"
                      ? `Buka: ${EXPERIENCE_FOLDERS[activeCircularIndex]?.tab || "Folder"}`
                      : `Open: ${EXPERIENCE_FOLDERS[activeCircularIndex]?.tab || "Folder"}`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          VIEW MODE B: DIRECT INTERACTIVE 3D FOLDER DECK
          =================================================================== */}
      {viewMode === "deck" && (
        <div className="keffi-wrap">
          <div className="mt-10 overflow-hidden rounded-[32px] border border-[var(--line)] bg-[#f5f5f2]/80 p-6 md:p-10 dark:border-white/10 dark:bg-[#121316]">
            {/* Folder Tabs Navigation with Drag-to-Scroll */}
            <div
              ref={tabsRef}
              onMouseDown={handleMouseDownTabs}
              onMouseMove={handleMouseMoveTabs}
              onMouseUp={handleMouseUpTabs}
              onMouseLeave={handleMouseUpTabs}
              className={`flex max-w-full overflow-x-auto gap-2 pb-3.5 no-scrollbar select-none scroll-smooth ${isDraggingTabs ? "cursor-grabbing" : "cursor-grab"
                }`}
            >
              {EXPERIENCE_FOLDERS.map((f, idx) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    setActiveDeckIndex(idx);
                    setActivePaperIndex(0);
                    playMechanicalClick(580 + idx * 25);
                  }}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-semibold whitespace-nowrap transition-all ${activeDeckIndex === idx
                    ? "bg-[#c4e22e] text-[#111213] shadow-xs"
                    : "border border-[var(--line)] bg-white text-[var(--ink)] hover:bg-gray-100 dark:border-white/10 dark:bg-[#1a1b1e] dark:text-gray-300 dark:hover:bg-[#25272c]"
                    }`}
                >
                  <span className="opacity-70">0{idx + 1}</span>
                  <span>{f.tab}</span>
                </button>
              ))}
            </div>

            {/* Micro-Slider Bar: Clean & Elegant Pill Navigation Slider Track */}
            <div className="flex items-center justify-between gap-3 border-t border-[var(--line)]/70 pt-3 dark:border-white/10">
              {/* Previous & Next Slide Chevrons */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => scrollTabs("left")}
                  disabled={!canScrollLeft}
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full border transition-all ${canScrollLeft
                    ? "border-[var(--line)] bg-white text-[var(--ink)] shadow-xs hover:border-[var(--violet)] hover:text-[var(--violet)] dark:border-white/15 dark:bg-[#1a1b1e] dark:text-white"
                    : "cursor-not-allowed border-transparent opacity-25 text-[var(--mute)]"
                    }`}
                  aria-label="Geser tab pill ke kiri"
                  title="Geser tab pill ke kiri"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollTabs("right")}
                  disabled={!canScrollRight}
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full border transition-all ${canScrollRight
                    ? "border-[var(--line)] bg-white text-[var(--ink)] shadow-xs hover:border-[var(--violet)] hover:text-[var(--violet)] dark:border-white/15 dark:bg-[#1a1b1e] dark:text-white"
                    : "cursor-not-allowed border-transparent opacity-25 text-[var(--mute)]"
                    }`}
                  aria-label="Geser tab pill ke kanan"
                  title="Geser tab pill ke kanan"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Interactive Micro-Slider Track & Draggable Thumb */}
              <div
                ref={trackRef}
                onClick={handleTrackClick}
                className="group relative flex-1 h-3 cursor-pointer flex items-center"
                title="Klik atau geser slider untuk navigasi tab proyek"
              >
                {/* Background Slider Track Line */}
                <div className="h-1.5 w-full rounded-full bg-black/10 transition-all group-hover:h-2 dark:bg-white/15" />

                {/* Animated Slider Capsule Dot / Thumb */}
                <div
                  className="absolute h-3 w-10 -translate-x-1/2 rounded-full bg-[#c4e22e] border border-[#111213]/20 shadow-sm transition-all duration-100 group-hover:h-3.5 group-hover:w-12 dark:border-transparent"
                  style={{
                    left: `${Math.max(4, Math.min(96, scrollProgress * 100))}%`,
                  }}
                />
              </div>

              {/* Counter / Interactive Legend */}
              <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-[var(--mute)] dark:text-gray-400 shrink-0 select-none">
                <span className="font-semibold text-[var(--ink)] dark:text-white">
                  0{activeDeckIndex + 1} / 0{EXPERIENCE_FOLDERS.length}
                </span>
                <span className="hidden md:inline text-[10px] opacity-70">
                  · {locale === "id" ? "Slider Navigasi Tab" : "Pill Slider Track"}
                </span>
              </div>
            </div>

            {/* Direct Folder Stage & Editorial Split */}
            <div className="mt-8 grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
              {/* Left Column: Interactive 3D Folder */}
              <div className="flex min-h-[380px] md:min-h-[460px] items-center justify-center rounded-2xl bg-white/40 p-4 md:p-6 dark:bg-black/40 lg:col-span-6">
                <Folder
                  key={currentFolderForDeck.id}
                  label={currentFolderForDeck.tab}
                  color={currentFolderForDeck.color}
                  mode="flap"
                  variant="solid"
                  size={isMobile ? 1.05 : 1.35}
                  defaultOpen={true}
                  draggable={true}
                  zoomOnClick={true}
                  intro={false}
                  layout="spread"
                  items={buildFolderItems(currentFolderForDeck)}
                  onItemClick={(_, pIdx) => {
                    setActivePaperIndex(pIdx);
                    playMechanicalClick(720);
                  }}
                />
              </div>

              {/* Right Column: Case Study Breakdown & Documentation */}
              <div className="space-y-6 lg:col-span-6">
                <div className="flex items-center justify-between border-b border-[var(--line)] pb-3 dark:border-white/10">
                  <span className="rounded-full bg-[#c4e22e] px-3 py-1 font-mono text-xs font-bold uppercase text-[#111213]">
                    {currentFolderForDeck.badge}
                  </span>
                  <span className="font-mono text-xs text-[var(--mute)] dark:text-gray-400">
                    {currentFolderForDeck.year}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-[var(--ink)] md:text-3xl dark:text-white">
                    {currentFolderForDeck.title}
                  </h3>
                  <p className="mt-1 font-mono text-sm text-[var(--mute)] dark:text-gray-400">
                    {currentFolderForDeck.subtitle}
                  </p>
                </div>

                <p className="text-sm leading-relaxed text-[var(--ink)] md:text-base dark:text-gray-300">
                  {currentFolderForDeck.summary}
                </p>

                {/* Paper Selector Tabs */}
                <div className="space-y-3 rounded-2xl border border-[var(--line)] bg-white p-5 dark:border-white/10 dark:bg-[#16171a]">
                  <div className="flex items-center justify-between font-mono text-xs font-semibold text-[var(--mute)] dark:text-gray-400">
                    <span>LEMBAR DOKUMEN DALAM FOLDER:</span>
                    <span>
                      0{activePaperIndex + 1} / 0{currentFolderForDeck.papers.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {currentFolderForDeck.papers.map((p, pIdx) => (
                      <button
                        key={p.code}
                        type="button"
                        onClick={() => {
                          setActivePaperIndex(pIdx);
                          playMechanicalClick(650);
                        }}
                        className={`flex flex-col items-start rounded-xl p-3 text-left transition-all ${activePaperIndex === pIdx
                          ? "border border-[#9ab818] bg-[#c4e22e]/25 text-[#111213] dark:border-[#c4e22e] dark:bg-[#c4e22e]/20 dark:text-[#c4e22e]"
                          : "border border-[var(--line)] bg-[#f5f5f2] text-[var(--ink)] hover:border-gray-400 dark:border-white/10 dark:bg-black/30 dark:text-gray-300 dark:hover:border-white/30"
                          }`}
                      >
                        <span className="font-mono text-[10px] font-bold">
                          {p.code}
                        </span>
                        <span className="mt-1 line-clamp-1 text-xs font-semibold">
                          {p.title}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Active Document Body */}
                  <div className="mt-4 border-t border-[var(--line)] pt-3 dark:border-white/10">
                    <div className="font-bold text-sm text-[var(--ink)] dark:text-white">
                      {currentFolderForDeck.papers[activePaperIndex]?.title}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--mute)] dark:text-gray-400">
                      {currentFolderForDeck.papers[activePaperIndex]?.desc}
                    </p>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 border-t border-[var(--line)] pt-4 dark:border-white/10">
                  {currentFolderForDeck.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-[var(--line)] bg-white px-3 py-1 font-mono text-xs font-medium text-[var(--ink)] dark:border-white/15 dark:bg-[#1a1b1e] dark:text-gray-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </FadeContent>

      {/* ===================================================================
            MODAL INSPECTION STAGE (Triggered on click from Circular Gallery)
            =================================================================== */}
      {selectedFolder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            onClick={() => setSelectedFolder(null)}
          />

          {/* Modal Dialog Card */}
          <div className="relative z-10 flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[32px] border border-white/15 bg-[#121316] text-[#f5f5f2] shadow-2xl">
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#c4e22e] px-3 py-1 font-mono text-xs font-bold text-[#111213]">
                  {selectedFolder.badge}
                </span>
                <span className="font-mono text-xs font-medium text-white/70">
                  {selectedFolder.tab} · {selectedFolder.year}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Prev / Next folder switcher */}
                <div className="flex items-center gap-1 border-r border-white/15 pr-3">
                  <button
                    type="button"
                    onClick={() => {
                      const currIdx = EXPERIENCE_FOLDERS.findIndex(
                        (f) => f.id === selectedFolder.id
                      );
                      const prevIdx =
                        (currIdx - 1 + EXPERIENCE_FOLDERS.length) %
                        EXPERIENCE_FOLDERS.length;
                      setSelectedFolder(EXPERIENCE_FOLDERS[prevIdx]);
                      setActivePaperIndex(0);
                      playMechanicalClick(580);
                    }}
                    className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white"
                    title="Folder Sebelumnya (Left Arrow)"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const currIdx = EXPERIENCE_FOLDERS.findIndex(
                        (f) => f.id === selectedFolder.id
                      );
                      const nextIdx =
                        (currIdx + 1) % EXPERIENCE_FOLDERS.length;
                      setSelectedFolder(EXPERIENCE_FOLDERS[nextIdx]);
                      setActivePaperIndex(0);
                      playMechanicalClick(660);
                    }}
                    className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white"
                    title="Folder Berikutnya (Right Arrow)"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                {/* Close button */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFolder(null);
                    playMechanicalClick(500);
                  }}
                  className="rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 hover:text-white"
                  title="Tutup (Esc)"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: 2-Column Physical 3D Folder & Document Details */}
            <div className="grid flex-1 grid-cols-1 overflow-y-auto p-6 md:p-8 lg:grid-cols-12 lg:gap-8">
              {/* Stage 1: Interactive 3D Folder Canvas */}
              <div className="flex min-h-[420px] items-center justify-center rounded-2xl bg-black/40 p-6 lg:col-span-6">
                <Folder
                  key={selectedFolder.id}
                  label={selectedFolder.tab}
                  color={selectedFolder.color}
                  mode="flap"
                  variant="solid"
                  size={1.35}
                  defaultOpen={true}
                  draggable={true}
                  zoomOnClick={true}
                  intro={false}
                  layout="spread"
                  items={buildFolderItems(selectedFolder)}
                  onItemClick={(_, pIdx) => {
                    setActivePaperIndex(pIdx);
                    playMechanicalClick(720);
                  }}
                />
              </div>

              {/* Stage 2: Detailed Case Study Inspector */}
              <div className="flex flex-col justify-between space-y-6 lg:col-span-6">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                    {selectedFolder.title}
                  </h3>
                  <p className="mt-1 font-mono text-sm text-[#c4e22e]">
                    {selectedFolder.subtitle}
                  </p>

                  <p className="mt-4 text-sm leading-relaxed text-white/80 md:text-base">
                    {selectedFolder.summary}
                  </p>

                  {/* Paper Selector Tabs */}
                  <div className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between font-mono text-xs text-white/60">
                      <span>LEMBAR BERKAS TERSEDIA:</span>
                      <span className="text-[#c4e22e]">
                        {selectedFolder.papers[activePaperIndex]?.code}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {selectedFolder.papers.map((p, pIdx) => (
                        <button
                          key={p.code}
                          type="button"
                          onClick={() => {
                            setActivePaperIndex(pIdx);
                            playMechanicalClick(650);
                          }}
                          className={`flex flex-col items-start rounded-xl p-2.5 text-left transition-all ${activePaperIndex === pIdx
                            ? "border border-[#c4e22e] bg-[#c4e22e]/15 text-[#c4e22e]"
                            : "border border-white/10 bg-black/30 text-white/70 hover:bg-white/10"
                            }`}
                        >
                          <span className="font-mono text-[9px] font-bold">
                            {p.code}
                          </span>
                          <span className="mt-1 line-clamp-1 text-[11px] font-semibold">
                            {p.title}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="mt-3 border-t border-white/10 pt-3">
                      <div className="font-bold text-sm text-white">
                        {selectedFolder.papers[activePaperIndex]?.title}
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-white/75">
                        {selectedFolder.papers[activePaperIndex]?.desc}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  {/* Engineering Stack */}
                  <div className="border-t border-white/10 pt-4">
                    <div className="font-mono text-[10px] uppercase text-white/50">
                      Engineering Tech Stack:
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedFolder.stack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-xs font-medium text-white"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action Buttons */}
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <Link
                      href={`/projects/${selectedFolder.slug}`}
                      className="inline-flex items-center gap-2 rounded-full border border-[#c4e22e] bg-[#c4e22e]/10 px-5 py-2.5 font-mono text-xs font-semibold text-[#c4e22e] transition hover:bg-[#c4e22e] hover:text-[#111213]"
                    >
                      <span>{locale === "id" ? "Buka Studi Kasus Lengkap" : "Open Full Case Study"}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setSelectedFolder(null)}
                      className="rounded-full bg-white/15 px-6 py-2.5 font-mono text-xs font-semibold text-white transition-colors hover:bg-white/25"
                    >
                      {locale === "id" ? "Tutup Berkas" : "Close Folder"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
export default ExperienceFoldersSection;
