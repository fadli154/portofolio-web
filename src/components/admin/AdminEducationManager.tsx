"use client";

import React, { useMemo, useState } from "react";
import {
  GraduationCap,
  MapPin,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
  BookOpen,
} from "lucide-react";
import type { EducationItem } from "@/data/site";
import MagicBento, { type MagicBentoItem } from "@/components/MagicBento";
import { playMechanicalClick } from "@/lib/audio/sound-effects";
import { useAdminToast } from "./AdminToastProvider";
import { AdminConfirmDialog } from "./AdminConfirmDialog";

interface AdminEducationManagerProps {
  educations: EducationItem[];
  onSaveEducation: (edu: EducationItem) => Promise<boolean>;
  onDeleteEducation: (id: string) => Promise<boolean>;
}

export function AdminEducationManager({
  educations,
  onSaveEducation,
  onDeleteEducation,
}: AdminEducationManagerProps) {
  const { showToast } = useAdminToast();
  const [editingEdu, setEditingEdu] = useState<EducationItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenEdit = (edu: EducationItem) => {
    playMechanicalClick(720);
    setEditingEdu({ ...edu });
    setIsCreatingNew(false);
  };

  const handleOpenNew = () => {
    playMechanicalClick(750);
    setEditingEdu({
      id: `edu-${Date.now().toString().slice(-4)}`,
      institution: "Institusi Pendidikan Baru",
      websiteUrl: "https://uinbanten.ac.id",
      degreeId: "Gelar / Konsentrasi Studi",
      degreeEn: "Degree / Study Concentration",
      period: "2024 - Sekarang",
      location: "Banten, Indonesia",
      statusLabelId: "Aktif",
      statusLabelEn: "Active",
      focusId: "Fokus rekayasa perangkat lunak dan arsitektur sistem.",
      focusEn: "Software engineering and system architecture focus.",
      curriculumHighlightsId: ["Struktur Data & Algoritma", "Arsitektur Next.js", "PostgreSQL"],
      curriculumHighlightsEn: ["Data Structures & Algorithms", "Next.js Architecture", "PostgreSQL"],
    });
    setIsCreatingNew(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEdu) return;
    setIsSaving(true);
    playMechanicalClick(780);

    const success = await onSaveEducation(editingEdu);
    setIsSaving(false);

    showToast({
      title: isCreatingNew ? "Pendidikan Ditambahkan" : "Perubahan Disimpan",
      description: `Jenjang "${editingEdu.institution}" berhasil diperbarui di CMS.`,
      variant: success ? "success" : "info",
    });
    setEditingEdu(null);
    setIsCreatingNew(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    const target = educations.find((e) => e.id === deleteTargetId);
    const id = deleteTargetId;
    setDeleteTargetId(null);
    playMechanicalClick(650);

    await onDeleteEducation(id);
    showToast({
      title: "Pendidikan Dihapus",
      description: `Jenjang "${target?.institution || id}" telah dihapus dari sistem.`,
      variant: "error",
    });
  };

  // Adaptive MagicBento items in Black, White, #c4e22e
  const bentoItems: MagicBentoItem[] = useMemo(
    () =>
      educations.map((edu) => ({
        id: edu.id,
        colSpan: 1,
        rowSpan: 1,
        onClick: () => handleOpenEdit(edu),
        content: (
          <div className="flex flex-col justify-between h-full w-full">
            <div className="space-y-3">
              {/* Header Badges */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c4e22e]/30 bg-[#c4e22e]/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#c4e22e]">
                  <GraduationCap className="h-3 w-3" />
                  <span>{edu.statusLabelId}</span>
                </span>
                <span className="font-mono text-xs text-white/50">{edu.period}</span>
              </div>

              {/* Institution & Degree */}
              <div>
                <h3 className="font-display text-base font-bold text-white tracking-tight">
                  {edu.institution}
                </h3>
                <div className="mt-1 font-sans text-xs font-semibold text-[#c4e22e]">
                  {edu.degreeId}
                </div>
                <div className="mt-1 flex items-center gap-1 font-mono text-[10px] text-white/40">
                  <MapPin className="h-3 w-3" />
                  <span>{edu.location}</span>
                </div>
              </div>

              {/* Curriculum Highlights */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {edu.curriculumHighlightsId.slice(0, 3).map((item, idx) => (
                  <span
                    key={idx}
                    className="rounded-md bg-white/5 border border-white/10 px-2 py-0.5 font-mono text-[10px] text-white/80"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div
              className="mt-3 flex items-center justify-end gap-2 border-t border-white/10 pt-3"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => handleOpenEdit(edu)}
                className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-white/80 hover:bg-white/15 hover:text-white transition-all cursor-pointer"
              >
                <Pencil className="h-3 w-3" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => setDeleteTargetId(edu.id)}
                className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 font-mono text-[11px] text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
              >
                <Trash2 className="h-3 w-3" />
                <span>Hapus</span>
              </button>
            </div>
          </div>
        ),
      })),
    [educations]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
            Pendidikan & Akademik
          </h2>
          <p className="mt-1 font-sans text-xs sm:text-sm text-white/60">
            Total {educations.length} jenjang pendidikan formal terdaftar.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenNew}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c4e22e] px-4 py-2.5 font-mono text-xs font-bold text-[#111213] shadow-lg shadow-[#c4e22e]/20 hover:bg-[#d6f53b] transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Pendidikan</span>
        </button>
      </div>

      {/* Adaptive MagicBento Grid */}
      <MagicBento
        preset="homepage"
        theme="homepage"
        glowColor="#c4e22e"
        spotlightRadius={260}
        enableStars={true}
        particleCount={18}
        enableBorderGlow={true}
        enableSpotlight={true}
        enableTilt={true}
        enableMagnetism={true}
        clickEffect={true}
        intro={false}
        columns={2}
        rowHeight={300}
        gap={20}
        radius={24}
        items={bentoItems}
      />

      {/* Edit / Create Modal Form */}
      {editingEdu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/15 bg-[#0e1014] p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-[#c4e22e]" />
                <h3 className="font-display text-lg font-bold text-white">
                  {isCreatingNew ? "Tambah Jenjang Pendidikan" : `Edit: ${editingEdu.institution}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingEdu(null)}
                className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[11px] text-white/60 mb-1">Nama Institusi</label>
                  <input
                    type="text"
                    value={editingEdu.institution}
                    onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] text-white/60 mb-1">Program Studi / Jurusan</label>
                  <input
                    type="text"
                    value={editingEdu.degreeId}
                    onChange={(e) => setEditingEdu({ ...editingEdu, degreeId: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-mono text-[11px] text-white/60 mb-1">Periode</label>
                  <input
                    type="text"
                    value={editingEdu.period}
                    onChange={(e) => setEditingEdu({ ...editingEdu, period: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white focus:border-[#c4e22e] outline-none"
                    placeholder="2024 - Sekarang"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] text-white/60 mb-1">Lokasi</label>
                  <input
                    type="text"
                    value={editingEdu.location}
                    onChange={(e) => setEditingEdu({ ...editingEdu, location: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] text-white/60 mb-1">Label Status</label>
                  <input
                    type="text"
                    value={editingEdu.statusLabelId}
                    onChange={(e) => setEditingEdu({ ...editingEdu, statusLabelId: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white focus:border-[#c4e22e] outline-none"
                    placeholder="Aktif / Lulus"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] text-white/60 mb-1">Fokus Pembelajaran (ID)</label>
                <textarea
                  value={editingEdu.focusId}
                  onChange={(e) => setEditingEdu({ ...editingEdu, focusId: e.target.value })}
                  rows={2}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] text-white/60 mb-1">Kurikulum Utama (koma terpisah)</label>
                <input
                  type="text"
                  value={editingEdu.curriculumHighlightsId.join(", ")}
                  onChange={(e) =>
                    setEditingEdu({
                      ...editingEdu,
                      curriculumHighlightsId: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white focus:border-[#c4e22e] outline-none"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingEdu(null)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-mono text-xs text-white/70 hover:bg-white/10 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#c4e22e] px-5 py-2 font-mono text-xs font-bold text-[#111213] shadow-lg shadow-[#c4e22e]/20 hover:bg-[#d6f53b]"
                >
                  <Save className="h-4 w-4" />
                  <span>{isSaving ? "Menyimpan..." : "Simpan Pendidikan"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation SweetAlert Modal */}
      <AdminConfirmDialog
        open={deleteTargetId !== null}
        type="delete"
        title="Hapus Data Pendidikan Ini?"
        description="Data jenjang akademik ini akan dihapus permanen dari portofolio."
        confirmLabel="Ya, Hapus Pendidikan"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
