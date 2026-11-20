"use client";

import React, { useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ExternalLink,
  ArrowUpRight,
  X,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";
import { type EducationItem } from "@/data/site";
import { playMechanicalClick } from "@/lib/audio/sound-effects";
import { getLenis } from "@/engine";

interface EducationDetailModalProps {
  edu: EducationItem | null;
  locale: "id" | "en";
  onClose: () => void;
}

export function EducationDetailModal({
  edu,
  locale,
  onClose,
}: EducationDetailModalProps) {
  // Lock body scroll and pause Lenis while modal is open
  useEffect(() => {
    if (!edu) return;
    const lenis = getLenis();
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      lenis?.start();
      document.body.style.overflow = prevOverflow;
    };
  }, [edu]);

  // Close modal on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && edu) {
        onClose();
      }
    },
    [edu, onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!edu) return null;

  const isSMK = edu.id.includes("smk");
  const specLabel = isSMK ? "SPEC-01 // FASE KEJURUAN" : "SPEC-02 // FASE AKADEMIK TINGGI";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl transition-all duration-200 overflow-y-auto overscroll-contain"
      data-lenis-prevent="true"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] my-auto overflow-y-auto overscroll-contain rounded-3xl border border-white/10 bg-[#0d0f12] p-6 sm:p-8 md:p-10 shadow-2xl text-white selection:bg-[#c4e22e] selection:text-black"
        data-lenis-prevent="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sleek Close Button */}
        <button
          onClick={onClose}
          className="sticky top-0 float-right z-20 -mr-2 -mt-2 p-2.5 rounded-full border border-white/10 bg-[#0d0f12]/90 hover:bg-white/15 text-white/60 hover:text-white backdrop-blur-md transition-all duration-200 shadow-md"
          aria-label="Tutup modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Minimalist Header */}
        <div className="pr-10">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-white/50">
            <span className="text-[#c4e22e] font-semibold">{specLabel}</span>
            <span>·</span>
            <span>{locale === "id" ? edu.statusLabelId : edu.statusLabelEn}</span>
          </div>

          <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
            {edu.institution}
          </h3>

          <p className="mt-1 text-sm font-medium text-white/80 font-sans">
            {locale === "id" ? edu.degreeId : edu.degreeEn}
          </p>

          <div className="mt-2.5 flex items-center gap-4 font-mono text-[11px] text-white/50">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3 w-3 text-white/40" />
              {edu.period}
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-white/40" />
              {edu.location}
            </span>
          </div>
        </div>

        {/* Editorial Divider */}
        <div className="my-6 h-px w-full bg-white/10" />

        {/* Focus & Competency Prose */}
        <div>
          <h4 className="font-mono text-xs uppercase tracking-widest text-[#c4e22e] font-semibold flex items-center gap-2">
            <Sparkles className="h-3 w-3 text-[#c4e22e]" />
            <span>{locale === "id" ? "Fokus Rekayasa & Riset" : "Engineering & Research Focus"}</span>
          </h4>
          <p className="mt-2 text-xs sm:text-sm text-white/75 leading-relaxed font-sans">
            {locale === "id" ? edu.focusId : edu.focusEn}
          </p>
        </div>

        {/* Curriculum List (Clean Minimalist Lines, No Bloated Pills) */}
        {edu.curriculumHighlightsId && (
          <div className="mt-6">
            <h4 className="font-mono text-xs uppercase tracking-widest text-white/60 font-semibold flex items-center gap-2">
              <Layers className="h-3 w-3 text-white/40" />
              <span>{locale === "id" ? "Kurikulum & Kompetensi Inti" : "Core Curriculum & Skills"}</span>
            </h4>
            <div className="mt-3 divide-y divide-white/5 rounded-2xl border border-white/10 bg-white/[0.02]">
              {(locale === "id"
                ? edu.curriculumHighlightsId
                : edu.curriculumHighlightsEn
              ).map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-4 py-2.5 text-xs text-white/85"
                >
                  <span className="font-mono text-white/50 mr-3 text-[10px]">
                    0{i + 1}
                  </span>
                  <span className="flex-1 font-sans">{item}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Delivered Projects */}
        {edu.keyProjects && edu.keyProjects.length > 0 && (
          <div className="mt-6">
            <h4 className="font-mono text-xs uppercase tracking-widest text-white/60 font-semibold">
              {locale === "id" ? "Sistem Produksi yang Dideploy" : "Production Systems Delivered"}
            </h4>
            <div className="mt-3 space-y-2.5">
              {edu.keyProjects.map((proj, i) => (
                <div
                  key={i}
                  className="group rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.04]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h5 className="font-semibold text-xs sm:text-sm text-white font-display">
                        {proj.title}
                      </h5>
                      <p className="mt-1 text-[11px] sm:text-xs text-white/65 leading-relaxed font-sans">
                        {locale === "id" ? proj.descriptionId : proj.descriptionEn}
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-[10px] text-white/50 border border-white/10 rounded-md px-2 py-0.5">
                      {proj.role}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex flex-wrap gap-1.5">
                      {proj.tech.map((t, idx) => (
                        <span
                          key={idx}
                          className="font-mono text-[10px] text-white/60 bg-white/5 rounded px-2 py-0.5"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {proj.link && (
                      <Link
                        href={proj.link}
                        target={proj.link.startsWith("http") ? "_blank" : undefined}
                        rel={proj.link.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-1 font-mono text-[11px] text-[#c4e22e] hover:underline"
                        onClick={() => playMechanicalClick(820)}
                      >
                        <span>{locale === "id" ? "Detail" : "Explore"}</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Minimalist Footer Action */}
        <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between">
          <span className="font-mono text-[11px] text-white/50">
            {locale === "id" ? "Portal Akademik:" : "Academic Portal:"}
          </span>
          <a
            href={edu.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2 font-mono text-xs font-semibold text-white transition-all shadow-sm"
            onClick={() => playMechanicalClick(880)}
          >
            <span>{edu.institutionShort || edu.institution}</span>
            <ExternalLink className="h-3 w-3 text-white/70" />
          </a>
        </div>
      </div>
    </div>
  );
}
