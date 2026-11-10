"use client";

import React, { useState } from "react";
import { Calendar, Check, Copy, Send, ShieldCheck, X } from "lucide-react";
import { usePortfolioState } from "@/lib/i18n/context";
import { SITE_PROFILE } from "@/data/site";
import { playMechanicalClick } from "@/lib/audio/sound-effects";

const SCOPES = [
  {
    id: "full-time" as const,
    labelEn: "Full-Time Engineering Role",
    labelId: "Peran Rekayasa Full-Time",
    budgetHintEn: "Q1/Q2 Onboarding · Remote or Hybrid",
    budgetHintId: "Onboarding Q1/Q2 · Remote atau Hibrida",
  },
  {
    id: "contract" as const,
    labelEn: "Product / MVP Contract",
    labelId: "Kontrak Produk / MVP",
    budgetHintEn: "End-to-End Next.js + Supabase Delivery",
    budgetHintId: "Pembangunan Penuh Next.js + Supabase",
  },
  {
    id: "advisory" as const,
    labelEn: "AI & Database Architecture Review",
    labelId: "Audit Arsitektur AI & Database",
    budgetHintEn: "RLS Hardening · Agent Pipeline Design",
    budgetHintId: "Pengerasan RLS · Desain Pipeline Agen",
  },
  {
    id: "general" as const,
    labelEn: "General Technical Inquiry",
    labelId: "Diskusi Teknis Umum",
    budgetHintEn: "Direct Engineering Correspondence",
    budgetHintId: "Korespondensi Teknis Langsung",
  },
];

export function SmartInquiryModal() {
  const { inquiryOpen, setInquiryOpen, initialInquiryScope, locale } = usePortfolioState();
  const [scope, setScope] = useState<"full-time" | "contract" | "advisory" | "general">(
    initialInquiryScope
  );
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [companyOrOrg, setCompanyOrOrg] = useState("");
  const [timelineOrBudget, setTimelineOrBudget] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    setScope(initialInquiryScope);
  }, [initialInquiryScope]);

  if (!inquiryOpen) return null;

  const copyDirectEmail = async () => {
    playMechanicalClick(750);
    try {
      await navigator.clipboard.writeText(SITE_PROFILE.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // ignore
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderName,
          senderEmail,
          companyOrOrg,
          inquiryScope: scope,
          timelineOrBudget,
          message,
          website: honeypot,
        }),
      });

      const result = (await response.json()) as { ok?: boolean; message?: string };

      if (!response.ok || !result.ok) {
        setStatusMessage({
          type: "error",
          text:
            result.message ||
            (locale === "id"
              ? "Mohon periksa kembali kolom input Anda."
              : "Please verify your inquiry fields and try again."),
        });
      } else {
        playMechanicalClick(840);
        setStatusMessage({
          type: "success",
          text:
            locale === "id"
              ? "Pesan terverifikasi dan tercatat di buku besar kontak. Fadli akan merespons dalam < 24 jam."
              : "Inquiry verified and logged to the contact ledger. Fadli will respond within 24 hours.",
        });
        setSenderName("");
        setSenderEmail("");
        setCompanyOrOrg("");
        setTimelineOrBudget("");
        setMessage("");
      }
    } catch {
      setStatusMessage({
        type: "error",
        text:
          locale === "id"
            ? "Terjadi gangguan jaringan. Silakan salin alamat email langsung di bawah."
            : "Network error encountered. Please use the one-click email copy below.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="smart-inquiry-title"
      onClick={() => setInquiryOpen(false)}
    >
      <div
        className="w-full max-w-2xl border border-[var(--rule-strong)] bg-[var(--bg)] p-6 md:p-8 shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--rule)] pb-4">
          <div>
            <span className="eyebrow">
              <span className="eyebrow-dot" />
              {locale === "id" ? "KANAL TRANSMISI LANGSUNG" : "DIRECT TRANSMISSION CHANNEL"}
            </span>
            <h2
              id="smart-inquiry-title"
              className="mt-1 font-display text-2xl font-bold tracking-tight text-[var(--ink)]"
            >
              {locale === "id"
                ? "Mulai Diskusi Teknis atau Rekrutmen"
                : "Initiate Technical or Hiring Inquiry"}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setInquiryOpen(false)}
            className="border border-[var(--rule)] p-2 text-[var(--ink-muted)] hover:border-[var(--accent)] hover:text-[var(--ink)]"
            aria-label="Close inquiry modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Fast Action Bar: Copy Email + Schedule 15-min Call */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border border-[var(--rule)] bg-[var(--bg-elevated)] p-3">
          <div className="flex items-center gap-2 font-mono text-xs text-[var(--ink)]">
            <span className="text-[var(--accent)]">DIRECT:</span>
            <span>{SITE_PROFILE.email}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={copyDirectEmail}
              className="inline-flex items-center gap-1.5 border border-[var(--rule-strong)] px-3 py-1.5 font-mono text-[11px] uppercase text-[var(--ink)] hover:border-[var(--accent)]"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-[var(--accent)]" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? (locale === "id" ? "Tersalin" : "Copied") : locale === "id" ? "Salin Email" : "Copy Email"}</span>
            </button>
            <a
              href={SITE_PROFILE.calUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 border border-[var(--accent)] bg-[var(--accent)]/10 px-3 py-1.5 font-mono text-[11px] uppercase text-[var(--ink)] hover:bg-[var(--accent)]/20"
            >
              <Calendar className="h-3.5 w-3.5 text-[var(--accent)]" />
              <span>{locale === "id" ? "Jadwalkan Panggilan 15m" : "Book 15m Intro Call"}</span>
            </a>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Scope Selector */}
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-[var(--ink-muted)]">
              {locale === "id" ? "01. Pilih Cakupan Diskusi" : "01. Select Inquiry Scope"}
            </label>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {SCOPES.map((item) => {
                const active = scope === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      playMechanicalClick(650);
                      setScope(item.id);
                    }}
                    className={`border p-3 text-left transition-all ${
                      active
                        ? "border-[var(--accent)] bg-[var(--bg-elevated)]"
                        : "border-[var(--rule)] hover:border-[var(--ink-muted)]"
                    }`}
                  >
                    <div className="font-mono text-xs font-semibold text-[var(--ink)]">
                      {locale === "id" ? item.labelId : item.labelEn}
                    </div>
                    <div className="mt-0.5 font-mono text-[11px] text-[var(--ink-muted)]">
                      {locale === "id" ? item.budgetHintId : item.budgetHintEn}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Honeypot field (hidden from real users) */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website-field">Website</label>
            <input
              id="website-field"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="inquiry-name"
                className="block font-mono text-[11px] uppercase tracking-wider text-[var(--ink-muted)]"
              >
                {locale === "id" ? "02. Nama Lengkap *" : "02. Your Name *"}
              </label>
              <input
                id="inquiry-name"
                type="text"
                required
                minLength={2}
                maxLength={120}
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Alex Rivera"
                className="mt-1.5 w-full border border-[var(--rule-strong)] bg-[var(--bg-elevated)] px-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="inquiry-email"
                className="block font-mono text-[11px] uppercase tracking-wider text-[var(--ink-muted)]"
              >
                {locale === "id" ? "03. Email Kerja *" : "03. Work Email *"}
              </label>
              <input
                id="inquiry-email"
                type="email"
                required
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="alex@company.com"
                className="mt-1.5 w-full border border-[var(--rule-strong)] bg-[var(--bg-elevated)] px-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="inquiry-company"
                className="block font-mono text-[11px] uppercase tracking-wider text-[var(--ink-muted)]"
              >
                {locale === "id" ? "04. Perusahaan / Tim" : "04. Company / Team"}
              </label>
              <input
                id="inquiry-company"
                type="text"
                maxLength={120}
                value={companyOrOrg}
                onChange={(e) => setCompanyOrOrg(e.target.value)}
                placeholder="Acme Systems Inc."
                className="mt-1.5 w-full border border-[var(--rule-strong)] bg-[var(--bg-elevated)] px-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="inquiry-timeline"
                className="block font-mono text-[11px] uppercase tracking-wider text-[var(--ink-muted)]"
              >
                {locale === "id" ? "05. Target Waktu / Peran" : "05. Target Timeline / Role"}
              </label>
              <input
                id="inquiry-timeline"
                type="text"
                maxLength={120}
                value={timelineOrBudget}
                onChange={(e) => setTimelineOrBudget(e.target.value)}
                placeholder={locale === "id" ? "Mulai segera / Q1" : "Immediate / Q1 Start"}
                className="mt-1.5 w-full border border-[var(--rule-strong)] bg-[var(--bg-elevated)] px-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="inquiry-message"
              className="block font-mono text-[11px] uppercase tracking-wider text-[var(--ink-muted)]"
            >
              {locale === "id"
                ? "06. Spesifikasi Peran atau Kebutuhan Sistem *"
                : "06. Role Context or System Requirements *"}
            </label>
            <textarea
              id="inquiry-message"
              required
              minLength={10}
              maxLength={4000}
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                locale === "id"
                  ? "Ceritakan tantangan teknis, arsitektur produk, atau posisi yang sedang dibuka..."
                  : "Share key details about the engineering role, product roadmap, or architectural bottleneck..."
              }
              className="mt-1.5 w-full border border-[var(--rule-strong)] bg-[var(--bg-elevated)] px-3.5 py-2.5 text-sm text-[var(--ink)] focus:border-[var(--accent)] focus:outline-none"
            />
          </div>

          {statusMessage && (
            <div
              className={`border p-3 font-mono text-xs ${
                statusMessage.type === "success"
                  ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--ink)]"
                  : "border-rose-500 bg-rose-500/10 text-rose-300"
              }`}
              role="status"
            >
              {statusMessage.text}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--ink-muted)]">
              <ShieldCheck className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden="true" />
              <span>ZOD VALIDATED · SUPABASE RLS PROTECTED</span>
            </span>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              data-fill=""
            >
              <Send className="h-3.5 w-3.5" aria-hidden="true" />
              <span>
                {submitting
                  ? locale === "id"
                    ? "Mengirim..."
                    : "Transmitting..."
                  : locale === "id"
                    ? "Kirim Transmisi"
                    : "Transmit Inquiry"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

