"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Award, ExternalLink, ShieldCheck } from "lucide-react";
import type { CertificateItem } from "@/data/site";
import { usePortfolioState } from "@/lib/i18n/context";
import { playMechanicalClick } from "@/lib/audio/sound-effects";

export function CertificatesVaultClient({
  certificates,
}: {
  certificates: CertificateItem[];
}) {
  const { locale } = usePortfolioState();
  const [category, setCategory] = useState<string>("ALL");

  const categories = [
    "ALL",
    "Frontend & Web",
    "Security & Database",
    "AI & Data Systems",
    "Architecture & Cloud",
  ];

  const visible =
    category === "ALL"
      ? certificates
      : certificates.filter((c) => c.category === category);

  return (
    <section className="section-shell">
      <div className="page-grid">
        <div className="col-span-12">
          <Link
            href="/"
            className="inline-flex min-h-[30px] items-center gap-2 py-1 font-mono text-xs uppercase tracking-wider text-[var(--ink-muted)] hover:text-[var(--accent)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{locale === "id" ? "Kembali ke Bench Utama" : "Return to Telemetry Bench"}</span>
          </Link>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-6 border-b border-[var(--rule-strong)] pb-6">
            <div>
              <span className="eyebrow">
                <span className="eyebrow-dot" />
                {locale === "id"
                  ? "BRANKAS KREDENSIAL & LISENSI"
                  : "VERIFIED CREDENTIALS VAULT"}
              </span>
              <h1
                className="page-display-title mt-2"
                data-split=""
              >
                {locale === "id"
                  ? "Sertifikasi Teknis & Audit"
                  : "Technical Certifications & Audits"}
              </h1>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => {
                const active = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      playMechanicalClick(650);
                      setCategory(cat);
                    }}
                    className={`border px-3 py-1.5 font-mono text-xs transition-colors ${
                      active
                        ? "border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--ink)] font-semibold"
                        : "border-[var(--rule)] text-[var(--ink-muted)] hover:text-[var(--ink)]"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-span-12 mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {visible.map((cert) => (
            <article
              key={cert.id}
              className="flex flex-col justify-between border border-[var(--rule)] bg-[var(--bg-elevated)] p-6 transition-colors hover:border-[var(--accent)]"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[var(--rule)] pb-3 font-mono text-xs">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--accent)]">
                    <Award className="h-4 w-4" aria-hidden="true" />
                    <span>
                      {cert.code} · {cert.category}
                    </span>
                  </span>
                  <span className="text-[var(--ink-muted)]">{cert.issueDate}</span>
                </div>

                <h2 className="font-display mt-4 text-xl font-bold text-[var(--ink)]">
                  {cert.title}
                </h2>
                <div className="mt-1 font-mono text-xs text-[var(--ink-muted)]">
                  {locale === "id" ? "Diterbitkan oleh" : "Issued by"}: {cert.issuer}
                </div>

                <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
                  {locale === "id" ? cert.summaryId : cert.summaryEn}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[var(--rule)] pt-4 font-mono text-xs">
                <span className="inline-flex items-center gap-1.5 text-[var(--ink-muted)]">
                  <ShieldCheck className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
                  <span>CREDENTIAL ID: {cert.credentialId}</span>
                </span>
                <a
                  href={cert.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[28px] items-center gap-1 px-1.5 py-1 text-[var(--accent)] hover:underline"
                >
                  <span>{locale === "id" ? "Verifikasi" : "Verify"}</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

