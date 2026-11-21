"use client";

import React, { useEffect } from "react";
import { AlertTriangle, LogOut, Trash2, X } from "lucide-react";
import { playMechanicalClick } from "@/lib/audio/sound-effects";

export type ConfirmType = "logout" | "delete" | "action";

interface AdminConfirmDialogProps {
  open: boolean;
  type?: ConfirmType;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AdminConfirmDialog({
  open,
  type = "delete",
  title,
  description,
  confirmLabel,
  cancelLabel = "Batalkan",
  loading = false,
  onConfirm,
  onCancel,
}: AdminConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, loading, onCancel]);

  if (!open) return null;

  const isLogout = type === "logout";
  const defaultConfirmLabel = isLogout ? "Ya, Keluar Sesi" : "Ya, Hapus Data";

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-200"
      onClick={() => {
        if (!loading) {
          playMechanicalClick(640);
          onCancel();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/15 bg-[#14151a] p-6 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient */}
        <div
          className={`pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl opacity-20 ${
            isLogout ? "bg-[#c4e22e]" : "bg-rose-500"
          }`}
        />

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
                isLogout
                  ? "border-[#c4e22e]/30 bg-[#c4e22e]/10 text-[#c4e22e]"
                  : "border-rose-500/30 bg-rose-500/10 text-rose-400"
              }`}
            >
              {isLogout ? (
                <LogOut className="h-5 w-5" />
              ) : type === "delete" ? (
                <Trash2 className="h-5 w-5" />
              ) : (
                <AlertTriangle className="h-5 w-5" />
              )}
            </div>
            <div>
              <span className="font-mono text-[10px] font-semibold tracking-wider uppercase text-white/50">
                {isLogout ? "Keamanan Autentikasi" : "Tindakan Permanen"}
              </span>
              <h3 className="font-display text-lg font-bold text-white">
                {title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              playMechanicalClick(640);
              onCancel();
            }}
            disabled={loading}
            className="rounded-lg p-1.5 text-white/40 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-3 font-sans text-xs sm:text-sm leading-relaxed text-white/70">
          {description}
        </p>

        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
          <button
            type="button"
            onClick={() => {
              playMechanicalClick(640);
              onCancel();
            }}
            disabled={loading}
            className="w-full sm:w-auto rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-xs font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              playMechanicalClick(780);
              onConfirm();
            }}
            disabled={loading}
            className={`w-full sm:w-auto inline-flex items-center justify-center rounded-xl px-4 py-2.5 font-mono text-xs font-bold transition-all disabled:opacity-50 ${
              isLogout
                ? "bg-[#c4e22e] text-[#111213] hover:bg-[#d6f53b] shadow-lg shadow-[#c4e22e]/20"
                : "bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white shadow-lg shadow-rose-500/20"
            }`}
          >
            {loading ? "Memproses..." : confirmLabel || defaultConfirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
