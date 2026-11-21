"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Search, ChevronDown, Check, X, Plus, Tag } from "lucide-react";
import {
  loadCategoriesClient,
  upsertCategoryItem,
} from "@/lib/data/cms-categories";
import {
  slugifyCategory,
  type CategoryItem,
  type CategoryScope,
} from "@/lib/data/categories";
import { playMechanicalClick } from "@/lib/audio/sound-effects";

export interface MultiSelectCategoriesProps {
  label: string;
  selectedValues: string[]; // names or slugs
  onChange: (values: string[]) => void;
  scope?: CategoryScope;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
}

export function MultiSelectCategories({
  label,
  selectedValues,
  onChange,
  scope,
  placeholder = "Pilih satu atau beberapa kategori...",
  helperText,
  required = false,
}: MultiSelectCategoriesProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allCategories, setAllCategories] = useState<CategoryItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load categories
  useEffect(() => {
    const list = loadCategoriesClient();
    setAllCategories(list);

    const handleUpdate = () => {
      setAllCategories(loadCategoriesClient());
    };
    window.addEventListener("fadli-cms-updated", handleUpdate);
    return () => window.removeEventListener("fadli-cms-updated", handleUpdate);
  }, []);

  // Filter categories by scope (if specified) and search query
  const filteredCategories = useMemo(() => {
    return allCategories.filter((cat) => {
      // Scope match
      const scopeMatches =
        !scope || cat.scope === "all" || cat.scope === scope;
      if (!scopeMatches) return false;

      // Query match
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        cat.name.toLowerCase().includes(q) ||
        cat.slug.toLowerCase().includes(q)
      );
    });
  }, [allCategories, scope, searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isSelected = (identifier: string) => {
    return selectedValues.some(
      (v) =>
        v.toLowerCase() === identifier.toLowerCase() ||
        slugifyCategory(v) === slugifyCategory(identifier)
    );
  };

  const handleToggle = (catName: string) => {
    playMechanicalClick(720);
    if (isSelected(catName)) {
      onChange(
        selectedValues.filter(
          (v) =>
            v.toLowerCase() !== catName.toLowerCase() &&
            slugifyCategory(v) !== slugifyCategory(catName)
        )
      );
    } else {
      onChange([...selectedValues, catName]);
    }
  };

  const handleRemoveChip = (e: React.MouseEvent, val: string) => {
    e.stopPropagation();
    playMechanicalClick(650);
    onChange(
      selectedValues.filter(
        (v) =>
          v.toLowerCase() !== val.toLowerCase() &&
          slugifyCategory(v) !== slugifyCategory(val)
      )
    );
  };

  // On-the-fly custom category creation
  const handleCreateOnTheFly = async () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    playMechanicalClick(760);

    const newSlug = slugifyCategory(trimmed);
    const existing = allCategories.find((c) => c.slug === newSlug);

    if (existing) {
      if (!isSelected(existing.name)) {
        onChange([...selectedValues, existing.name]);
      }
    } else {
      const newCat: CategoryItem = {
        id: `cat-${Date.now()}`,
        name: trimmed,
        slug: newSlug,
        scope: scope || "all",
        colorHex: "#c4e22e",
        description: "Dibuat langsung via form modal",
        sortOrder: allCategories.length + 1,
        isVisible: true,
      };
      await upsertCategoryItem(newCat);
      setAllCategories((prev) => [...prev, newCat]);
      onChange([...selectedValues, newCat.name]);
    }

    setSearchQuery("");
  };

  // Find category color if available
  const getCategoryColor = (name: string) => {
    const found = allCategories.find(
      (c) =>
        c.name.toLowerCase() === name.toLowerCase() ||
        c.slug === slugifyCategory(name)
    );
    return found ? found.colorHex : "#c4e22e";
  };

  return (
    <div ref={containerRef} className={`relative space-y-1.5 ${isOpen ? "z-40" : "z-10"}`}>
      <div className="flex items-center justify-between">
        <label className="block font-mono text-[11px] font-semibold text-white/70">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
        {selectedValues.length > 0 && (
          <span className="font-mono text-[10px] text-[#c4e22e]">
            {selectedValues.length} terpilih
          </span>
        )}
      </div>

      {/* Trigger & Chips Area */}
      <div
        onClick={() => {
          playMechanicalClick(680);
          setIsOpen(!isOpen);
          if (!isOpen) {
            setTimeout(() => searchInputRef.current?.focus(), 50);
          }
        }}
        className={`min-h-[42px] w-full flex flex-wrap items-center gap-1.5 rounded-xl border px-3 py-2 font-sans text-xs transition-colors cursor-pointer ${
          isOpen
            ? "border-[#c4e22e] bg-[#16171d] shadow-lg shadow-[#c4e22e]/5"
            : "border-white/10 bg-white/5 hover:border-white/20 text-white"
        }`}
      >
        {selectedValues.length === 0 ? (
          <span className="text-white/40 flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5 text-white/30" />
            <span>{placeholder}</span>
          </span>
        ) : (
          selectedValues.map((val) => {
            const color = getCategoryColor(val);
            return (
              <span
                key={val}
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-mono border transition-all"
                style={{
                  backgroundColor: `${color}18`,
                  borderColor: `${color}40`,
                  color: color,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="truncate max-w-[140px]">{val}</span>
                <button
                  type="button"
                  onClick={(e) => handleRemoveChip(e, val)}
                  className="hover:text-white rounded-full p-0.5 transition-colors cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })
        )}
        <div className="ml-auto flex items-center pl-1 text-white/40">
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-[#c4e22e]" : ""
            }`}
          />
        </div>
      </div>

      {helperText && (
        <p className="font-mono text-[10px] text-white/40">{helperText}</p>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-2xl border border-white/15 bg-[#121318] p-2 shadow-2xl backdrop-blur-xl">
          {/* Search Input */}
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-white/40" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari atau ketik kategori baru..."
              className="w-full rounded-xl border border-white/10 bg-white/5 py-1.5 pl-8 pr-3 font-sans text-xs text-white placeholder-white/30 focus:border-[#c4e22e] outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCreateOnTheFly();
                }
              }}
            />
          </div>

          {/* Options List */}
          <div
            data-lenis-prevent="true"
            data-admin-scroll="true"
            className="max-h-56 overflow-y-auto overscroll-contain admin-modal-scroll space-y-1 pr-1.5"
            onWheel={(e) => e.stopPropagation()}
          >
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => {
                const selected = isSelected(cat.name);
                return (
                  <button
                    key={cat.id || cat.slug}
                    type="button"
                    onClick={() => handleToggle(cat.name)}
                    className={`w-full flex items-center justify-between rounded-xl px-2.5 py-1.5 text-left text-xs transition-colors cursor-pointer ${
                      selected
                        ? "bg-[#c4e22e]/10 text-white font-medium"
                        : "text-white/80 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: cat.colorHex }}
                      />
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[10px] font-mono text-white/40 px-1.5 py-0.2 rounded border border-white/10">
                        {cat.scope}
                      </span>
                    </div>
                    {selected && (
                      <Check className="h-3.5 w-3.5 text-[#c4e22e] flex-shrink-0" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="py-2 px-3 text-center text-xs text-white/40">
                Tidak ada kategori yang cocok
              </div>
            )}
          </div>

          {/* Create Custom Category Action */}
          {searchQuery.trim() &&
            !allCategories.some(
              (c) => c.name.toLowerCase() === searchQuery.trim().toLowerCase()
            ) && (
              <div className="mt-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleCreateOnTheFly}
                  className="w-full flex items-center gap-2 rounded-xl bg-white/5 px-2.5 py-2 text-xs text-[#c4e22e] hover:bg-[#c4e22e]/10 transition-colors cursor-pointer font-mono"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>
                    Buat Kategori Baru:{" "}
                    <strong className="text-white">"{searchQuery.trim()}"</strong>
                  </span>
                </button>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
