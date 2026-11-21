"use client";

import React, { useState, useEffect } from "react";
import { GraduationCap, Save, X, ExternalLink } from "lucide-react";
import type { EducationItem } from "@/data/site";
import { playMechanicalClick } from "@/lib/audio/sound-effects";
import { getLenis } from "@/engine";
import { RichTextEditor } from "./RichTextEditor";
import { SearchableSelect } from "./SearchableSelect";
import { DatePickerField } from "./DatePickerField";

export interface EducationFormModalProps {
  isOpen: boolean;
  education: EducationItem | null;
  isCreatingNew: boolean;
  onClose: () => void;
  onSave: (education: EducationItem) => Promise<void>;
  isSaving: boolean;
}

const STATUS_OPTIONS = [
  { value: "Aktif", label: "Aktif (Sedang Menempuh)" },
  { value: "Lulus", label: "Lulus" },
  { value: "Selesai", label: "Selesai" },
];

export function EducationFormModal({
  isOpen,
  education,
  isCreatingNew,
  onClose,
  onSave,
  isSaving,
}: EducationFormModalProps) {
  const [formData, setFormData] = useState<EducationItem | null>(null);

  useEffect(() => {
    if (education) {
      setFormData({ ...education });
    }
  }, [education]);

  // Pause global Lenis smooth-scroll while modal is active
  useEffect(() => {
    if (isOpen) {
      const lenis = getLenis();
      lenis?.stop();
      return () => {
        lenis?.start();
      };
    }
  }, [isOpen]);

  if (!isOpen || !formData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playMechanicalClick(780);
    await onSave(formData);
  };

  return (
    <div
      data-lenis-prevent="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-hidden"
    >
      <div
        data-lenis-prevent="true"
        className="relative w-full max-w-2xl rounded-3xl border border-white/15 bg-[#0e1014] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Header Modal */}
        <div className="shrink-0 flex items-center justify-between border-b border-white/10 px-5 sm:px-7 py-4 bg-[#0e1014]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#c4e22e]/30 bg-[#c4e22e]/10 text-[#c4e22e]">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-white">
                {isCreatingNew ? "Tambah Jenjang Pendidikan" : `Edit: ${formData.institution}`}
              </h3>
              <p className="font-mono text-[10px] text-white/50">
                Pendidikan formal, gelar akademik, dan konsentrasi keahlian kurikulum
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              playMechanicalClick(650);
              onClose();
            }}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} data-lenis-prevent="true" className="flex flex-col flex-1 min-h-0 overflow-hidden">
          {/* Scrollable Form Body with High-Contrast Slider */}
          <div
            data-lenis-prevent="true"
            data-admin-scroll="true"
            className="flex-1 overflow-y-auto overscroll-contain admin-modal-scroll px-5 sm:px-7 py-5 space-y-4 pr-3.5"
          >
            {/* Row 1: Institution & Website */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[11px] font-semibold text-white/70 mb-1">
                Institusi Pendidikan <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
                placeholder="UIN Sultan Maulana Hasanuddin / SMKN 4 Tangerang"
                required
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] font-semibold text-white/70 mb-1">
                Tautan Website Resmi
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-8 pr-3 py-2 font-mono text-xs text-white focus:border-[#c4e22e] outline-none"
                  placeholder="https://uinbanten.ac.id"
                />
                <ExternalLink className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-white/40" />
              </div>
            </div>
          </div>

          {/* Row 2: Degree & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[11px] font-semibold text-white/70 mb-1">
                Gelar / Program Studi (ID) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.degreeId}
                onChange={(e) => setFormData({ ...formData, degreeId: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
                placeholder="Sarjana Komputer (S1) - Teknik Informatika"
                required
              />
            </div>
            <SearchableSelect
              label="Status Akademik"
              value={formData.statusLabelId}
              onChange={(val) => setFormData({ ...formData, statusLabelId: val })}
              options={STATUS_OPTIONS}
              placeholder="Pilih status..."
            />
          </div>

          {/* Row 3: Period DatePicker & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DatePickerField
              label="Periode Studi"
              value={formData.period}
              onChange={(val) => setFormData({ ...formData, period: val })}
              placeholder="2024 - Sekarang atau 2021 - 2024"
              presets={["2024 - Sekarang", "2021 - 2024", "2020 - 2023"]}
              required={true}
            />
            <div>
              <label className="block font-mono text-[11px] font-semibold text-white/70 mb-1">
                Lokasi Kampus / Sekolah
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
                placeholder="Kota Serang, Banten"
              />
            </div>
          </div>

          {/* Row 4: Rich Text Editor for Focus */}
          <RichTextEditor
            label="Spesialisasi Arsitektur & Fokus Riset"
            value={formData.focusId}
            onChange={(val) => setFormData({ ...formData, focusId: val })}
            placeholder="Jelaskan bidang riset, konsentrasi keilmuan, dan fokus pendalaman teknologi..."
            rows={3}
          />

          {/* Row 5: Curriculum Highlights */}
          <div>
            <label className="block font-mono text-[11px] font-semibold text-white/70 mb-1">
              Highlight Kurikulum & Kompetensi Inti (pisahkan dengan koma)
            </label>
            <input
              type="text"
              value={formData.curriculumHighlightsId.join(", ")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  curriculumHighlightsId: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white focus:border-[#c4e22e] outline-none"
              placeholder="Struktur Data, Arsitektur Next.js 15, Supabase PostgreSQL RLS"
            />
          </div>

          </div>

          {/* Sticky Pinned Footer Actions */}
          <div className="shrink-0 flex items-center justify-end gap-3 px-5 sm:px-7 py-3.5 border-t border-white/10 bg-[#0c0d12]">
            <button
              type="button"
              onClick={() => {
                playMechanicalClick(650);
                onClose();
              }}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-mono text-xs text-white/70 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#c4e22e] px-5 py-2 font-mono text-xs font-bold text-[#111213] shadow-lg shadow-[#c4e22e]/20 hover:bg-[#d6f53b] transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? "Menyimpan..." : "Simpan Pendidikan"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
