"use client";

import React, { useState, useRef } from "react";
import { IconCloud } from "@tabler/icons-react";
import {
  Image as ImageIcon,
  X,
  RefreshCw,
  Link as LinkIcon,
  Check,
  Eye,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import { playMechanicalClick } from "@/lib/audio/sound-effects";

export interface ImageUploadPreviewProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  helperText?: string;
  placeholder?: string;
  aspectRatio?: "video" | "square" | "landscape" | "auto";
}

export function ImageUploadPreview({
  label,
  value,
  onChange,
  helperText = "Mendukung format PNG, JPG, WebP, dan SVG (Maksimal 5MB)",
  placeholder = "https://example.com/image.png atau pilih file",
  aspectRatio = "video",
}: ImageUploadPreviewProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [activeMode, setActiveMode] = useState<"file" | "url">("file");
  const [previewError, setPreviewError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    playMechanicalClick(750);
    setPreviewError(false);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onChange(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  };

  const handleClear = () => {
    playMechanicalClick(650);
    onChange("");
    setPreviewError(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const aspectClass =
    aspectRatio === "video"
      ? "aspect-video"
      : aspectRatio === "square"
      ? "aspect-square"
      : "aspect-[16/10]";

  return (
    <div className="space-y-2">
      {/* Label & Mode Switch */}
      <div className="flex items-center justify-between">
        <label className="block font-mono text-[11px] font-semibold text-white/70">
          {label}
        </label>
        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-0.5">
          <button
            type="button"
            onClick={() => {
              playMechanicalClick(680);
              setActiveMode("file");
            }}
            className={`flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[10px] transition-colors cursor-pointer ${
              activeMode === "file"
                ? "bg-[#c4e22e] text-[#111213] font-bold shadow-sm"
                : "text-white/60 hover:text-white"
            }`}
          >
            <UploadCloud className="h-3 w-3" />
            <span>Pilih Berkas</span>
          </button>
          <button
            type="button"
            onClick={() => {
              playMechanicalClick(680);
              setActiveMode("url");
            }}
            className={`flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[10px] transition-colors cursor-pointer ${
              activeMode === "url"
                ? "bg-[#c4e22e] text-[#111213] font-bold shadow-sm"
                : "text-white/60 hover:text-white"
            }`}
          >
            <LinkIcon className="h-3 w-3" />
            <span>URL Tautan</span>
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload berkas gambar"
      />

      {/* Active Preview Card if Value Exists */}
      {value ? (
        <div className="relative rounded-2xl border border-white/15 bg-black/60 p-3 overflow-hidden group">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            {/* Thumbnail */}
            <div
              className={`relative ${aspectClass} w-full sm:w-44 shrink-0 rounded-xl overflow-hidden border border-white/10 bg-[#0d0e12] flex items-center justify-center`}
            >
              {!previewError ? (
                <img
                  src={value}
                  alt={label}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  onError={() => setPreviewError(true)}
                />
              ) : (
                <div className="flex flex-col items-center gap-1 text-white/40 p-2 text-center">
                  <ImageIcon className="h-6 w-6 text-rose-400" />
                  <span className="font-mono text-[10px] text-rose-400">
                    Gagal memuat URL
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <span className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[9px] text-[#c4e22e] border border-white/10">
                <Check className="h-2.5 w-2.5" />
                <span>Pratinjau Aktif</span>
              </span>
            </div>

            {/* Details & Actions */}
            <div className="flex-1 w-full flex flex-col justify-between py-1 space-y-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] text-white/50">
                    <Eye className="h-3 w-3 text-[#c4e22e]" />
                    <span>Sumber Gambar Terpilih</span>
                  </span>
                </div>
                <div className="mt-1 font-mono text-xs text-white/80 break-all line-clamp-2 bg-white/5 p-2 rounded-lg border border-white/5">
                  {value.startsWith("data:")
                    ? "Berkas Lokal (Base64 Encoded Image)"
                    : value}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-8 rounded-lg border-white/15 bg-white/5 font-mono text-[11px] text-white hover:bg-white/15 hover:border-[#c4e22e]/40 transition-all cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  <span>Ganti Foto</span>
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleClear}
                  className="h-8 rounded-lg border border-rose-500/20 bg-rose-500/10 font-mono text-[11px] text-rose-300 hover:bg-rose-500/20 transition-all cursor-pointer"
                >
                  <X className="h-3 w-3 mr-1" />
                  <span>Hapus</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : activeMode === "file" ? (
        /* Shadcn Empty Component for Upload File / Drag & Drop */
        <Empty
          className={cn(
            "border border-dashed rounded-2xl transition-all cursor-pointer py-6 px-4 bg-white/[0.02]",
            isDragging
              ? "border-[#c4e22e] bg-[#c4e22e]/10 scale-[1.01]"
              : "border-white/15 hover:border-white/30 hover:bg-white/[0.04]"
          )}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <EmptyHeader>
            <EmptyMedia
              variant="icon"
              className="size-10 rounded-xl border border-white/10 bg-white/5 text-[#c4e22e] mb-1 shadow-sm"
            >
              <IconCloud className="size-5" />
            </EmptyMedia>
            <EmptyTitle className="font-sans text-xs font-bold text-white tracking-tight">
              Unggah & Pratinjau Berkas Foto
            </EmptyTitle>
            <EmptyDescription className="font-mono text-[11px] text-white/50 max-w-xs">
              Tarik & lepas foto portofolio ke sini, atau klik tombol untuk memilih berkas dari perangkat.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="h-8 rounded-xl border-white/15 bg-white/5 text-xs font-mono font-medium text-white hover:bg-[#c4e22e]/15 hover:text-[#c4e22e] hover:border-[#c4e22e]/40 transition-all cursor-pointer"
            >
              <IconCloud className="size-3.5 mr-1.5 text-[#c4e22e]" />
              Pilih Berkas Foto
            </Button>
            <p className="font-mono text-[10px] text-white/30 mt-0.5">
              {helperText}
            </p>
          </EmptyContent>
        </Empty>
      ) : (
        /* Manual URL Input Field */
        <div className="space-y-1.5">
          <div className="relative">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 py-2.5 font-mono text-xs text-white placeholder:text-white/30 focus:border-[#c4e22e] outline-none"
            />
            <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-white/40" />
          </div>
          <p className="font-mono text-[10px] text-white/40">{helperText}</p>
        </div>
      )}
    </div>
  );
}

export default ImageUploadPreview;
