"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Save, X, ExternalLink } from "lucide-react";
import type { KwuSessionItem } from "@/data/site";
import { playMechanicalClick } from "@/lib/audio/sound-effects";
import { getLenis } from "@/engine";
import { ImageUploadPreview } from "./ImageUploadPreview";
import { RichTextEditor } from "./RichTextEditor";
import { SearchableSelect } from "./SearchableSelect";
import { DatePickerField } from "./DatePickerField";

export interface CourseworkFormModalProps {
  isOpen: boolean;
  session: KwuSessionItem | null;
  isCreatingNew: boolean;
  onClose: () => void;
  onSave: (session: KwuSessionItem) => Promise<void>;
  isSaving: boolean;
}

const ATTENDANCE_OPTIONS = [
  { value: "Hadir", label: "Hadir ✓" },
  { value: "Dispensasi Lomba", label: "Dispensasi Lomba Nasional" },
  { value: "Izin", label: "Izin Akademik" },
  { value: "Alpa", label: "Alpa" },
];

const TASK_STATUS_OPTIONS = [
  { value: "Selesai", label: "Selesai ✓" },
  { value: "Proses", label: "Dalam Pengerjaan" },
  { value: "Belum Ada Tugas", label: "Belum Ada Tugas" },
];

export function CourseworkFormModal({
  isOpen,
  session,
  isCreatingNew,
  onClose,
  onSave,
  isSaving,
}: CourseworkFormModalProps) {
  const [formData, setFormData] = useState<KwuSessionItem | null>(null);

  useEffect(() => {
    if (session) {
      setFormData({ ...session });
    }
  }, [session]);

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
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-white">
                {isCreatingNew
                  ? "Tambah Sesi Perkuliahan Baru"
                  : `Edit: Pertemuan ${formData.number} (${formData.code || "KWU"})`}
              </h3>
              <p className="font-mono text-[10px] text-white/50">
                Log absensi mingguan, dokumentasi foto kelas, dan tautan tugas Google Sites
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
            {/* Row 1: Session Number, Code, Attendance */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-mono text-[11px] font-semibold text-white/70 mb-1">
                Nomor Pertemuan <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                value={formData.number}
                onChange={(e) =>
                  setFormData({ ...formData, number: parseInt(e.target.value) || 1 })
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white focus:border-[#c4e22e] outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] font-semibold text-white/70 mb-1">
                Kode Pertemuan
              </label>
              <input
                type="text"
                value={formData.code || `KWU-${formData.number}`}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white focus:border-[#c4e22e] outline-none"
              />
            </div>
            <SearchableSelect
              label="Status Kehadiran"
              value={formData.attendanceStatus || "Hadir"}
              onChange={(val) =>
                setFormData({
                  ...formData,
                  attendanceStatus: val as KwuSessionItem["attendanceStatus"],
                })
              }
              options={ATTENDANCE_OPTIONS}
              placeholder="Status presensi..."
              allowCustom={true}
              required={true}
            />
          </div>

          {/* Row 2: Date Picker & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <DatePickerField
                label="Tanggal Perkuliahan"
                value={formData.sessionDate || ""}
                onChange={(val) => setFormData({ ...formData, sessionDate: val })}
                placeholder="21 November 2026"
                presets={["Minggu 1", "2026"]}
                required={true}
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] font-semibold text-white/70 mb-1">
                Topik / Judul Pertemuan (ID) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={formData.titleId}
                onChange={(e) => setFormData({ ...formData, titleId: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
                placeholder="Materi pembahasan perkuliahan..."
                required
              />
            </div>
          </div>

          {/* Row 3: Photo Attendance Proof Upload with Live Preview */}
          <ImageUploadPreview
            label="Foto Dokumentasi / Bukti Kehadiran Kelas"
            value={formData.attendanceProofUrl || ""}
            onChange={(newVal) => setFormData({ ...formData, attendanceProofUrl: newVal })}
            placeholder="/coursework/proof-session-1.png atau unggah foto"
            aspectRatio="landscape"
            helperText="Unggah foto suasana kelas, screenshot presentasi, atau piagam dispensasi"
          />

          {/* Row 4: Rich Text Editor for Description */}
          <RichTextEditor
            label="Deskripsi & Rangkuman Sesi Kuliah"
            value={formData.descId}
            onChange={(val) => setFormData({ ...formData, descId: val })}
            placeholder="Rangkum capaian pembelajaran, diskusi kelas, dan arahan dosen pembimbing..."
            rows={3}
          />

          {/* Row 5: Task Status & Task Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SearchableSelect
              label="Status Pengerjaan Tugas"
              value={formData.taskStatus || "Selesai"}
              onChange={(val) =>
                setFormData({
                  ...formData,
                  taskStatus: val as "Selesai" | "Proses" | "Belum Ada Tugas",
                })
              }
              options={TASK_STATUS_OPTIONS}
              placeholder="Pilih status tugas..."
            />
            <div>
              <label className="block font-mono text-[11px] font-semibold text-white/70 mb-1">
                Tautan Tugas (Google Sites / Docs / Drive)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.taskUrl || ""}
                  onChange={(e) => setFormData({ ...formData, taskUrl: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-8 pr-3 py-2 font-mono text-xs text-white focus:border-[#c4e22e] outline-none"
                  placeholder="https://sites.google.com/..."
                />
                <ExternalLink className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-white/40" />
              </div>
            </div>
          </div>

          {/* Row 6: Task Title */}
          <div>
            <label className="block font-mono text-[11px] font-semibold text-white/70 mb-1">
              Judul Tugas / Output Praktikum
            </label>
            <input
              type="text"
              value={formData.taskTitle || ""}
              onChange={(e) => setFormData({ ...formData, taskTitle: e.target.value })}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
              placeholder="Contoh: Perancangan Business Model Canvas & Value Proposition"
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
              <span>{isSaving ? "Menyimpan..." : "Simpan Sesi ke Supabase"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
