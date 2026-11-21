"use client";

import React, { useState, useEffect } from "react";
import { Briefcase, Save, X, Plus, Trash2 } from "lucide-react";
import type { ExperienceItem } from "@/data/site";
import { playMechanicalClick } from "@/lib/audio/sound-effects";
import { getLenis } from "@/engine";
import { RichTextEditor } from "./RichTextEditor";
import { SearchableSelect } from "./SearchableSelect";
import { DatePickerField } from "./DatePickerField";

export interface ExperienceFormModalProps {
  isOpen: boolean;
  experience: ExperienceItem | null;
  isCreatingNew: boolean;
  onClose: () => void;
  onSave: (experience: ExperienceItem) => Promise<void>;
  isSaving: boolean;
}

const EMPLOYMENT_TYPES = [
  "Magang Resmi",
  "Proyek Pemerintah (Freelance)",
  "Proyek Klien (Freelance)",
  "Prestasi & Riset Inovasi",
  "Full-time Lead Engineer",
  "Part-time Software Engineer",
];

export function ExperienceFormModal({
  isOpen,
  experience,
  isCreatingNew,
  onClose,
  onSave,
  isSaving,
}: ExperienceFormModalProps) {
  const [formData, setFormData] = useState<ExperienceItem | null>(null);

  useEffect(() => {
    if (experience) {
      setFormData({ ...experience });
    }
  }, [experience]);

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

  const addHighlight = () => {
    playMechanicalClick(720);
    setFormData({
      ...formData,
      highlightsId: [...formData.highlightsId, ""],
    });
  };

  const updateHighlight = (index: number, val: string) => {
    const updated = [...formData.highlightsId];
    updated[index] = val;
    setFormData({ ...formData, highlightsId: updated });
  };

  const removeHighlight = (index: number) => {
    playMechanicalClick(650);
    const updated = formData.highlightsId.filter((_, i) => i !== index);
    setFormData({ ...formData, highlightsId: updated });
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
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-white">
                {isCreatingNew ? "Tambah Riwayat Pengalaman" : `Edit: ${formData.roleId}`}
              </h3>
              <p className="font-mono text-[10px] text-white/50">
                Dokumentasi posisi profesional, dampak rekayasa sistem, dan kontribusi nyata
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
            {/* Row 1: Company & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[11px] font-semibold text-white/70 mb-1">
                Perusahaan / Instansi <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
                placeholder="Dinas Komunikasi dan Informatika"
                required
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] font-semibold text-white/70 mb-1">
                Jabatan / Posisi (ID) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.roleId}
                onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
                placeholder="Web Developer Intern / Lead AI Engineer"
                required
              />
            </div>
          </div>

          {/* Row 2: Employment Type & Period DatePicker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SearchableSelect
              label="Tipe Pekerjaan"
              value={formData.employmentType}
              onChange={(val) => setFormData({ ...formData, employmentType: val })}
              options={EMPLOYMENT_TYPES}
              placeholder="Pilih tipe..."
              allowCustom={true}
              required={true}
            />
            <DatePickerField
              label="Periode Kerja"
              value={formData.period}
              onChange={(val) => setFormData({ ...formData, period: val })}
              placeholder="2025 atau 2024 - Sekarang"
              presets={["2025", "2024 - 2025", "2024 - Sekarang", "2021 - 2024"]}
              required={true}
            />
          </div>

          {/* Row 3: Location & Tech Stack */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[11px] font-semibold text-white/70 mb-1">
                Lokasi Kerja
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
                placeholder="Tangerang, Banten (On-site / Remote)"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] font-semibold text-white/70 mb-1">
                Tech Stack yang Digunakan (koma terpisah)
              </label>
              <input
                type="text"
                value={formData.stack.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stack: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  })
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white focus:border-[#c4e22e] outline-none"
                placeholder="Laravel 9, MySQL, Yajra DataTables"
              />
            </div>
          </div>

          {/* Row 4: Rich Text Editor for Executive Summary */}
          <RichTextEditor
            label="Ringkasan Peran & Kontribusi Utama"
            value={formData.summaryId}
            onChange={(val) => setFormData({ ...formData, summaryId: val })}
            placeholder="Jelaskan ruang lingkup tanggung jawab, arsitektur yang dirancang, serta dampaknya bagi organisasi..."
            rows={3}
          />

          {/* Row 5: Dynamic Highlights / Bullet Points */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block font-mono text-[11px] font-semibold text-white/70">
                Poin Pencapaian & Tanggung Jawab Utama
              </label>
              <button
                type="button"
                onClick={addHighlight}
                className="inline-flex items-center gap-1 rounded-md border border-[#c4e22e]/30 bg-[#c4e22e]/10 px-2 py-0.5 font-mono text-[10px] text-[#c4e22e] hover:bg-[#c4e22e]/20 transition-colors"
              >
                <Plus className="h-3 w-3" />
                <span>Tambah Poin</span>
              </button>
            </div>
            <div className="space-y-2">
              {formData.highlightsId.map((highlight, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#c4e22e] shrink-0">#{idx + 1}</span>
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) => updateHighlight(idx, e.target.value)}
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
                    placeholder="Deskripsi pencapaian terukur..."
                  />
                  <button
                    type="button"
                    onClick={() => removeHighlight(idx)}
                    className="p-1.5 rounded-lg text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
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
              <span>{isSaving ? "Menyimpan..." : "Simpan Pengalaman"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
