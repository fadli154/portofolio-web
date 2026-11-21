"use client";

import React, { useMemo, useState } from "react";
import {
  Inbox,
  Mail,
  Building,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import type { AdminInquiry } from "@/lib/data/cms-inquiries";
import MagicBento, { type MagicBentoItem } from "@/components/MagicBento";
import { playMechanicalClick } from "@/lib/audio/sound-effects";
import { useAdminToast } from "./AdminToastProvider";
import { AdminConfirmDialog } from "./AdminConfirmDialog";
import { PaginationIconsOnly } from "@/components/ui/PaginationIconsOnly";

interface AdminInquiriesManagerProps {
  inquiries: AdminInquiry[];
  onUpdateStatus: (id: string, status: "unread" | "read" | "replied") => void;
  onDeleteInquiry: (id: string) => void;
}

export function AdminInquiriesManager({
  inquiries,
  onUpdateStatus,
  onDeleteInquiry,
}: AdminInquiriesManagerProps) {
  const { showToast } = useAdminToast();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const totalPages = Math.max(1, Math.ceil(inquiries.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const paginatedInquiries = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return inquiries.slice(start, start + pageSize);
  }, [inquiries, safePage, pageSize]);

  const handleDeleteConfirm = () => {
    if (!deleteTargetId) return;
    const id = deleteTargetId;
    setDeleteTargetId(null);
    playMechanicalClick(650);

    onDeleteInquiry(id);
    showToast({
      title: "Pesan Dihapus",
      description: "Pesan kontak berhasil dihapus dari kotak masuk.",
      variant: "error",
    });
  };

  const handleToggleStatus = (inq: AdminInquiry) => {
    playMechanicalClick(720);
    const nextStatus = inq.status === "unread" ? "read" : inq.status === "read" ? "replied" : "unread";
    onUpdateStatus(inq.id, nextStatus);
    showToast({
      title: "Status Pesan Diperbarui",
      description: `Status diubah menjadi: ${nextStatus.toUpperCase()}`,
      variant: "info",
    });
  };

  // Adaptive MagicBento items in Black, White, #c4e22e
  const bentoItems: MagicBentoItem[] = useMemo(
    () =>
      paginatedInquiries.map((inq) => {
        const isUnread = inq.status === "unread";
        return {
          id: inq.id,
          colSpan: 1,
          rowSpan: 1,
          content: (
            <div className="flex flex-col justify-between h-full w-full">
              <div className="space-y-3">
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#c4e22e]/30 bg-[#c4e22e]/10 text-xs font-mono font-bold text-[#c4e22e]">
                      {inq.senderName.slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <h3 className="font-display text-sm font-bold text-white line-clamp-1">
                        {inq.senderName}
                      </h3>
                      {inq.company && (
                        <p className="font-sans text-[11px] text-white/50 line-clamp-1">{inq.company}</p>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStatus(inq);
                    }}
                    className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold border transition-colors cursor-pointer ${
                      inq.status === "unread"
                        ? "border-[#c4e22e]/40 bg-[#c4e22e]/10 text-[#c4e22e]"
                        : "border-white/20 bg-white/5 text-white/60"
                    }`}
                  >
                    {inq.status.toUpperCase()}
                  </button>
                </div>

                <div className="font-mono text-[11px] text-[#c4e22e]/80 flex items-center gap-1.5">
                  {isUnread && <span className="h-1.5 w-1.5 rounded-full bg-[#c4e22e]" />}
                  {inq.senderEmail}
                </div>

                {/* Message Body */}
                <p className="font-sans text-xs text-white/80 line-clamp-3 bg-black/40 rounded-xl p-3 border border-white/5 italic leading-relaxed">
                  "{inq.message}"
                </p>
              </div>

              {/* Bottom Actions */}
              <div
                className="mt-3 flex items-center justify-between border-t border-white/10 pt-3"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="font-mono text-[10px] text-white/40">{inq.receivedAt}</span>
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${inq.senderEmail}?subject=Re: Kolaborasi Portofolio - Fadli Hifziansyah`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#c4e22e]/30 bg-[#c4e22e]/10 px-2.5 py-1 font-mono text-[11px] font-bold text-[#c4e22e] hover:bg-[#c4e22e]/20 transition-all"
                  >
                    <Mail className="h-3 w-3" />
                    <span>Balas</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setDeleteTargetId(inq.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 font-mono text-[11px] text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          ),
        };
      }),
    [inquiries, paginatedInquiries]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
            Kotak Masuk
          </h2>
          <p className="mt-1 font-sans text-xs sm:text-sm text-white/60">
            Total {inquiries.length} pesan kolaborasi & penawaran proyek.
          </p>
        </div>
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
        rowHeight={290}
        gap={20}
        radius={24}
        items={bentoItems}
      />

      {/* Pagination Controls */}
      <PaginationIconsOnly
        currentPage={safePage}
        pageSize={pageSize}
        totalItems={inquiries.length}
        onPageChange={setPage}
        onPageSizeChange={(sz) => {
          setPageSize(sz);
          setPage(1);
        }}
        pageSizeOptions={[3, 6, 12, 24]}
      />

      <AdminConfirmDialog
        open={deleteTargetId !== null}
        type="delete"
        title="Hapus Pesan Masuk?"
        description="Pesan ini akan dihapus permanen dari kotak masuk pesan penawaran kolaborasi."
        confirmLabel="Ya, Hapus Pesan"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
