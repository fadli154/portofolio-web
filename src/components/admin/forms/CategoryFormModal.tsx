"use client";

import React, { useState, useEffect } from "react";
import { X, Save, Tag, Sparkles } from "lucide-react";
import {
  PRESET_CATEGORY_COLORS,
  slugifyCategory,
  type CategoryItem,
  type CategoryScope,
} from "@/lib/data/categories";
import { playMechanicalClick } from "@/lib/audio/sound-effects";
import { getLenis } from "@/engine";

export interface CategoryFormModalProps {
  isOpen: boolean;
  category: CategoryItem | null;
  isCreatingNew: boolean;
  onClose: () => void;
  onSave: (cat: CategoryItem) => Promise<void>;
  isSaving: boolean;
}

const SCOPE_OPTIONS: { value: CategoryScope; label: string }[] = [
  { value: "all", label: "Semua Modul (Universal)" },
  { value: "projects", label: "Proyek & Studi Kasus" },
  { value: "certificates", label: "Sertifikat & Piagam" },
  { value: "experiences", label: "Pengalaman & Riwayat Kerja" },
  { value: "technologies", label: "Keahlian & Teknologi" },
  { value: "general", label: "Umum & Internal" },
];

export function CategoryFormModal({
  isOpen,
  category,
  isCreatingNew,
  onClose,
  onSave,
  isSaving,
}: CategoryFormModalProps) {
  const [formData, setFormData] = useState<CategoryItem | null>(null);

  useEffect(() => {
    if (category) {
      setFormData({ ...category });
    } else if (isCreatingNew) {
      setFormData({
        id: `cat-${Date.now()}`,
        name: "",
        slug: "",
        scope: "all",
        colorHex: "#c4e22e",
        description: "",
        sortOrder: 1,
        isVisible: true,
      });
    }
  }, [category, isCreatingNew]);

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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (isCreatingNew) {
      setFormData((prev) =>
        prev
          ? {
              ...prev,
              name: val,
              slug: slugifyCategory(val),
            }
          : null
      );
    } else {
      setFormData((prev) => (prev ? { ...prev, name: val } : null));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    playMechanicalClick(780);
    await onSave({
      ...formData,
      slug: formData.slug || slugifyCategory(formData.name),
    });
  };

  return (
    <div
      data-lenis-prevent="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-hidden"
    >
      <div
        data-lenis-prevent="true"
        className="relative w-full max-w-xl rounded-3xl border border-white/15 bg-[#0e1014] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
      >
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between border-b border-white/10 px-5 sm:px-7 py-4 bg-[#0e1014]">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{
                backgroundColor: `${formData.colorHex}20`,
                color: formData.colorHex,
              }}
            >
              <Tag className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-mono text-sm sm:text-base font-bold text-white">
                {isCreatingNew ? "Tambah Kategori Baru" : "Edit Kategori"}
              </h2>
              <p className="font-mono text-[10px] text-white/50">
                Kategori dinamis terpusat untuk relasi proyek, sertifikat & pengalaman
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              playMechanicalClick(650);
              onClose();
            }}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/50 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
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
            {/* Live Badge Preview */}
            <div className="p-3.5 rounded-2xl border border-white/10 bg-[#090a0d] flex items-center justify-between">
              <span className="font-mono text-[11px] text-white/50">Preview Badge:</span>
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border"
                style={{
                  backgroundColor: `${formData.colorHex}15`,
                  borderColor: `${formData.colorHex}40`,
                  color: formData.colorHex,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: formData.colorHex }}
                />
                <span>{formData.name.trim() || "Nama Kategori"}</span>
              </div>
            </div>
          {/* Row 1: Name & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[11px] font-semibold text-white/70 mb-1">
                Nama Kategori <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
                placeholder="misal: AI & Vision"
                required
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] font-semibold text-white/70 mb-1">
                Slug (URL Identifier) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: slugifyCategory(e.target.value) })
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white/80 focus:border-[#c4e22e] outline-none"
                placeholder="ai-vision"
                required
              />
            </div>
          </div>

          {/* Row 2: Scope & Sort Order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[11px] font-semibold text-white/70 mb-1">
                Lingkup (Scope)
              </label>
              <select
                value={formData.scope}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    scope: e.target.value as CategoryScope,
                  })
                }
                className="w-full rounded-xl border border-white/10 bg-[#16171d] px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
              >
                {SCOPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#16171d]">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-mono text-[11px] font-semibold text-white/70 mb-1">
                Urutan Tampil (Sort Order)
              </label>
              <input
                type="number"
                value={formData.sortOrder}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sortOrder: parseInt(e.target.value, 10) || 0,
                  })
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white focus:border-[#c4e22e] outline-none"
                min={0}
              />
            </div>
          </div>

          {/* Row 3: Color Preset Chips & Custom Hex */}
          <div>
            <label className="block font-mono text-[11px] font-semibold text-white/70 mb-1.5">
              Warna Aksen Tag / Badge
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {PRESET_CATEGORY_COLORS.map((color) => (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => {
                    playMechanicalClick(720);
                    setFormData({ ...formData, colorHex: color.hex });
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-all cursor-pointer ${
                    formData.colorHex.toLowerCase() === color.hex.toLowerCase()
                      ? "border-white bg-white/15 text-white scale-105"
                      : "border-white/10 bg-white/5 text-white/60 hover:border-white/30"
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span>{color.name}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.colorHex}
                onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                className="h-8 w-10 cursor-pointer rounded-lg border border-white/10 bg-transparent p-0.5"
              />
              <input
                type="text"
                value={formData.colorHex}
                onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                className="w-28 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-white focus:border-[#c4e22e] outline-none"
                placeholder="#c4e22e"
              />
            </div>
          </div>

          {/* Row 4: Description */}
          <div>
            <label className="block font-mono text-[11px] font-semibold text-white/70 mb-1">
              Deskripsi Singkat (Opsional)
            </label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
              rows={2}
              placeholder="Penjelasan singkat ruang lingkup kategori ini..."
            />
          </div>

          {/* Row 5: Visibility Toggle */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs font-mono text-white/80 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isVisible}
                onChange={(e) =>
                  setFormData({ ...formData, isVisible: e.target.checked })
                }
                className="rounded border-white/20 bg-white/10 text-[#c4e22e] focus:ring-[#c4e22e]"
              />
              <span>Tampilkan ke Publik (Aktif)</span>
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
              className="flex items-center gap-1.5 rounded-xl bg-[#c4e22e] px-5 py-2 font-mono text-xs font-bold text-black hover:bg-[#d4f23e] transition-colors disabled:opacity-50 cursor-pointer shadow-lg shadow-[#c4e22e]/10"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{isSaving ? "Menyimpan..." : "Simpan Kategori"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
