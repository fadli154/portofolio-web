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
import { PaginationIconsOnly } from "@/components/ui/PaginationIconsOnly";
import { ExperienceFormModal } from "./forms/ExperienceFormModal";

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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);

  const totalPages = Math.max(1, Math.ceil(experiences.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const paginatedExperiences = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return experiences.slice(start, start + pageSize);
  }, [experiences, safePage, pageSize]);

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

  const handleSaveModal = async (updatedExp: ExperienceItem) => {
    setIsSaving(true);
    const success = await onSaveExperience(updatedExp);
    setIsSaving(false);

    showToast({
      title: isCreatingNew ? "Pengalaman Ditambahkan" : "Perubahan Disimpan",
      description: `Riwayat "${updatedExp.roleId} - ${updatedExp.company}" berhasil diperbarui.`,
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
      paginatedExperiences.map((exp) => ({
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
    [experiences, paginatedExperiences]
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

      {/* Pagination Controls */}
      <PaginationIconsOnly
        currentPage={safePage}
        pageSize={pageSize}
        totalItems={experiences.length}
        onPageChange={setPage}
        onPageSizeChange={(sz) => {
          setPageSize(sz);
          setPage(1);
        }}
        pageSizeOptions={[2, 4, 8, 16]}
      />

      {/* Edit / Create Modal Form */}
      <ExperienceFormModal
        isOpen={editingExp !== null}
        experience={editingExp}
        isCreatingNew={isCreatingNew}
        onClose={() => setEditingExp(null)}
        onSave={handleSaveModal}
        isSaving={isSaving}
      />

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
