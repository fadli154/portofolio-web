"use client";

import React from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { playMechanicalClick } from "@/lib/audio/sound-effects";

export interface PaginationIconsOnlyProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
  label?: string;
}

export function PaginationIconsOnly({
  currentPage = 1,
  pageSize = 6,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [6, 12, 25, 50],
  className,
  label = "Baris per halaman",
}: PaginationIconsOnlyProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const hasPrev = safeCurrentPage > 1;
  const hasNext = safeCurrentPage < totalPages;

  // Auto-sync if currentPage exceeds totalPages
  React.useEffect(() => {
    if (currentPage > totalPages) {
      onPageChange(totalPages);
    }
  }, [currentPage, totalPages, onPageChange]);

  const startIdx = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endIdx = Math.min(totalItems, safeCurrentPage * pageSize);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!hasPrev) return;
    playMechanicalClick(650);
    onPageChange(safeCurrentPage - 1);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!hasNext) return;
    playMechanicalClick(720);
    onPageChange(safeCurrentPage + 1);
  };

  const handlePageSizeChange = (val: string | null) => {
    if (!val) return;
    const size = parseInt(val, 10);
    if (!isNaN(size) && onPageSizeChange) {
      playMechanicalClick(750);
      onPageSizeChange(size);
    }
  };

  return (
    <div
      className={cn(
        "sticky bottom-3 sm:bottom-4 z-30 mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 py-3 px-3.5 sm:px-5 rounded-2xl border border-white/15 bg-[#0c0d12]/90 backdrop-blur-xl shadow-2xl shadow-black/80 transition-all",
        className
      )}
    >
      {/* 1. Rows Per Page Selector using Shadcn Field & Select */}
      <div className="flex items-center gap-3">
        <Field orientation="horizontal" className="w-fit flex items-center gap-2">
          <FieldLabel
            htmlFor="select-rows-per-page"
            className="font-mono text-xs text-white/50 whitespace-nowrap cursor-pointer"
          >
            {label}
          </FieldLabel>
          <Select
            value={String(pageSize)}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger
              className="w-20 h-8 rounded-xl border-white/15 bg-white/5 text-xs text-white focus:border-[#c4e22e] cursor-pointer"
              id="select-rows-per-page"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start" className="bg-[#12141a] border-white/15 text-white">
              <SelectGroup>
                {pageSizeOptions.map((opt) => (
                  <SelectItem
                    key={opt}
                    value={String(opt)}
                    className="text-xs text-white/80 focus:bg-[#c4e22e]/15 focus:text-[#c4e22e] cursor-pointer"
                  >
                    {opt}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        {/* Counter Summary */}
        <span className="font-mono text-[11px] text-white/40 hidden md:inline">
          {totalItems > 0
            ? `${startIdx}–${endIdx} dari ${totalItems} data`
            : "Tidak ada data"}
        </span>
      </div>

      {/* 2. Pagination Nav (Numbered Buttons + Prev/Next Icons) */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-white/60 hidden lg:inline">
          Halaman <strong className="text-white">{safeCurrentPage}</strong> dari{" "}
          <strong className="text-white">{totalPages}</strong>
        </span>

        <Pagination className="mx-0 w-auto">
          <PaginationContent className="gap-1.5">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={handlePrev}
                className={cn(
                  "h-8 px-2.5 rounded-xl border border-white/10 text-xs transition-all cursor-pointer select-none",
                  hasPrev
                    ? "text-white/80 hover:bg-white/10 hover:text-white hover:border-[#c4e22e]/40"
                    : "text-white/20 pointer-events-none opacity-40 border-transparent"
                )}
              />
            </PaginationItem>

            {/* Direct Page Number Buttons */}
            {totalPages > 1 &&
              Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      if (p === safeCurrentPage) return;
                      playMechanicalClick(700);
                      onPageChange(p);
                    }}
                    className={cn(
                      "h-8 min-w-8 px-2.5 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center select-none",
                      p === safeCurrentPage
                        ? "border-[#c4e22e] bg-[#c4e22e]/15 text-[#c4e22e] shadow-sm shadow-[#c4e22e]/20"
                        : "border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/20 hover:bg-white/10"
                    )}
                    aria-label={`Halaman ${p}`}
                    aria-current={p === safeCurrentPage ? "page" : undefined}
                  >
                    {p}
                  </button>
                </PaginationItem>
              ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={handleNext}
                className={cn(
                  "h-8 px-2.5 rounded-xl border border-white/10 text-xs transition-all cursor-pointer select-none",
                  hasNext
                    ? "text-white/80 hover:bg-white/10 hover:text-white hover:border-[#c4e22e]/40"
                    : "text-white/20 pointer-events-none opacity-40 border-transparent"
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export default PaginationIconsOnly;
