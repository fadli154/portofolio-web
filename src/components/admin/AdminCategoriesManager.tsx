"use client";

import React, { useState, useMemo } from "react";
import {
  Tag,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  slugifyCategory,
  type CategoryItem,
  type CategoryScope,
} from "@/lib/data/categories";
import type { ProjectCaseStudy, CertificateItem, ExperienceItem } from "@/data/site";
import { CategoryFormModal } from "@/components/admin/forms/CategoryFormModal";
import { PaginationIconsOnly } from "@/components/ui/PaginationIconsOnly";
import { playMechanicalClick } from "@/lib/audio/sound-effects";

export interface AdminCategoriesManagerProps {
  categories: CategoryItem[];
  projects?: ProjectCaseStudy[];
  certificates?: CertificateItem[];
  experiences?: ExperienceItem[];
  onSaveCategory: (cat: CategoryItem) => Promise<boolean>;
  onDeleteCategory: (id: string) => Promise<boolean>;
}

export function AdminCategoriesManager({
  categories,
  projects = [],
  certificates = [],
  experiences = [],
  onSaveCategory,
  onDeleteCategory,
}: AdminCategoriesManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [scopeFilter, setScopeFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<CategoryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Calculate usage count for each category
  const usageCountMap = useMemo(() => {
    const map: Record<string, number> = {};

    const checkMatch = (val: string, cat: CategoryItem) => {
      return (
        val.toLowerCase().includes(cat.name.toLowerCase()) ||
        slugifyCategory(val) === cat.slug
      );
    };

    for (const cat of categories) {
      let count = 0;
      for (const p of projects) {
        if (checkMatch(p.category, cat)) count++;
      }
      for (const c of certificates) {
        if (checkMatch(c.category, cat)) count++;
      }
      for (const e of experiences) {
        if (checkMatch(e.employmentType, cat)) count++;
      }
      map[cat.id] = count;
    }
    return map;
  }, [categories, projects, certificates, experiences]);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      // Scope filter
      if (scopeFilter !== "all" && cat.scope !== scopeFilter && cat.scope !== "all") {
        return false;
      }
      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        cat.name.toLowerCase().includes(q) ||
        cat.slug.toLowerCase().includes(q) ||
        (cat.description && cat.description.toLowerCase().includes(q))
      );
    });
  }, [categories, scopeFilter, searchQuery]);

  // Safe pagination
  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const paginatedCategories = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredCategories.slice(start, start + pageSize);
  }, [filteredCategories, safePage, pageSize]);

  // Handlers
  const handleOpenCreate = () => {
    playMechanicalClick(750);
    setEditingCategory(null);
    setIsCreatingNew(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    playMechanicalClick(720);
    setEditingCategory(cat);
    setIsCreatingNew(false);
    setIsModalOpen(true);
  };

  const handleSave = async (cat: CategoryItem) => {
    setIsSaving(true);
    try {
      await onSaveCategory(cat);
      setIsModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteExecute = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      playMechanicalClick(800);
      await onDeleteCategory(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#c4e22e]/10 text-[#c4e22e]">
              <Tag className="h-4 w-4" />
            </span>
            <h1 className="font-mono text-lg sm:text-xl font-bold tracking-tight text-white">
              Manajemen Kategori Terpusat
            </h1>
          </div>
          <p className="mt-1 font-mono text-xs text-white/50">
            Kelola kategori dinamis untuk relasi proyek, sertifikat, dan pengalaman ({categories.length} total kategori terdaftar)
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-[#c4e22e] px-4 py-2.5 font-mono text-xs font-bold text-black hover:bg-[#d4f23e] transition-all cursor-pointer shadow-lg shadow-[#c4e22e]/10 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Kategori</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Scope Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "Semua Scope" },
            { id: "projects", label: "Proyek" },
            { id: "certificates", label: "Sertifikat" },
            { id: "experiences", label: "Pengalaman" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                playMechanicalClick(680);
                setScopeFilter(tab.id);
                setPage(1);
              }}
              className={`rounded-xl px-3 py-1.5 font-mono text-xs transition-all cursor-pointer ${
                scopeFilter === tab.id
                  ? "bg-white text-black font-semibold shadow-md"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Cari nama atau slug kategori..."
            className="w-full rounded-xl border border-white/10 bg-white/5 py-1.5 pl-8 pr-3 font-sans text-xs text-white placeholder-white/30 focus:border-[#c4e22e] outline-none"
          />
        </div>
      </div>

      {/* Categories Grid */}
      {paginatedCategories.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-[#0e1014] p-12 text-center">
          <Tag className="mx-auto h-8 w-8 text-white/20 mb-3" />
          <h3 className="font-mono text-sm font-semibold text-white">
            Tidak ada kategori ditemukan
          </h3>
          <p className="mt-1 font-mono text-xs text-white/40">
            Coba ubah kata kunci pencarian atau buat kategori baru
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedCategories.map((cat) => {
            const usage = usageCountMap[cat.id] || 0;
            return (
              <div
                key={cat.id || cat.slug}
                className="group relative rounded-2xl border border-white/10 bg-[#0c0d12] p-4 transition-all hover:border-white/25 hover:shadow-xl hover:shadow-black/60 flex flex-col justify-between"
              >
                <div>
                  {/* Card Top: Pill & Scope */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono border"
                      style={{
                        backgroundColor: `${cat.colorHex}18`,
                        borderColor: `${cat.colorHex}40`,
                        color: cat.colorHex,
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: cat.colorHex }}
                      />
                      <span className="font-semibold">{cat.name}</span>
                    </div>

                    <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/5">
                      {cat.scope}
                    </span>
                  </div>

                  {/* Slug & Description */}
                  <div className="space-y-1 mb-3">
                    <p className="font-mono text-[11px] text-white/40">
                      slug: <span className="text-white/70">{cat.slug}</span>
                    </p>
                    {cat.description && (
                      <p className="font-sans text-xs text-white/60 line-clamp-2">
                        {cat.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Bottom: Usage Badge & Action Buttons */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2 mt-auto">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-white/50">
                    <Layers className="h-3 w-3 text-[#c4e22e]" />
                    <span>
                      {usage > 0 ? (
                        <span className="text-[#c4e22e] font-semibold">{usage} relasi aktif</span>
                      ) : (
                        <span>Belum dipakai</span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-white/70 hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
                      title="Edit Kategori"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playMechanicalClick(650);
                        setDeleteTarget(cat);
                      }}
                      className="p-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-colors cursor-pointer"
                      title="Hapus Kategori"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sticky Bottom Pagination Dock */}
      <PaginationIconsOnly
        currentPage={safePage}
        pageSize={pageSize}
        totalItems={filteredCategories.length}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(sz) => {
          setPageSize(sz);
          setPage(1);
        }}
      />

      {/* Category Form Modal */}
      <CategoryFormModal
        isOpen={isModalOpen}
        category={editingCategory}
        isCreatingNew={isCreatingNew}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        isSaving={isSaving}
      />

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/15 bg-[#121318] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="h-6 w-6" />
              <h3 className="font-mono text-sm font-bold text-white">
                Konfirmasi Hapus Kategori
              </h3>
            </div>
            <p className="font-sans text-xs text-white/70">
              Apakah Anda yakin ingin menghapus kategori{" "}
              <strong className="text-white">"{deleteTarget.name}"</strong>?
              {usageCountMap[deleteTarget.id] > 0 && (
                <span className="block mt-1 text-amber-300 font-mono text-[11px]">
                  ⚠️ Kategori ini saat ini sedang digunakan oleh {usageCountMap[deleteTarget.id]} entitas.
                </span>
              )}
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-white/10 px-4 py-2 font-mono text-xs text-white/70 hover:bg-white/5 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteExecute}
                className="rounded-xl bg-rose-500 px-4 py-2 font-mono text-xs font-bold text-white hover:bg-rose-600 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
