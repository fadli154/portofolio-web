"use client";

import React, { useMemo, useState } from "react";
import {
  BookOpen,
  Image as ImageIcon,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
  ExternalLink,
} from "lucide-react";
import type { KwuSessionItem } from "@/data/site";
import MagicBento, { type MagicBentoItem } from "@/components/MagicBento";
import { playMechanicalClick } from "@/lib/audio/sound-effects";
import { useAdminToast } from "./AdminToastProvider";
import { AdminConfirmDialog } from "./AdminConfirmDialog";

interface AdminCourseworkManagerProps {
  sessions: KwuSessionItem[];
  onSaveSession: (session: KwuSessionItem) => Promise<boolean>;
  onDeleteSession: (sessionNumber: number) => Promise<boolean>;
}

export function AdminCourseworkManager({
  sessions,
  onSaveSession,
  onDeleteSession,
}: AdminCourseworkManagerProps) {
  const { showToast } = useAdminToast();
  const [editingSession, setEditingSession] = useState<KwuSessionItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [deleteTargetNumber, setDeleteTargetNumber] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenEdit = (session: KwuSessionItem) => {
    playMechanicalClick(720);
    setEditingSession({ ...session });
    setIsCreatingNew(false);
  };

  const handleOpenNew = () => {
    playMechanicalClick(750);
    const nextNumber = sessions.length > 0 ? Math.max(...sessions.map((s) => s.number)) + 1 : 1;
    setEditingSession({
      number: nextNumber,
      code: `KWU-${String(nextNumber).padStart(2, "0")}`,
      titleId: `Pertemuan ${nextNumber} - Sesi Perkuliahan Baru`,
      titleEn: `Session ${nextNumber} - New Lecture Session`,
      descId: "Membahas progres proyek kewirausahaan dan implementasi platform digital.",
      descEn: "Discussing entrepreneurship project progress and digital platform implementation.",
      sessionDate: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      attendanceStatus: "Hadir",
      attendanceProofUrl: `/coursework/proof-session-${nextNumber}.png`,
      taskTitle: `Tugas Pertemuan ${nextNumber}`,
      taskDescription: "Rincian tugas mingguan dan dokumentasi implementasi.",
      taskUrl: "https://sites.google.com/view/rekappertemuank-1",
      taskStatus: "Selesai",
    });
    setIsCreatingNew(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession) return;
    setIsSaving(true);
    playMechanicalClick(780);

    const success = await onSaveSession(editingSession);
    setIsSaving(false);

    showToast({
      title: isCreatingNew ? "Sesi Berhasil Ditambahkan" : "Perubahan Disimpan",
      description: `Pertemuan ${editingSession.number} berhasil disinkronisasi ke Supabase & CMS.`,
      variant: success ? "success" : "info",
    });
    setEditingSession(null);
    setIsCreatingNew(false);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetNumber === null) return;
    const num = deleteTargetNumber;
    setDeleteTargetNumber(null);
    playMechanicalClick(650);

    await onDeleteSession(num);
    showToast({
      title: "Pertemuan Dihapus",
      description: `Sesi perkuliahan Pertemuan ${num} berhasil dihapus dari sistem.`,
      variant: "error",
    });
  };

  // Adaptive MagicBento items matching the 3-color palette (Black, White, #c4e22e)
  const bentoItems: MagicBentoItem[] = useMemo(
    () =>
      sessions.map((s) => ({
        id: s.number,
        colSpan: 1,
        rowSpan: 1,
        onClick: () => handleOpenEdit(s),
        content: (
          <div className="flex flex-col justify-between h-full w-full">
            <div className="space-y-3">
              {/* Header Badges */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c4e22e]/30 bg-[#c4e22e]/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#c4e22e]">
                  {s.code || `KWU-${s.number}`} · {s.attendanceStatus || "Hadir"} ✓
                </span>
                <span className="font-mono text-xs text-white/50">{s.sessionDate || "Sesi Kuliah"}</span>
              </div>

              {/* Direct Photo Preview of Attendance Proof */}
              <div className="relative w-full h-36 rounded-xl overflow-hidden border border-white/10 bg-black/60 group admin-idle-folder-tab">
                <img
                  src={s.attendanceProofUrl || `/coursework/proof-session-${s.number}.png`}
                  alt={s.titleId}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/og.svg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-2 left-2 rounded-md bg-black/75 backdrop-blur-sm px-2 py-0.5 font-mono text-[10px] text-white/80 border border-white/10">
                  {s.taskStatus || "Tugas Selesai"}
                </span>
              </div>

              {/* Concise Typography */}
              <div>
                <h3 className="font-display text-sm font-bold text-white line-clamp-1 leading-snug">
                  {s.titleId}
                </h3>
                <p className="mt-0.5 font-sans text-xs text-white/50 line-clamp-1">
                  {s.taskTitle || "Absensi & Tugas Terkelola"}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div
              className="mt-3 flex items-center justify-between border-t border-white/10 pt-3"
              onClick={(e) => e.stopPropagation()}
            >
              {s.taskUrl ? (
                <a
                  href={s.taskUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-[11px] text-white/50 hover:text-[#c4e22e] transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Dokumen</span>
                </a>
              ) : <div />}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(s)}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-white/80 hover:bg-white/15 hover:text-white transition-all cursor-pointer"
                >
                  <Pencil className="h-3 w-3" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTargetNumber(s.number)}
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
    [sessions]
  );

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
            Kuliah & Absensi (K-1)
          </h2>
          <p className="mt-1 font-sans text-xs sm:text-sm text-white/60">
            Total {sessions.length} sesi perkuliahan terdata di Supabase PostgreSQL.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenNew}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c4e22e] px-4 py-2.5 font-mono text-xs font-bold text-[#111213] shadow-lg shadow-[#c4e22e]/20 hover:bg-[#d6f53b] transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Pertemuan</span>
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
      {editingSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/15 bg-[#0e1014] p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#c4e22e]" />
                <h3 className="font-display text-lg font-bold text-white">
                  {isCreatingNew ? "Tambah Sesi Pertemuan Baru" : `Edit Pertemuan ${editingSession.number}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingSession(null)}
                className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-mono text-[11px] text-white/60 mb-1">Nomor Sesi</label>
                  <input
                    type="number"
                    value={editingSession.number}
                    onChange={(e) =>
                      setEditingSession({ ...editingSession, number: parseInt(e.target.value) || 1 })
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white focus:border-[#c4e22e] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] text-white/60 mb-1">Kode Sesi</label>
                  <input
                    type="text"
                    value={editingSession.code}
                    onChange={(e) => setEditingSession({ ...editingSession, code: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white focus:border-[#c4e22e] outline-none"
                    placeholder="KWU-11"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] text-white/60 mb-1">Status Kehadiran</label>
                  <select
                    value={editingSession.attendanceStatus}
                    onChange={(e) =>
                      setEditingSession({
                        ...editingSession,
                        attendanceStatus: e.target.value as "Hadir" | "Izin" | "Sakit" | "Belum Dimulai",
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#16171d] px-3 py-2 font-mono text-xs text-white focus:border-[#c4e22e] outline-none"
                  >
                    <option value="Hadir">Hadir ✓</option>
                    <option value="Izin">Izin</option>
                    <option value="Sakit">Sakit</option>
                    <option value="Belum Dimulai">Belum Dimulai</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] text-white/60 mb-1">Judul Pertemuan (ID)</label>
                <input
                  type="text"
                  value={editingSession.titleId}
                  onChange={(e) => setEditingSession({ ...editingSession, titleId: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] text-white/60 mb-1">Deskripsi Pertemuan (ID)</label>
                <textarea
                  value={editingSession.descId}
                  onChange={(e) => setEditingSession({ ...editingSession, descId: e.target.value })}
                  rows={2}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[11px] text-white/60 mb-1">URL Bukti Kehadiran / Foto</label>
                  <input
                    type="text"
                    value={editingSession.attendanceProofUrl || ""}
                    onChange={(e) =>
                      setEditingSession({ ...editingSession, attendanceProofUrl: e.target.value })
                    }
                    placeholder="/coursework/proof-session-11.png"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white focus:border-[#c4e22e] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] text-white/60 mb-1">Status Pengerjaan Tugas</label>
                  <select
                    value={editingSession.taskStatus}
                    onChange={(e) =>
                      setEditingSession({
                        ...editingSession,
                        taskStatus: e.target.value as "Selesai" | "Proses" | "Belum Ada Tugas",
                      })
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#16171d] px-3 py-2 font-mono text-xs text-white focus:border-[#c4e22e] outline-none"
                  >
                    <option value="Selesai">Selesai ✓</option>
                    <option value="Proses">Dalam Pengerjaan</option>
                    <option value="Belum Ada Tugas">Belum Ada Tugas</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[11px] text-white/60 mb-1">Judul Tugas</label>
                  <input
                    type="text"
                    value={editingSession.taskTitle || ""}
                    onChange={(e) => setEditingSession({ ...editingSession, taskTitle: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] text-white/60 mb-1">Tautan Tugas / Google Sites / Docs</label>
                  <input
                    type="text"
                    value={editingSession.taskUrl || ""}
                    onChange={(e) => setEditingSession({ ...editingSession, taskUrl: e.target.value })}
                    placeholder="https://sites.google.com/..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-white focus:border-[#c4e22e] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] text-white/60 mb-1">Rincian / Catatan Tugas</label>
                <textarea
                  value={editingSession.taskDescription || ""}
                  onChange={(e) =>
                    setEditingSession({ ...editingSession, taskDescription: e.target.value })
                  }
                  rows={2}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-xs text-white focus:border-[#c4e22e] outline-none"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingSession(null)}
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
                  <span>{isSaving ? "Menyimpan..." : "Simpan Sesi ke Supabase"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation SweetAlert Modal */}
      <AdminConfirmDialog
        open={deleteTargetNumber !== null}
        type="delete"
        title={`Hapus Pertemuan ${deleteTargetNumber}?`}
        description="Data log absensi, tautan tugas, dan dokumentasi sesi ini akan dihapus permanen dari Supabase dan CMS."
        confirmLabel="Ya, Hapus Sesi Ini"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetNumber(null)}
      />
    </div>
  );
}
