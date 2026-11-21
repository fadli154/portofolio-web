"use client";

import React, { useMemo, useState } from "react";
import {
  Award,
  ExternalLink,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
  CheckCircle2,
} from "lucide-react";
import type { CertificateItem } from "@/data/site";
import MagicBento, { type MagicBentoItem } from "@/components/MagicBento";
import { playMechanicalClick } from "@/lib/audio/sound-effects";
import { useAdminToast } from "./AdminToastProvider";
import { AdminConfirmDialog } from "./AdminConfirmDialog";

interface AdminCertificatesManagerProps {
  certificates: CertificateItem[];
  onSaveCertificate: (cert: CertificateItem) => Promise<boolean>;
  onDeleteCertificate: (id: string) => Promise<boolean>;
}

export function AdminCertificatesManager({
  certificates,
  onSaveCertificate,
  onDeleteCertificate,
}: AdminCertificatesManagerProps) {
  const { showToast } = useAdminToast();
  const [editingCert, setEditingCert] = useState<CertificateItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenEdit = (cert: CertificateItem) => {
    playMechanicalClick(720);
    setEditingCert({ ...cert });
    setIsCreatingNew(false);
  };

  const handleOpenNew = () => {
    playMechanicalClick(750);
    const nextOrder = certificates.length > 0 ? Math.max(...certificates.map((c) => c.sortOrder)) + 1 : 1;
    setEditingCert({
      id: `cert-${Date.now().toString().slice(-4)}`,
      title: "Sertifikasi Kompetensi Baru",
      issuer: "Kementerian / Lembaga Sertifikasi",
      issueDate: "2026",
      credentialId: `REG-${Date.now().toString().slice(-6)}`,
      category: "Kompetensi",
      imageUrl: "/certificates/default-cert.png",
      fileUrl: "/certificates/default-cert.pdf",
      verifyUrl: "https://kemenag.go.id",
      summaryId: "Sertifikasi resmi keahlian teknologi dan rekayasa perangkat lunak.",
      summaryEn: "Official technical engineering competency credential.",
      sortOrder: nextOrder,
      isVisible: true,
    });
    setIsCreatingNew(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;
    setIsSaving(true);
    playMechanicalClick(780);

    const success = await onSaveCertificate(editingCert);
    setIsSaving(false);

    showToast({
      title: isCreatingNew ? "Sertifikat Ditambahkan" : "Perubahan Disimpan",
      description: `Kredensial "${editingCert.title}" berhasil diperbarui.`,
      variant: success ? "success" : "info",
    });
    setEditingCert(null);
    setIsCreatingNew(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    const target = certificates.find((c) => c.id === deleteTargetId);
    const id = deleteTargetId;
    setDeleteTargetId(null);
    playMechanicalClick(650);

    await onDeleteCertificate(id);
    showToast({
      title: "Sertifikat Dihapus",
      description: `Sertifikat "${target?.title || id}" telah dihapus dari sistem.`,
      variant: "error",
    });
  };

  // Adaptive MagicBento items in Black, White, #c4e22e
  const bentoItems: MagicBentoItem[] = useMemo(
    () =>
      certificates.map((cert) => ({
        id: cert.id,
        colSpan: 1,
        rowSpan: 1,
        onClick: () => handleOpenEdit(cert),
        content: (
          <div className="flex flex-col justify-between h-full w-full">
            <div className="space-y-3">
              {/* Header Badges */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c4e22e]/30 bg-[#c4e22e]/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#c4e22e]">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>{cert.category || "Prestasi"}</span>
                </span>
                <span className="font-mono text-xs text-white/50">{cert.issueDate}</span>
              </div>

              {/* Direct Photo Preview */}
              <div className="relative w-full h-36 rounded-xl overflow-hidden border border-white/10 bg-black/60 group">
                <img
                  src={cert.imageUrl || "/sertif/oase-juara-2-lit.webp"}
                  alt={cert.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/sertif/oase-juara-2-lit.webp";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-2 left-2 rounded-md bg-black/75 backdrop-blur-sm px-2 py-0.5 font-mono text-[10px] text-white/80 border border-white/10">
                  {cert.issuer}
                </span>
              </div>

              {/* Concise Typography */}
              <div>
                <h3 className="font-display text-sm font-bold text-white line-clamp-1 leading-snug">
                  {cert.title}
                </h3>
                {cert.credentialId ? (
                  <p className="mt-0.5 font-mono text-[10px] text-white/40 truncate">
                    ID: {cert.credentialId}
                  </p>
                ) : (
                  <p className="mt-0.5 font-sans text-xs text-white/50 line-clamp-1">
                    {cert.summaryId || cert.issuer}
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div
              className="mt-3 flex items-center justify-between border-t border-white/10 pt-3"
              onClick={(e) => e.stopPropagation()}
            >
              {cert.verifyUrl ? (
                <a
                  href={cert.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-[11px] text-white/50 hover:text-[#c4e22e] transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Verifikasi</span>
                </a>
              ) : <div />}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(cert)}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-white/80 hover:bg-white/15 hover:text-white transition-all cursor-pointer"
                >
                  <Pencil className="h-3 w-3" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTargetId(cert.id)}
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
    [certificates]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
            Sertifikat & Prestasi
          </h2>
          <p className="mt-1 font-sans text-xs sm:text-sm text-white/60">
            Total {certificates.length} sertifikat & piagam penghargaan terkelola.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenNew}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c4e22e] px-4 py-2.5 font-mono text-xs font-bold text-[#111213] shadow-lg shadow-[#c4e22e]/20 hover:bg-[#d6f53b] transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Sertifikat</span>
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
      {editingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/15 bg-[#0e1014] p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-[#c4e22e]" />
                <h3 className="font-display text-lg font-bold text-white">
                  {isCreatingNew ? "Tambah Sertifikat Baru" : `Edit: ${editingCert.title}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingCert(null)}
                className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div>
                <label className="block font-mono text-[11px] text-white/60 mb-1">Nama Sertifikat / Piagam</label>
                <input
                  type="text"
                  value={editingCert.title}
                  onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[11px] text-white/60 mb-1">Lembaga Penerbit</label>
                  <input
                    type="text"
                    value={editingCert.issuer}
                    onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
                    placeholder="Kementerian Agama RI / BNSP"
                    required
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] text-white/60 mb-1">Tahun / Tanggal Terbit</label>
                  <input
                    type="text"
                    value={editingCert.issueDate}
                    onChange={(e) => setEditingCert({ ...editingCert, issueDate: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white focus:border-[#c4e22e] outline-none"
                    placeholder="7 November 2026"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[11px] text-white/60 mb-1">Nomor Kredensial / Registrasi</label>
                  <input
                    type="text"
                    value={editingCert.credentialId || ""}
                    onChange={(e) => setEditingCert({ ...editingCert, credentialId: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white focus:border-[#c4e22e] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] text-white/60 mb-1">Kategori Penghargaan</label>
                  <input
                    type="text"
                    value={editingCert.category}
                    onChange={(e) => setEditingCert({ ...editingCert, category: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
                    placeholder="Prestasi Nasional / Sertifikasi Profesi"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] text-white/60 mb-1">Ringkasan Pencapaian (ID)</label>
                <textarea
                  value={editingCert.summaryId}
                  onChange={(e) => setEditingCert({ ...editingCert, summaryId: e.target.value })}
                  rows={2}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[11px] text-white/60 mb-1">URL Gambar Sertifikat</label>
                  <input
                    type="text"
                    value={editingCert.imageUrl || ""}
                    onChange={(e) => setEditingCert({ ...editingCert, imageUrl: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white focus:border-[#c4e22e] outline-none"
                    placeholder="/certificates/cert-oase.png"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] text-white/60 mb-1">Tautan Verifikasi Resmi</label>
                  <input
                    type="text"
                    value={editingCert.verifyUrl || ""}
                    onChange={(e) => setEditingCert({ ...editingCert, verifyUrl: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white focus:border-[#c4e22e] outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingCert(null)}
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
                  <span>{isSaving ? "Menyimpan..." : "Simpan Kredensial"}</span>
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
        title="Hapus Sertifikat Ini?"
        description="Sertifikat akan dihapus permanen dari portofolio dan katalog kredensial resmi."
        confirmLabel="Ya, Hapus Sertifikat"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
