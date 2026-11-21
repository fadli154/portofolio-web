"use client";

import React, { useState, useRef } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  Quote,
  Link as LinkIcon,
  Eye,
  Edit3,
  Heading,
} from "lucide-react";
import { playMechanicalClick } from "@/lib/audio/sound-effects";

export interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  helperText?: string;
}

export function RichTextEditor({
  label,
  value,
  onChange,
  placeholder = "Tulis deskripsi atau ringkasan arsitektur di sini...",
  rows = 4,
  required = false,
  helperText,
}: RichTextEditorProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper to wrap selected text with markdown tags
  const applyWrap = (before: string, after: string = before) => {
    playMechanicalClick(720);
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end) || "teks";
    const replacement = `${before}${selected}${after}`;

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 10);
  };

  // Helper to insert prefix at line starts
  const applyPrefix = (prefix: string) => {
    playMechanicalClick(720);
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const beforeCursor = value.substring(0, start);
    const lastNewline = beforeCursor.lastIndexOf("\n");
    const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;

    const newValue = value.substring(0, lineStart) + prefix + value.substring(lineStart);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 10);
  };

  const insertLink = () => {
    playMechanicalClick(720);
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end) || "judul link";
    const replacement = `[${selected}](https://)`;
    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);
  };

  // Simple Markdown renderer for Preview mode
  const renderPreview = (text: string) => {
    if (!text.trim()) {
      return <p className="text-white/30 italic text-xs">Belum ada konten untuk dipratinjau.</p>;
    }
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      if (line.startsWith("### ")) {
        return (
          <h4 key={idx} className="font-display font-bold text-white text-sm my-1 text-[#c4e22e]">
            {line.replace("### ", "")}
          </h4>
        );
      }
      if (line.startsWith("> ")) {
        return (
          <blockquote
            key={idx}
            className="border-l-2 border-[#c4e22e] pl-3 py-0.5 my-1 font-sans text-xs italic text-white/80 bg-white/[0.02]"
          >
            {line.replace("> ", "")}
          </blockquote>
        );
      }
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-white/80 my-0.5 font-sans">
            {line.replace(/^[-*]\s+/, "")}
          </li>
        );
      }
      if (/^\d+\.\s+/.test(line)) {
        return (
          <li key={idx} className="ml-4 list-decimal text-xs text-white/80 my-0.5 font-sans">
            {line.replace(/^\d+\.\s+/, "")}
          </li>
        );
      }
      return (
        <p key={idx} className="text-xs text-white/80 my-1 font-sans leading-relaxed">
          {line}
        </p>
      );
    });
  };

  const charCount = value.length;
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-1.5">
      {/* Header Label and Edit/Preview Tabs */}
      <div className="flex items-center justify-between">
        <label className="block font-mono text-[11px] font-semibold text-white/70">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-0.5">
          <button
            type="button"
            onClick={() => {
              playMechanicalClick(680);
              setActiveTab("edit");
            }}
            className={`flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[10px] transition-colors ${
              activeTab === "edit"
                ? "bg-[#c4e22e] text-[#111213] font-bold shadow-sm"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Edit3 className="h-3 w-3" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => {
              playMechanicalClick(680);
              setActiveTab("preview");
            }}
            className={`flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[10px] transition-colors ${
              activeTab === "preview"
                ? "bg-[#c4e22e] text-[#111213] font-bold shadow-sm"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Eye className="h-3 w-3" />
            <span>Pratinjau</span>
          </button>
        </div>
      </div>

      {/* Editor Container with Integrated Toolbar */}
      <div className="rounded-xl border border-white/10 bg-white/5 focus-within:border-[#c4e22e] transition-colors overflow-hidden">
        {/* Formatting Toolbar */}
        {activeTab === "edit" && (
          <div className="flex flex-wrap items-center gap-1 px-2.5 py-1.5 border-b border-white/10 bg-black/40">
            <button
              type="button"
              onClick={() => applyWrap("**")}
              title="Tebal (Bold) - **teks**"
              className="p-1 rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Bold className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => applyWrap("*")}
              title="Miring (Italic) - *teks*"
              className="p-1 rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Italic className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => applyPrefix("### ")}
              title="Sub-judul - ### Judul"
              className="p-1 rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Heading className="h-3.5 w-3.5" />
            </button>
            <span className="h-3.5 w-[1px] bg-white/15 mx-1" />
            <button
              type="button"
              onClick={() => applyPrefix("- ")}
              title="Daftar Poin (Bullet List)"
              className="p-1 rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <List className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => applyPrefix("1. ")}
              title="Daftar Angka (Numbered List)"
              className="p-1 rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ListOrdered className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => applyWrap("`")}
              title="Kode Segaris - `code`"
              className="p-1 rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Code className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => applyPrefix("> ")}
              title="Kutipan (Blockquote)"
              className="p-1 rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Quote className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={insertLink}
              title="Tautan Link"
              className="p-1 rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <LinkIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Textarea or Preview Body */}
        {activeTab === "edit" ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            placeholder={placeholder}
            required={required}
            className="w-full bg-transparent px-3 py-2 font-sans text-xs text-white placeholder:text-white/30 outline-none resize-y leading-relaxed"
          />
        ) : (
          <div className="min-h-[100px] max-h-[300px] overflow-y-auto px-4 py-3 bg-black/40">
            {renderPreview(value)}
          </div>
        )}

        {/* Footer with Character & Word Counters */}
        <div className="flex items-center justify-between px-3 py-1.5 border-t border-white/5 bg-black/30 font-mono text-[10px] text-white/40">
          <span>{helperText || "Mendukung sintaks Markdown dasar"}</span>
          <span className="flex items-center gap-2">
            <span>{wordCount} kata</span>
            <span>•</span>
            <span>{charCount} karakter</span>
          </span>
        </div>
      </div>
    </div>
  );
}
