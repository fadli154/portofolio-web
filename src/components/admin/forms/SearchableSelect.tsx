"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check, X, Plus } from "lucide-react";
import { playMechanicalClick } from "@/lib/audio/sound-effects";

export interface SearchableSelectOption {
  value: string;
  label: string;
  badge?: string;
}

export interface SearchableSelectProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: (string | SearchableSelectOption)[];
  placeholder?: string;
  allowCustom?: boolean;
  required?: boolean;
  helperText?: string;
}

export function SearchableSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Pilih opsi...",
  allowCustom = true,
  required = false,
  helperText,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Normalize options
  const normalizedOptions: SearchableSelectOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  // Filter based on query
  const filteredOptions = normalizedOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opt.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value) || {
    value,
    label: value || placeholder,
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    playMechanicalClick(720);
    onChange(val);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleCreateCustom = () => {
    if (!searchQuery.trim()) return;
    playMechanicalClick(750);
    onChange(searchQuery.trim());
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div ref={containerRef} className={`relative space-y-1 ${isOpen ? "z-40" : "z-10"}`}>
      <label className="block font-mono text-[11px] font-semibold text-white/70">
        {label} {required && <span className="text-rose-400">*</span>}
      </label>

      {/* Main Trigger Button */}
      <button
        type="button"
        onClick={() => {
          playMechanicalClick(680);
          setIsOpen(!isOpen);
          if (!isOpen) {
            setTimeout(() => searchInputRef.current?.focus(), 50);
          }
        }}
        className={`w-full flex items-center justify-between rounded-xl border px-3 py-2.5 font-sans text-xs transition-colors cursor-pointer ${
          isOpen
            ? "border-[#c4e22e] bg-[#16171d] shadow-lg shadow-[#c4e22e]/5"
            : "border-white/10 bg-white/5 hover:border-white/20 text-white"
        }`}
      >
        <span className={value ? "text-white font-medium truncate" : "text-white/40"}>
          {selectedOption.label}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-white/50 transition-transform duration-200 shrink-0 ml-2 ${
            isOpen ? "rotate-180 text-[#c4e22e]" : ""
          }`}
        />
      </button>

      {/* Floating Searchable Popover Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-2xl border border-white/15 bg-[#0e1014] p-2 shadow-2xl backdrop-blur-2xl">
          {/* Search Input Box */}
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-white/40" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari atau filter opsi..."
              className="w-full rounded-lg border border-white/10 bg-black/60 pl-8 pr-7 py-1.5 font-sans text-xs text-white placeholder:text-white/30 focus:border-[#c4e22e] outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-2 p-0.5 text-white/40 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Option List */}
          <div
            data-lenis-prevent="true"
            data-admin-scroll="true"
            className="max-h-56 overflow-y-auto overscroll-contain admin-modal-scroll space-y-0.5 pr-1.5"
            onWheel={(e) => e.stopPropagation()}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-left font-sans text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#c4e22e]/15 text-[#c4e22e] font-semibold border border-[#c4e22e]/30"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="truncate pr-2">{opt.label}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-[#c4e22e]" />}
                  </button>
                );
              })
            ) : allowCustom && searchQuery.trim() ? (
              <button
                type="button"
                onClick={handleCreateCustom}
                className="w-full flex items-center gap-2 rounded-lg border border-dashed border-[#c4e22e]/40 bg-[#c4e22e]/5 px-2.5 py-2 text-left font-sans text-xs text-[#c4e22e] hover:bg-[#c4e22e]/10 transition-colors"
              >
                <Plus className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Gunakan nilai baru: &ldquo;{searchQuery}&rdquo;</span>
              </button>
            ) : (
              <div className="px-2 py-3 text-center font-mono text-[11px] text-white/40">
                Tidak ada opsi yang cocok
              </div>
            )}
          </div>
        </div>
      )}

      {helperText && <p className="font-mono text-[10px] text-white/40">{helperText}</p>}
    </div>
  );
}
