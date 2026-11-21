"use client";

import React, { useState, useEffect } from "react";
import { Award, Save, X, ExternalLink, CheckCircle2 } from "lucide-react";
import type { CertificateItem } from "@/data/site";
import { playMechanicalClick } from "@/lib/audio/sound-effects";
import { getLenis } from "@/engine";
import { ImageUploadPreview } from "./ImageUploadPreview";
import { RichTextEditor } from "./RichTextEditor";
import { MultiSelectCategories } from "./MultiSelectCategories";
import { DatePickerField } from "./DatePickerField";

export interface CertificateFormModalProps {
  isOpen: boolean;
  certificate: CertificateItem | null;
  isCreatingNew: boolean;
  onClose: () => void;
  onSave: (certificate: CertificateItem) => Promise<void>;
  isSaving: boolean;
}

const CERT_CATEGORIES = [
  "Prestasi Nasional",
  "Kompetisi",
  "Cyber Security",
  "Jaringan Komputer",
  "Cloud Architecture",
  "AI & Machine Learning",
  "Mobile & Software Engineering",
];

export function CertificateFormModal({
  isOpen,
  certificate,
  isCreatingNew,
  onClose,
  onSave,
  isSaving,
}: CertificateFormModalProps) {
  const [formData, setFormData] = useState<CertificateItem | null>(null);

  useEffect(() => {
    if (certificate) {
      setFormData({ ...certificate });
    }
  }, [certificate]);

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
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-white">
                {isCreatingNew ? "Tambah Sertifikat Baru" : `Edit: ${formData.title}`}
              </h3>
              <p className="font-mono text-[10px] text-white/50">
                Kelola kredensial, bukti foto piagam, dan verifikasi kompetensi resmi
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
            {/* Row 1: Title & Issuer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[11px] font-semibold text-white/70 mb-1">
                Judul Sertifikat / Prestasi <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
                placeholder="Nama sertifikat / kompetensi"
                required
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] font-semibold text-white/70 mb-1">
                Lembaga / Penerbit <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.issuer}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
                placeholder="Kementerian Agama / ID-Networkers"
                required
              />
            </div>
          </div>

          {/* Row 2: Multi-Select Categories & DatePicker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MultiSelectCategories
              label="Kategori Sertifikasi"
              selectedValues={
                formData.category
                  ? formData.category.split(/[·,]/).map((s) => s.trim()).filter(Boolean)
                  : []
              }
              onChange={(vals) =>
                setFormData({ ...formData, category: vals.join(" · ") })
              }
              scope="certificates"
              placeholder="Pilih atau tambah kategori..."
              helperText="Bisa memilih beberapa kategori sertifikat sekaligus"
              required={true}
            />
            <DatePickerField
              label="Tanggal / Tahun Terbit"
              value={formData.issueDate}
              onChange={(val) => setFormData({ ...formData, issueDate: val })}
              placeholder="7 November 2026 atau 2025"
              presets={["7 November 2026", "26 November 2025", "5 Juli 2025", "2024"]}
              required={true}
            />
          </div>

          {/* Row 3: Photo Upload with Live Preview */}
          <ImageUploadPreview
            label="Foto Sertifikat / Piagam (Upload Berkas atau URL)"
            value={formData.imageUrl}
            onChange={(newUrl) => setFormData({ ...formData, imageUrl: newUrl })}
            placeholder="/sertif/nama-file.webp atau URL gambar"
            helperText="Unggah scan sertifikat atau gunakan tautan penyimpanan Supabase Storage"
            aspectRatio="landscape"
          />

          {/* Row 4: Credential ID & Verify URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[11px] font-semibold text-white/70 mb-1">
                Nomor Kredensial / ID Registrasi
              </label>
              <input
                type="text"
                value={formData.credentialId}
                onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white focus:border-[#c4e22e] outline-none"
                placeholder="IDN-1764150580-13888"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] font-semibold text-white/70 mb-1">
                Tautan Verifikasi Online
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.verifyUrl || ""}
                  onChange={(e) => setFormData({ ...formData, verifyUrl: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-8 pr-3 py-2 font-mono text-xs text-white focus:border-[#c4e22e] outline-none"
                  placeholder="https://..."
                />
                <ExternalLink className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-white/40" />
              </div>
            </div>
          </div>

          {/* Row 5: Rich Text Editor for Summary */}
          <RichTextEditor
            label="Deskripsi / Catatan Kompetensi (ID)"
            value={formData.summaryId}
            onChange={(val) => setFormData({ ...formData, summaryId: val })}
            placeholder="Jelaskan kompetensi yang diuji, cakupan materi, atau prestasi yang diraih..."
            rows={3}
          />

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
              <span>{isSaving ? "Menyimpan..." : "Simpan Sertifikat"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
