"use client";

import React, { useState, useEffect } from "react";
import { FolderGit2, Save, X, ExternalLink, Github } from "lucide-react";
import type { ProjectCaseStudy } from "@/data/site";
import { playMechanicalClick } from "@/lib/audio/sound-effects";
import { getLenis } from "@/engine";
import { ImageUploadPreview } from "./ImageUploadPreview";
import { RichTextEditor } from "./RichTextEditor";
import { MultiSelectCategories } from "./MultiSelectCategories";
import { DatePickerField } from "./DatePickerField";

export interface ProjectFormModalProps {
  isOpen: boolean;
  project: ProjectCaseStudy | null;
  isCreatingNew: boolean;
  onClose: () => void;
  onSave: (project: ProjectCaseStudy) => Promise<void>;
  isSaving: boolean;
}

const CATEGORY_PRESETS = [
  "IoT Wearable · Edge AI & Computer Vision",
  "Proyek Klien · Mobile Accessibility",
  "GovTech · Relational Database & Web Architecture",
  "GovTech · Civic Reporting & Public Health",
  "Mobile App · Computer Vision & Financial Analytics",
  "Enterprise Web App · Workflow Automation",
  "Full-Stack Web Application",
  "Research Lab // Edge AI & Cloud",
];

export function ProjectFormModal({
  isOpen,
  project,
  isCreatingNew,
  onClose,
  onSave,
  isSaving,
}: ProjectFormModalProps) {
  const [formData, setFormData] = useState<ProjectCaseStudy | null>(null);
  const [coverImage, setCoverImage] = useState<string>("");

  useEffect(() => {
    if (project) {
      setFormData({ ...project });
      setCoverImage(isCreatingNew ? "" : project.slug ? `/experience-folders/${project.slug}.png` : "");
    }
  }, [project, isCreatingNew]);

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
        className="relative w-full max-w-3xl rounded-3xl border border-white/15 bg-[#0e1014] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Header Modal */}
        <div className="shrink-0 flex items-center justify-between border-b border-white/10 px-5 sm:px-7 py-4 bg-[#0e1014]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#c4e22e]/30 bg-[#c4e22e]/10 text-[#c4e22e]">
              <FolderGit2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-white">
                {isCreatingNew ? "Tambah Studi Kasus Baru" : `Edit: ${formData.title}`}
              </h3>
              <p className="font-mono text-[10px] text-white/50">
                Konfigurasi metadata portofolio, media visual, dan ringkasan eksekutif
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
            {/* Row 1: Title, IndexCode, Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6">
              <label className="block font-mono text-[11px] font-semibold text-white/70 mb-1">
                Judul Proyek <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
                placeholder="Nama proyek / studi kasus"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-mono text-[11px] font-semibold text-white/70 mb-1">
                Index Code
              </label>
              <input
                type="text"
                value={formData.indexCode || "01"}
                onChange={(e) => setFormData({ ...formData, indexCode: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white focus:border-[#c4e22e] outline-none text-center"
                placeholder="01"
              />
            </div>
            <div className="sm:col-span-4">
              <label className="block font-mono text-[11px] font-semibold text-white/70 mb-1">
                Slug URL <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white focus:border-[#c4e22e] outline-none"
                placeholder="nama-proyek"
                required
              />
            </div>
          </div>

          {/* Row 2: Multi-Select Categories & DatePicker Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MultiSelectCategories
              label="Kategori / Domain Proyek"
              selectedValues={
                formData.category
                  ? formData.category.split(/[·,]/).map((s) => s.trim()).filter(Boolean)
                  : []
              }
              onChange={(vals) =>
                setFormData({ ...formData, category: vals.join(" · ") })
              }
              scope="projects"
              placeholder="Pilih atau cari kategori..."
              helperText="Bisa memilih beberapa kategori sekaligus"
              required={true}
            />
            <DatePickerField
              label="Tahun Rilis / Periode Pengerjaan"
              value={formData.year}
              onChange={(val) => setFormData({ ...formData, year: val })}
              placeholder="2026 atau 2025 - 2026"
              presets={["2026", "2025 - 2026", "2024 - 2025", "2024 - Sekarang"]}
              required={true}
            />
          </div>

          {/* Row 3: Image Upload & Live Preview */}
          <ImageUploadPreview
            label="Visual / Foto Cover Proyek (Experience Folder Thumbnail)"
            value={coverImage}
            onChange={(newVal) => setCoverImage(newVal)}
            aspectRatio="landscape"
            helperText="Foto artwork 3D folder akan dirender otomatis berdasarkan slug, atau unggah gambar pengganti"
          />

          {/* Row 4: Client/Context & Tech Stack */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[11px] font-semibold text-white/70 mb-1">
                Klien / Konteks Institusi
              </label>
              <input
                type="text"
                value={formData.clientOrContext}
                onChange={(e) => setFormData({ ...formData, clientOrContext: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
                placeholder="Instansi Pemerintah / Client / Riset"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] font-semibold text-white/70 mb-1">
                Tech Stack (pisahkan dengan koma)
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
                placeholder="Next.js 15, TypeScript, Tailwind CSS"
              />
            </div>
          </div>

          {/* Row 5: Rich Text Editor for Executive Summary ID */}
          <RichTextEditor
            label="Ringkasan Eksekutif (Bahasa Indonesia)"
            value={formData.summaryId}
            onChange={(val) => setFormData({ ...formData, summaryId: val })}
            placeholder="Jelaskan ringkasan solusi, teknologi, dan dampak sistem yang dibangun..."
            rows={3}
            required={true}
          />

          {/* Row 6: Live URL & Repo URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[11px] font-semibold text-white/70 mb-1">
                Tautan Produksi (Live URL)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.liveUrl || ""}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-8 pr-3 py-2 font-mono text-xs text-white focus:border-[#c4e22e] outline-none"
                  placeholder="https://..."
                />
                <ExternalLink className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-white/40" />
              </div>
            </div>
            <div>
              <label className="block font-mono text-[11px] font-semibold text-white/70 mb-1">
                Repositori Kode (GitHub URL)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.repoUrl || ""}
                  onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-8 pr-3 py-2 font-mono text-xs text-white focus:border-[#c4e22e] outline-none"
                  placeholder="https://github.com/..."
                />
                <Github className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-white/40" />
              </div>
            </div>
          </div>

          {/* Row 7: Featured Checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer font-mono text-xs text-white select-none">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#c4e22e] focus:ring-[#c4e22e] cursor-pointer"
              />
              <span>Tandai sebagai Featured Project (Sorotan Beranda Utama)</span>
            </label>
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
              <span>{isSaving ? "Menyimpan..." : "Simpan Proyek"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
