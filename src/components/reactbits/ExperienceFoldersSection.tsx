"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
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
    <section id="work" className="bg-white py-20 md:py-28 dark:bg-[#0a0a0c]">
      <div className="keffi-wrap">
        {/* Section Header */}
        <div className="sec-head">
          <div>
            <span className="sec-kicker">
              <span className="sec-kicker__dot" />
              <BlurText
                text={
                  locale === "id"
                    ? "REKAM JEJAK & KARYA UNGGULAN · 3D FOLDER CIRCULAR GALLERY"
                    : "SELECTED WORK & REAL EXPERIENCE · 3D FOLDER CIRCULAR GALLERY"
                }
              />
            </span>
            <h2 className="sec-title mt-3">
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
            <div className="inline-flex items-center rounded-full border border-[var(--line)] bg-[#f5f5f2] p-1 dark:bg-black/40">
              <button
                type="button"
                onClick={() => {
                  setViewMode("circular");
                  playMechanicalClick(560);
                }}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-xs font-semibold transition-all ${
                  viewMode === "circular"
                    ? "bg-white text-[var(--ink)] shadow-xs dark:bg-[#1a1b1e] dark:text-white"
                    : "text-[var(--mute)] hover:text-[var(--ink)]"
                }`}
              >
                <span>🎡</span>
                <span>{locale === "id" ? "Galeri Melingkar" : "Circular Gallery"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setViewMode("deck");
                  playMechanicalClick(680);
                }}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-xs font-semibold transition-all ${
                  viewMode === "deck"
                    ? "bg-white text-[var(--ink)] shadow-xs dark:bg-[#1a1b1e] dark:text-white"
                    : "text-[var(--mute)] hover:text-[var(--ink)]"
                }`}
              >
                <span>📂</span>
                <span>{locale === "id" ? "Meja Berkas 3D" : "3D Folder Deck"}</span>
              </button>
            </div>

            <Link href="/projects" className="keffi-pill-outline">
              <span>{locale === "id" ? "Lihat Arsip Lengkap" : "View Full Archive"}</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* ===================================================================
            VIEW MODE A: 3D CIRCULAR GALLERY (WebGL Curved Cylinder)
            =================================================================== */}
        {viewMode === "circular" && (
          <div className="mt-10">
            <div className="relative h-[560px] w-full overflow-hidden rounded-[32px] border border-[var(--line)] bg-[#f5f5f2]/80 md:h-[660px] dark:bg-[#0c0d0e]">
              {/* Circular Gallery WebGL Component */}
              <CircularGalleryWrapper
                items={galleryItems}
                bend={2.5}
                textColor="var(--ink)"
                itemSize={1.05}
                itemAspect={0.733}
                gap={0.34}
                borderRadius={0.065}
                scrollSpeed={2.2}
                scrollEase={0.05}
                showTitles={false}
                snap={true}
                autoScroll={0}
                openOnClick={false}
                onActiveChange={(idx) => {
                  const normalized =
                    ((idx % EXPERIENCE_FOLDERS.length) + EXPERIENCE_FOLDERS.length) %
                    EXPERIENCE_FOLDERS.length;
                  setActiveCircularIndex(normalized);
                }}
                onItemClick={(item, index) => {
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
                }}
              />

              {/* Tactical Overlay: Bottom Controls & Folder Quick Launcher */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center justify-between gap-3 bg-gradient-to-t from-[#f5f5f2] via-[#f5f5f2]/80 to-transparent p-6 dark:from-[#0c0d0e] dark:via-[#0c0d0e]/80 md:flex-row md:items-end">
                <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/90 px-4 py-2 font-mono text-xs text-[var(--ink)] shadow-xs backdrop-blur-md dark:bg-black/80">
                  <span className="h-2 w-2 rounded-full bg-[var(--violet)] animate-pulse" />
                  <span>
                    {locale === "id"
                      ? "Geser kiri / kanan untuk memutar galeri · Klik folder untuk membuka berkas 3D"
                      : "Drag left / right to spin gallery · Click any folder to inspect 3D papers"}
                  </span>
                </div>

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
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--violet)] px-5 py-2.5 font-mono text-xs font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95"
                  >
                    <FolderOpen className="h-4 w-4" />
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
          <div className="mt-10 overflow-hidden rounded-[32px] border border-[var(--line)] bg-[#f5f5f2]/80 p-6 md:p-10 dark:bg-[#0c0d0e]">
            {/* Folder Tabs Navigation */}
            <div className="flex flex-wrap items-center gap-2 border-b border-[var(--line)] pb-5">
              {EXPERIENCE_FOLDERS.map((f, idx) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    setActiveDeckIndex(idx);
                    setActivePaperIndex(0);
                    playMechanicalClick(580 + idx * 25);
                  }}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-semibold transition-all ${
                    activeDeckIndex === idx
                      ? "bg-[var(--violet)] text-white shadow-xs"
                      : "border border-[var(--line)] bg-white text-[var(--ink)] hover:bg-gray-100 dark:bg-[#16171a] dark:hover:bg-[#202226]"
                  }`}
                >
                  <span className="opacity-70">0{idx + 1}</span>
                  <span>{f.tab}</span>
                </button>
              ))}
            </div>

            {/* Direct Folder Stage & Editorial Split */}
            <div className="mt-8 grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
              {/* Left Column: Interactive 3D Folder */}
              <div className="flex min-h-[460px] items-center justify-center rounded-2xl bg-white/40 p-6 dark:bg-black/20 lg:col-span-6">
                <Folder
                  key={currentFolderForDeck.id}
                  label={currentFolderForDeck.tab}
                  color={currentFolderForDeck.color}
                  mode="flap"
                  variant="solid"
                  size={1.3}
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
                <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                  <span className="rounded-full bg-[var(--violet)]/12 px-3 py-1 font-mono text-xs font-bold uppercase text-[var(--violet)]">
                    {currentFolderForDeck.badge}
                  </span>
                  <span className="font-mono text-xs text-[var(--mute)]">
                    {currentFolderForDeck.year}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-[var(--ink)] md:text-3xl">
                    {currentFolderForDeck.title}
                  </h3>
                  <p className="mt-1 font-mono text-sm text-[var(--mute)]">
                    {currentFolderForDeck.subtitle}
                  </p>
                </div>

                <p className="text-sm leading-relaxed text-[var(--ink)] md:text-base">
                  {currentFolderForDeck.summary}
                </p>

                {/* Paper Selector Tabs */}
                <div className="space-y-3 rounded-2xl border border-[var(--line)] bg-white p-5 dark:bg-[#16171a]">
                  <div className="flex items-center justify-between font-mono text-xs font-semibold text-[var(--mute)]">
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
                        className={`flex flex-col items-start rounded-xl p-3 text-left transition-all ${
                          activePaperIndex === pIdx
                            ? "border border-[var(--violet)] bg-[var(--violet)]/10 text-[var(--violet)]"
                            : "border border-[var(--line)] bg-[#f5f5f2] text-[var(--ink)] hover:border-gray-400 dark:bg-black/30"
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
                  <div className="mt-4 border-t border-[var(--line)] pt-3">
                    <div className="font-bold text-sm text-[var(--ink)]">
                      {currentFolderForDeck.papers[activePaperIndex]?.title}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--mute)]">
                      {currentFolderForDeck.papers[activePaperIndex]?.desc}
                    </p>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 border-t border-[var(--line)] pt-4">
                  {currentFolderForDeck.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-[var(--line)] bg-white px-3 py-1 font-mono text-xs font-medium text-[var(--ink)] dark:bg-[#16171a]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

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
                  <span className="rounded-full bg-[var(--violet)] px-3 py-1 font-mono text-xs font-bold text-white">
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
                    <p className="mt-1 font-mono text-sm text-[var(--violet)]">
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
                            className={`flex flex-col items-start rounded-xl p-2.5 text-left transition-all ${
                              activePaperIndex === pIdx
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

                    {/* Bottom Close Button */}
                    <div className="mt-6 flex items-center justify-end">
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
      </div>
    </section>
  );
}
export default ExperienceFoldersSection;
