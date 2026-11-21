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
import { PaginationIconsOnly } from "@/components/ui/PaginationIconsOnly";
import { ProjectFormModal } from "./forms/ProjectFormModal";

const FOLDER_MAP: Record<string, string> = {
  warga: "project-warga", kopmas: "kopmas", fintrack: "fintrack", dispress: "dispress",
  spp: "project-spp", sign: "sign2speech", travel: "travelease", wedding: "travelease", haji: "hajicare",
};

function getProjectFolderImage(slug: string): string {
  const clean = slug.toLowerCase();
  const match = Object.keys(FOLDER_MAP).find((k) => clean.includes(k));
  return `/experience-folders/${match ? FOLDER_MAP[match] : slug}.png`;
}

function getPrimaryCategory(cat: string): string {
  const first = cat.split(/[·•]/)[0]?.trim() || cat;
  return first.length > 20 ? first.slice(0, 18).trim() + "…" : first;
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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const totalPages = Math.max(1, Math.ceil(projects.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const paginatedProjects = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return projects.slice(start, start + pageSize);
  }, [projects, safePage, pageSize]);

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
      tradeoffs: [{
        decision: "Next.js App Router vs SPA",
        chosen: "Next.js 15 Server Components",
        alternative: "Vite React SPA",
        rationaleId: "Peningkatan performa SEO dan SSR streaming.",
        rationaleEn: "Improved SEO performance and SSR streaming.",
      }],
      metrics: [{ labelId: "Kecepatan Render", labelEn: "Render Speed", value: "60 FPS", delta: "+40%" }],
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

  const handleSaveModal = async (updatedProj: ProjectCaseStudy) => {
    setIsSaving(true);
    const success = await onSaveProject(updatedProj);
    setIsSaving(false);

    showToast({
      title: isCreatingNew ? "Studi Kasus Ditambahkan" : "Perubahan Disimpan",
      description: `Proyek "${updatedProj.title}" berhasil disinkronisasi ke katalog CMS.`,
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
      paginatedProjects.map((proj) => ({
        id: proj.id,
        colSpan: 1,
        rowSpan: 1,
        onClick: () => handleOpenEdit(proj),
        content: (
          <div className="flex flex-col justify-between h-full w-full">
            <div className="space-y-2.5">
              {/* Header Badges with Clean Bounded Pills */}
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#c4e22e]/30 bg-[#c4e22e]/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#c4e22e] tracking-tight">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c4e22e] shrink-0" />
                  <span className="truncate max-w-[150px]">{getPrimaryCategory(proj.category)}</span>
                </span>
                {proj.featured ? (
                  <span className="inline-flex items-center gap-1 shrink-0 rounded-md border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-300">
                    <Star className="h-2.5 w-2.5 fill-amber-300" />
                    <span>Featured</span>
                  </span>
                ) : (
                  <span className="font-mono text-[11px] text-white/40 shrink-0">
                    {proj.year?.slice(-4) || "2025"}
                  </span>
                )}
              </div>

              {/* Clean 3D Folder Visual (No Cluttering Overlay) */}
              <div className="relative w-full h-34 rounded-xl overflow-hidden border border-white/10 bg-black/60 group admin-idle-folder-tab">
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
                <div className="admin-idle-foil-sheen" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                {proj.indexCode && (
                  <span className="absolute bottom-2 right-2 rounded-md bg-black/85 backdrop-blur-sm px-2 py-0.5 font-mono text-[10px] text-white/70 border border-white/10">
                    #{proj.indexCode}
                  </span>
                )}
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

              {/* Tech Stack Pills dengan Batas Rapi (Maks 3) */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                {proj.stack.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-white/70"
                  >
                    {tech}
                  </span>
                ))}
                {proj.stack.length > 3 && (
                  <span className="rounded-md border border-white/5 bg-white/[0.02] px-1.5 py-0.5 font-mono text-[9px] text-white/40">
                    +{proj.stack.length - 3}
                  </span>
                )}
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
    [projects, paginatedProjects]
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
        rowHeight={355}
        gap={20}
        radius={24}
        items={bentoItems}
      />

      {/* Pagination Controls */}
      <PaginationIconsOnly
        currentPage={safePage}
        pageSize={pageSize}
        totalItems={projects.length}
        onPageChange={setPage}
        onPageSizeChange={(sz) => {
          setPageSize(sz);
          setPage(1);
        }}
        pageSizeOptions={[3, 6, 12, 24]}
      />

      {/* Edit / Create Modal Form */}
      <ProjectFormModal
        isOpen={editingProject !== null}
        project={editingProject}
        isCreatingNew={isCreatingNew}
        onClose={() => setEditingProject(null)}
        onSave={handleSaveModal}
        isSaving={isSaving}
      />

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
