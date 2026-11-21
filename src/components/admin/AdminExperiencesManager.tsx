"use client";

import React, { useMemo, useState } from "react";
import {
  Briefcase,
  MapPin,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
  Building,
} from "lucide-react";
import type { ExperienceItem } from "@/data/site";
import MagicBento, { type MagicBentoItem } from "@/components/MagicBento";
import { playMechanicalClick } from "@/lib/audio/sound-effects";
import { useAdminToast } from "./AdminToastProvider";
import { AdminConfirmDialog } from "./AdminConfirmDialog";

interface AdminExperiencesManagerProps {
  experiences: ExperienceItem[];
  onSaveExperience: (exp: ExperienceItem) => Promise<boolean>;
  onDeleteExperience: (id: string) => Promise<boolean>;
}

export function AdminExperiencesManager({
  experiences,
  onSaveExperience,
  onDeleteExperience,
}: AdminExperiencesManagerProps) {
  const { showToast } = useAdminToast();
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenEdit = (exp: ExperienceItem) => {
    playMechanicalClick(720);
    setEditingExp({ ...exp });
    setIsCreatingNew(false);
  };

  const handleOpenNew = () => {
    playMechanicalClick(750);
    const nextIdx = experiences.length > 0 ? String(experiences.length + 1).padStart(2, "0") : "01";
    setEditingExp({
      id: `exp-${Date.now().toString().slice(-4)}`,
      indexCode: nextIdx,
      roleId: "Software Engineer",
      roleEn: "Software Engineer",
      company: "Instansi / Perusahaan Baru",
      employmentType: "Magang / Kontrak",
      period: "2026 - Sekarang",
      location: "Tangerang / Jakarta",
      isCurrent: true,
      metricsBadge: "Production Deployments",
      summaryId: "Mengembangkan arsitektur perangkat lunak dan sistem digital.",
      summaryEn: "Developing software architecture and digital solutions.",
      highlightsId: [
        "Merancang antarmuka pengguna interaktif dengan performa 60 FPS",
        "Mengintegrasikan API dan basis data terdistribusi",
      ],
      highlightsEn: [
        "Architecting interactive UI with 60 FPS performance",
        "Integrating APIs and distributed databases",
      ],
      stack: ["Next.js 15", "TypeScript", "PostgreSQL"],
    });
    setIsCreatingNew(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp) return;
    setIsSaving(true);
    playMechanicalClick(780);

    const success = await onSaveExperience(editingExp);
    setIsSaving(false);

    showToast({
      title: isCreatingNew ? "Pengalaman Ditambahkan" : "Perubahan Disimpan",
      description: `Riwayat di "${editingExp.company}" berhasil diperbarui di CMS.`,
      variant: success ? "success" : "info",
    });
    setEditingExp(null);
    setIsCreatingNew(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    const target = experiences.find((e) => e.id === deleteTargetId);
    const id = deleteTargetId;
    setDeleteTargetId(null);
    playMechanicalClick(650);

    await onDeleteExperience(id);
    showToast({
      title: "Pengalaman Dihapus",
      description: `Riwayat "${target?.company || id}" telah dihapus dari sistem.`,
      variant: "error",
    });
  };

  // Adaptive MagicBento items in Black, White, #c4e22e
  const bentoItems: MagicBentoItem[] = useMemo(
    () =>
      experiences.map((exp) => ({
        id: exp.id,
        colSpan: 1,
        rowSpan: 1,
        onClick: () => handleOpenEdit(exp),
        content: (
          <div className="flex flex-col justify-between h-full w-full">
            <div className="space-y-3">
              {/* Header Badges */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c4e22e]/30 bg-[#c4e22e]/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#c4e22e]">
                  <Briefcase className="h-3 w-3" />
                  <span>{exp.employmentType}</span>
                </span>
                <span className="font-mono text-xs text-white/50">{exp.period}</span>
              </div>

              {/* Role & Company */}
              <div>
                <h3 className="font-display text-base font-bold text-white tracking-tight">
                  {exp.roleId}
                </h3>
                <div className="mt-1 font-sans text-xs font-semibold text-[#c4e22e]">
                  {exp.company}
                </div>
                <div className="mt-1 flex items-center gap-1 font-mono text-[10px] text-white/40">
                  <MapPin className="h-3 w-3" />
                  <span>{exp.location}</span>
                </div>
              </div>

              {/* Key Highlights */}
              <div className="space-y-1.5 pt-1 font-sans text-xs text-white/70">
                {exp.highlightsId.slice(0, 2).map((h, i) => (
                  <div key={i} className="flex items-start gap-2 line-clamp-1 text-[11px]">
                    <span className="text-[#c4e22e]">•</span>
                    <span className="line-clamp-1">{h}</span>
                  </div>
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
                onClick={() => handleOpenEdit(exp)}
                className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-white/80 hover:bg-white/15 hover:text-white transition-all cursor-pointer"
              >
                <Pencil className="h-3 w-3" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => setDeleteTargetId(exp.id)}
                className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 font-mono text-[11px] text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
              >
                <Trash2 className="h-3 w-3" />
                <span>Hapus</span>
              </button>
            </div>
          </div>
        ),
      })),
    [experiences]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
            Pengalaman & Karier
          </h2>
          <p className="mt-1 font-sans text-xs sm:text-sm text-white/60">
            Total {experiences.length} riwayat profesional terdaftar.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenNew}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c4e22e] px-4 py-2.5 font-mono text-xs font-bold text-[#111213] shadow-lg shadow-[#c4e22e]/20 hover:bg-[#d6f53b] transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Pengalaman</span>
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
      {editingExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/15 bg-[#0e1014] p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-[#c4e22e]" />
                <h3 className="font-display text-lg font-bold text-white">
                  {isCreatingNew ? "Tambah Pengalaman Baru" : `Edit: ${editingExp.company}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingExp(null)}
                className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[11px] text-white/60 mb-1">Peran / Posisi</label>
                  <input
                    type="text"
                    value={editingExp.roleId}
                    onChange={(e) => setEditingExp({ ...editingExp, roleId: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] text-white/60 mb-1">Perusahaan / Instansi</label>
                  <input
                    type="text"
                    value={editingExp.company}
                    onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-mono text-[11px] text-white/60 mb-1">Tipe Pekerjaan</label>
                  <input
                    type="text"
                    value={editingExp.employmentType}
                    onChange={(e) => setEditingExp({ ...editingExp, employmentType: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white focus:border-[#c4e22e] outline-none"
                    placeholder="Magang / Kontrak"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] text-white/60 mb-1">Periode</label>
                  <input
                    type="text"
                    value={editingExp.period}
                    onChange={(e) => setEditingExp({ ...editingExp, period: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white focus:border-[#c4e22e] outline-none"
                    placeholder="2024 - 2025"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] text-white/60 mb-1">Lokasi</label>
                  <input
                    type="text"
                    value={editingExp.location}
                    onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] text-white/60 mb-1">Ringkasan Tanggung Jawab (ID)</label>
                <textarea
                  value={editingExp.summaryId}
                  onChange={(e) => setEditingExp({ ...editingExp, summaryId: e.target.value })}
                  rows={2}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] text-white/60 mb-1">Highlight Pencapaian (baris baru)</label>
                <textarea
                  value={editingExp.highlightsId.join("\n")}
                  onChange={(e) =>
                    setEditingExp({
                      ...editingExp,
                      highlightsId: e.target.value.split("\n").filter(Boolean),
                    })
                  }
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingExp(null)}
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
                  <span>{isSaving ? "Menyimpan..." : "Simpan Pengalaman"}</span>
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
        title="Hapus Pengalaman Ini?"
        description="Riwayat pengalaman kerja ini akan dihapus permanen dari portofolio."
        confirmLabel="Ya, Hapus Pengalaman"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
