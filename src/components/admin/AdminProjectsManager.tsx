"use client";

import React, { useMemo, useState } from "react";
import {
  FolderGit2,
  ExternalLink,
  Github,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
  Star,
} from "lucide-react";
import type { ProjectCaseStudy } from "@/data/site";
import MagicBento, { type MagicBentoItem } from "@/components/MagicBento";
import { playMechanicalClick } from "@/lib/audio/sound-effects";
import { useAdminToast } from "./AdminToastProvider";
import { AdminConfirmDialog } from "./AdminConfirmDialog";

function getProjectFolderImage(slug: string): string {
  const clean = slug.toLowerCase();
  if (clean.includes("warga")) return "/experience-folders/project-warga.png";
  if (clean.includes("kopmas")) return "/experience-folders/kopmas.png";
  if (clean.includes("fintrack")) return "/experience-folders/fintrack.png";
  if (clean.includes("dispress")) return "/experience-folders/dispress.png";
  if (clean.includes("spp")) return "/experience-folders/project-spp.png";
  if (clean.includes("sign")) return "/experience-folders/sign2speech.png";
  if (clean.includes("travel")) return "/experience-folders/travelease.png";
  if (clean.includes("wedding")) return "/experience-folders/travelease.png";
  if (clean.includes("haji")) return "/experience-folders/hajicare.png";
  return `/experience-folders/${slug}.png`;
}

interface AdminProjectsManagerProps {
  projects: ProjectCaseStudy[];
  onSaveProject: (project: ProjectCaseStudy) => Promise<boolean>;
  onDeleteProject: (projectId: string) => Promise<boolean>;
}

export function AdminProjectsManager({
  projects,
  onSaveProject,
  onDeleteProject,
}: AdminProjectsManagerProps) {
  const { showToast } = useAdminToast();
  const [editingProject, setEditingProject] = useState<ProjectCaseStudy | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenEdit = (project: ProjectCaseStudy) => {
    playMechanicalClick(720);
    setEditingProject({ ...project });
    setIsCreatingNew(false);
  };

  const handleOpenNew = () => {
    playMechanicalClick(750);
    const newId = `proj-${Date.now().toString().slice(-4)}`;
    const nextIdx = projects.length > 0 ? String(projects.length + 1).padStart(2, "0") : "01";
    setEditingProject({
      id: newId,
      indexCode: nextIdx,
      slug: `proyek-baru-${Date.now().toString().slice(-4)}`,
      title: "Studi Kasus Baru",
      category: "Web Application",
      year: "2026",
      clientOrContext: "Client Publik",
      featured: false,
      roleId: "Lead Full-Stack Engineer",
      roleEn: "Lead Full-Stack Engineer",
      summaryId: "Ringkasan arsitektur sistem dan dampak solusi perangkat lunak.",
      summaryEn: "System architecture summary and software impact.",
      recruiterExecSummaryId: "Ringkasan eksekutif rekayasa arsitektur sistem.",
      recruiterExecSummaryEn: "Executive software architecture engineering summary.",
      problemId: "Kebutuhan otomatisasi dan pemecahan kendala pengguna.",
      problemEn: "User automation needs and operational bottleneck resolution.",
      architectureId: "Desain sistem berlapis dengan Clean Architecture dan RESTful API.",
      architectureEn: "Layered system design with Clean Architecture and RESTful APIs.",
      tradeoffs: [
        {
          decision: "Next.js App Router vs SPA",
          chosen: "Next.js 15 Server Components",
          alternative: "Vite React SPA",
          rationaleId: "Peningkatan performa SEO dan SSR streaming.",
          rationaleEn: "Improved SEO performance and SSR streaming.",
        },
      ],
      metrics: [
        {
          labelId: "Kecepatan Render",
          labelEn: "Render Speed",
          value: "60 FPS",
          delta: "+40%",
        },
      ],
      stack: ["Next.js 15", "TypeScript", "Tailwind CSS", "Supabase"],
      liveUrl: "https://github.com/fadli154",
      repoUrl: "https://github.com/fadli154",
      status: "published",
      accentColor: "#c4e22e",
      diagramSpec: {
        inputNode: "Client Request",
        edgeNode: "Edge Middleware Gate",
        coreNode: "Next.js Server Actions",
        outputNode: "Supabase PostgreSQL RLS",
        throughputLabel: "Sub-50ms Response",
      },
    });
    setIsCreatingNew(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setIsSaving(true);
    playMechanicalClick(780);

    const success = await onSaveProject(editingProject);
    setIsSaving(false);

    showToast({
      title: isCreatingNew ? "Studi Kasus Ditambahkan" : "Perubahan Disimpan",
      description: `Proyek "${editingProject.title}" berhasil disinkronisasi ke katalog CMS.`,
      variant: success ? "success" : "info",
    });
    setEditingProject(null);
    setIsCreatingNew(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    const target = projects.find((p) => p.id === deleteTargetId);
    const id = deleteTargetId;
    setDeleteTargetId(null);
    playMechanicalClick(650);

    await onDeleteProject(id);
    showToast({
      title: "Studi Kasus Dihapus",
      description: `Proyek "${target?.title || id}" telah dihapus dari portofolio.`,
      variant: "error",
    });
  };

  // Adaptive MagicBento items strictly in Black, White, #c4e22e
  const bentoItems: MagicBentoItem[] = useMemo(
    () =>
      projects.map((proj) => ({
        id: proj.id,
        colSpan: 1,
        rowSpan: 1,
        onClick: () => handleOpenEdit(proj),
        content: (
          <div className="flex flex-col justify-between h-full w-full">
            <div className="space-y-3">
              {/* Header Badges */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c4e22e]/30 bg-[#c4e22e]/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#c4e22e]">
                  {proj.category}
                </span>
                {proj.featured ? (
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-[#c4e22e]">
                    <Star className="h-3 w-3 fill-[#c4e22e]" />
                    <span>FEATURED</span>
                  </span>
                ) : (
                  <span className="font-mono text-xs text-white/50">{proj.year || "2024 - 2026"}</span>
                )}
              </div>

              {/* Direct Photo Preview of Project */}
              <div className="relative w-full h-36 rounded-xl overflow-hidden border border-white/10 bg-black/60 group admin-idle-folder-tab">
                <img
                  src={getProjectFolderImage(proj.slug)}
                  alt={proj.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    if (proj.slug.includes("warga")) img.src = "/experience-folders/project-warga.png";
                    else if (proj.slug.includes("kopmas")) img.src = "/experience-folders/kopmas.png";
                    else img.src = "/experience-folders/hajicare.png";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
                  {proj.stack.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="rounded bg-black/75 backdrop-blur-sm px-1.5 py-0.5 font-mono text-[9px] text-white/80 border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Concise Typography */}
              <div>
                <h3 className="font-display text-sm font-bold text-white line-clamp-1 leading-snug">
                  {proj.title}
                </h3>
                <p className="mt-0.5 font-sans text-xs text-white/50 line-clamp-1">
                  {proj.summaryId}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div
              className="mt-3 flex items-center justify-between border-t border-white/10 pt-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2">
                {proj.liveUrl && (
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-[#c4e22e] transition-colors p-1"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                {proj.repoUrl && (
                  <a
                    href={proj.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 hover:text-white transition-colors p-1"
                  >
                    <Github className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(proj)}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-white/80 hover:bg-white/15 hover:text-white transition-all cursor-pointer"
                >
                  <Pencil className="h-3 w-3" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTargetId(proj.id)}
                  className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 font-mono text-[11px] text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          </div>
        ),
      })),
    [projects]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
            Katalog Proyek
          </h2>
          <p className="mt-1 font-sans text-xs sm:text-sm text-white/60">
            Total {projects.length} studi kasus terdaftar di Selected Work.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenNew}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c4e22e] px-4 py-2.5 font-mono text-xs font-bold text-[#111213] shadow-lg shadow-[#c4e22e]/20 hover:bg-[#d6f53b] transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Studi Kasus</span>
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
        columns={3}
        rowHeight={340}
        gap={20}
        radius={24}
        items={bentoItems}
      />

      {/* Edit / Create Modal Form */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl border border-white/15 bg-[#0e1014] p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <FolderGit2 className="h-5 w-5 text-[#c4e22e]" />
                <h3 className="font-display text-lg font-bold text-white">
                  {isCreatingNew ? "Tambah Studi Kasus Baru" : `Edit: ${editingProject.title}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-mono text-[11px] text-white/60 mb-1">Judul Proyek</label>
                  <input
                    type="text"
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] text-white/60 mb-1">Kategori</label>
                  <input
                    type="text"
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
                    placeholder="Web Application / Mobile AI"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] text-white/60 mb-1">Tahun Rilis</label>
                  <input
                    type="text"
                    value={editingProject.year}
                    onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white focus:border-[#c4e22e] outline-none"
                    placeholder="2026"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] text-white/60 mb-1">Ringkasan Eksekutif (ID)</label>
                <textarea
                  value={editingProject.summaryId}
                  onChange={(e) => setEditingProject({ ...editingProject, summaryId: e.target.value })}
                  rows={2}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[11px] text-white/60 mb-1">Klien / Konteks</label>
                  <input
                    type="text"
                    value={editingProject.clientOrContext}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, clientOrContext: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] text-white/60 mb-1">Tech Stack (koma terpisah)</label>
                  <input
                    type="text"
                    value={editingProject.stack.join(", ")}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        stack: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white focus:border-[#c4e22e] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[11px] text-white/60 mb-1">Live URL (Demo / Production)</label>
                  <input
                    type="text"
                    value={editingProject.liveUrl || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white focus:border-[#c4e22e] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] text-white/60 mb-1">Repo URL (GitHub)</label>
                  <input
                    type="text"
                    value={editingProject.repoUrl || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, repoUrl: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white focus:border-[#c4e22e] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-white">
                  <input
                    type="checkbox"
                    checked={editingProject.featured}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, featured: e.target.checked })
                    }
                    className="rounded border-white/20 bg-white/5 text-[#c4e22e] focus:ring-[#c4e22e]"
                  />
                  <span>Tandai sebagai Featured Project (Beranda Utama)</span>
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
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
                  <span>{isSaving ? "Menyimpan..." : "Simpan Proyek"}</span>
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
        title="Hapus Studi Kasus Ini?"
        description="Studi kasus akan dihapus dari katalog portofolio beranda dan detail halaman slug."
        confirmLabel="Ya, Hapus Proyek"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
