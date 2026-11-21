"use client";

import React, { useState, useMemo } from "react";
import { format, isValid } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  CalendarRange,
  X,
  Check,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { playMechanicalClick } from "@/lib/audio/sound-effects";

export interface DatePickerFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  presets?: string[];
  helperText?: string;
  required?: boolean;
  enableRange?: boolean;
}

const ID_MONTHS: Record<string, number> = {
  januari: 0,
  februari: 1,
  maret: 2,
  april: 3,
  mei: 4,
  juni: 5,
  juli: 6,
  agustus: 7,
  september: 8,
  oktober: 9,
  november: 10,
  desember: 11,
};

function parseSafeDate(raw: string): Date | undefined {
  if (!raw || typeof raw !== "string") return undefined;
  const trimmed = raw.trim();

  // Try standard Date parsing
  const parsed = new Date(trimmed);
  if (isValid(parsed) && !isNaN(parsed.getTime())) {
    return parsed;
  }

  // Indonesian date: "26 November 2025" or "7 Nov 2026"
  const match = trimmed.match(/^(\d{1,2})\s+([a-zA-Z]+)\s+(\d{4})$/);
  if (match) {
    const day = parseInt(match[1], 10);
    const mName = match[2].toLowerCase();
    const year = parseInt(match[3], 10);
    const month = ID_MONTHS[mName];
    if (month !== undefined) {
      const d = new Date(year, month, day);
      if (isValid(d)) return d;
    }
  }

  // Year only: "2026"
  const yearMatch = trimmed.match(/^(\d{4})$/);
  if (yearMatch) {
    return new Date(parseInt(yearMatch[1], 10), 0, 1);
  }

  return undefined;
}

export function DatePickerField({
  label,
  value,
  onChange,
  placeholder = "Pilih tanggal atau rentang waktu...",
  presets = ["2026", "2025 - 2026", "2024 - 2025", "2024 - Sekarang"],
  helperText,
  required = false,
  enableRange = false,
}: DatePickerFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState<"single" | "range">(
    enableRange || value.includes("-") ? "range" : "single"
  );

  // Single date state
  const selectedDate = useMemo(() => parseSafeDate(value), [value]);

  // Range date state
  const selectedRange = useMemo<DateRange | undefined>(() => {
    if (!value.includes("-")) {
      const d = parseSafeDate(value);
      return d ? { from: d, to: undefined } : undefined;
    }
    const [fromStr, toStr] = value.split("-").map((s) => s.trim());
    const from = parseSafeDate(fromStr);
    const to = parseSafeDate(toStr);
    return from ? { from, to } : undefined;
  }, [value]);

  const handlePresetClick = (preset: string) => {
    playMechanicalClick(720);
    onChange(preset);
  };

  const handleSelectSingle = (date: Date | undefined) => {
    if (!date) return;
    playMechanicalClick(750);
    const formatted = format(date, "d MMMM yyyy");
    onChange(formatted);
    setIsOpen(false);
  };

  const handleSelectRange = (range: DateRange | undefined) => {
    if (!range) return;
    playMechanicalClick(750);
    if (range.from && range.to) {
      const formatted = `${format(range.from, "d MMM yyyy")} - ${format(
        range.to,
        "d MMM yyyy"
      )}`;
      onChange(formatted);
      setIsOpen(false);
    } else if (range.from) {
      onChange(format(range.from, "d MMM yyyy"));
    }
  };

  return (
    <div className="space-y-1.5">
      {/* Header Label & Quick Presets */}
      <div className="flex items-center justify-between gap-1">
        <label className="block font-mono text-[11px] font-semibold text-white/70 truncate">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
        {presets && presets.length > 0 && (
          <div className="flex items-center gap-1 shrink-0">
            <span className="font-mono text-[10px] text-white/40 hidden md:inline">
              Preset:
            </span>
            {presets.slice(0, 3).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handlePresetClick(p)}
                className={`rounded px-1.5 py-0.5 font-mono text-[9px] transition-colors max-w-[95px] truncate cursor-pointer ${
                  value === p
                    ? "bg-[#c4e22e]/20 text-[#c4e22e] border border-[#c4e22e]/40 font-bold"
                    : "bg-white/5 text-white/60 hover:text-white border border-white/5 hover:border-white/15"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Date Input with Shadcn Popover & Calendar Trigger */}
      <div className="relative flex items-center rounded-xl border border-white/10 bg-white/5 focus-within:border-[#c4e22e] transition-all">
        {/* Input box: allows custom text, typing, or preset reflection */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full bg-transparent pl-9 pr-24 py-2 font-mono text-xs text-white placeholder:text-white/30 outline-none"
        />
        <CalendarIcon className="absolute left-3 h-4 w-4 text-[#c4e22e] pointer-events-none" />

        {/* Clear button if value exists */}
        {value && (
          <button
            type="button"
            onClick={() => {
              playMechanicalClick(650);
              onChange("");
            }}
            className="absolute right-14 text-white/30 hover:text-white transition-colors p-1"
            title="Hapus Tanggal"
          >
            <X className="h-3 w-3" />
          </button>
        )}

        {/* Shadcn Popover Trigger */}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger
            render={
              <button
                type="button"
                onClick={() => playMechanicalClick(720)}
                className="absolute right-1.5 inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/10 px-2 py-1 font-mono text-[10px] font-semibold text-white/80 hover:bg-[#c4e22e]/20 hover:text-[#c4e22e] hover:border-[#c4e22e]/40 transition-all cursor-pointer"
                title="Buka Kalender Shadcn"
              >
                <span>Kalender</span>
                <ChevronDown className="h-3 w-3 text-white/50" />
              </button>
            }
          />
          <PopoverContent
            align="end"
            side="bottom"
            sideOffset={6}
            className="w-auto p-3 bg-[#0c0d12]/95 border border-white/15 backdrop-blur-2xl rounded-2xl shadow-2xl z-50 text-white"
          >
            {/* Popover Header Mode Toggle */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-2.5">
              <span className="font-mono text-[11px] font-bold text-white/80 flex items-center gap-1.5">
                <CalendarIcon className="h-3.5 w-3.5 text-[#c4e22e]" />
                Pilih Tanggal
              </span>
              <div className="flex items-center gap-1 rounded-lg bg-white/5 p-0.5 border border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    playMechanicalClick(700);
                    setPickerMode("single");
                  }}
                  className={cn(
                    "rounded px-2 py-0.5 font-mono text-[9px] transition-colors cursor-pointer",
                    pickerMode === "single"
                      ? "bg-[#c4e22e] text-[#090a0d] font-bold"
                      : "text-white/50 hover:text-white"
                  )}
                >
                  Single
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playMechanicalClick(700);
                    setPickerMode("range");
                  }}
                  className={cn(
                    "rounded px-2 py-0.5 font-mono text-[9px] transition-colors cursor-pointer",
                    pickerMode === "range"
                      ? "bg-[#c4e22e] text-[#090a0d] font-bold"
                      : "text-white/50 hover:text-white"
                  )}
                >
                  Range
                </button>
              </div>
            </div>

            {/* Shadcn Calendar Component */}
            {pickerMode === "single" ? (
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleSelectSingle}
                defaultMonth={selectedDate || new Date()}
                className="bg-transparent text-white"
              />
            ) : (
              <Calendar
                mode="range"
                selected={selectedRange}
                onSelect={handleSelectRange}
                defaultMonth={selectedRange?.from || new Date()}
                numberOfMonths={1}
                className="bg-transparent text-white"
              />
            )}

            {/* Popover Footer Quick Presets / Today button */}
            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  playMechanicalClick(750);
                  const today = format(new Date(), "d MMMM yyyy");
                  onChange(today);
                  setIsOpen(false);
                }}
                className="rounded-lg bg-white/5 hover:bg-[#c4e22e]/20 hover:text-[#c4e22e] border border-white/10 px-2 py-1 font-mono text-[10px] text-white/70 transition-colors cursor-pointer"
              >
                Hari Ini
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 px-2.5 py-1 font-mono text-[10px] text-white transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {helperText && (
        <p className="font-mono text-[10px] text-white/40">{helperText}</p>
      )}
    </div>
  );
}

export default DatePickerField;
