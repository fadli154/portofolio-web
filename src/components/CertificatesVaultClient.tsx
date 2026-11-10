"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Award,
  ExternalLink,
  FileText,
  ShieldCheck,
  X,
} from "lucide-react";
import type { CertificateItem } from "@/data/site";
import { usePortfolioState } from "@/lib/i18n/context";
import { playMechanicalClick } from "@/lib/audio/sound-effects";
import {
  loadCmsStoreClient,
  type CmsDynamicStore,
} from "@/lib/data/cms-persistence";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";
import { TiltedCard } from "@/components/reactbits/TiltedCard";

export function CertificatesVaultClient({
  certificates: initialCertificates,
}: {
  certificates: CertificateItem[];
}) {
  const { locale } = usePortfolioState();
  const [certificates, setCertificates] = useState<CertificateItem[]>(
    initialCertificates
  );
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  useEffect(() => {
    const store = loadCmsStoreClient();
    if (store.certificates && store.certificates.length > 0) {
      setCertificates(store.certificates);
    }

    const handleUpdate = (e: Event) => {
      const custom = e as CustomEvent<CmsDynamicStore>;
      if (custom.detail?.certificates?.length) {
        setCertificates(custom.detail.certificates);
      }
    };
    window.addEventListener("fadli-cms-updated", handleUpdate);
    return () => window.removeEventListener("fadli-cms-updated", handleUpdate);
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    certificates.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return ["ALL", ...Array.from(set)];
  }, [certificates]);

  const visible = useMemo(() => {
    const active = certificates.filter((c) => c.isVisible !== false);
    if (selectedCategory === "ALL") return active;
    return active.filter((c) => c.category === selectedCategory);
  }, [certificates, selectedCategory]);

  return (
    <section className="min-h-screen bg-[#111213] py-20 text-[#f5f5f2] md:py-28">
      <div className="keffi-wrap">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 font-mono text-xs text-white/80 transition hover:border-[#c4e22e] hover:text-[#c4e22e]"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{locale === "id" ? "Kembali ke Beranda" : "Return to Home"}</span>
          </Link>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-b border-white/12 pb-8">
            <div>
              <span className="sec-kicker !text-white/60">
                <span className="sec-kicker__dot sec-kicker__dot--lime" />
                <span>
                  {locale === "id"
                    ? "BRANKAS LISENSI & SERTIFIKASI RESMI"
                    : "VERIFIED CREDENTIALS & AWARDS VAULT"}
                </span>
              </span>
              <h1 className="hero-giant mt-4">
                {locale === "id"
                  ? "Sertifikasi Teknis & Kompetisi."
                  : "Technical Credentials & Awards."}
              </h1>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      playMechanicalClick(650);
                      setSelectedCategory(cat);
                    }}
                    className={`rounded-full border px-4 py-2 font-mono text-xs font-semibold transition ${
                      active
                        ? "border-[#c4e22e] bg-[#c4e22e] text-[#111213]"
                        : "border-white/15 bg-white/5 text-white/70 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Certificate Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {visible.map((cert) => (
            <TiltedCard
              key={cert.id}
              maxTilt={4}
              cursorLabel="INSPECT"
              className="h-full rounded-[28px]"
            >
              <SpotlightCard
                spotlightColor="rgba(196, 226, 46, 0.14)"
                onClick={() => {
                  playMechanicalClick(720);
                  setSelectedCert(cert);
                }}
                className="flex h-full cursor-pointer flex-col justify-between rounded-[28px] border border-white/12 bg-[#171920] p-6 shadow-md transition hover:border-[#c4e22e]/40 md:p-8"
              >
                <div>
                  {/* Certificate Image Frame */}
                  <div className="relative h-56 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f14] md:h-64">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cert.imageUrl}
                      alt={cert.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <span className="absolute bottom-3 left-3 rounded-full bg-black/80 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#c4e22e] backdrop-blur-sm">
                      {cert.category}
                    </span>
                    <span className="absolute bottom-3 right-3 rounded-full bg-black/80 px-3 py-1 font-mono text-[10px] text-white/75 backdrop-blur-sm">
                      {cert.issueDate}
                    </span>
                  </div>

                  <div className="mt-6 flex items-center justify-between font-mono text-xs text-white/60">
                    <span className="inline-flex items-center gap-1.5 text-[#c4e22e]">
                      <Award className="h-4 w-4" aria-hidden="true" />
                      <span>{cert.issuer}</span>
                    </span>
                    {cert.credentialId && (
                      <span className="line-clamp-1 text-[11px]">
                        ID: {cert.credentialId}
                      </span>
                    )}
                  </div>

                  <h2 className="mt-3 text-xl font-medium tracking-tight text-white md:text-2xl">
                    {cert.title}
                  </h2>

                  {(cert.summaryId || cert.summaryEn) && (
                    <p className="mt-3 text-sm leading-relaxed text-white/70">
                      {locale === "id" ? cert.summaryId : cert.summaryEn}
                    </p>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 font-mono text-xs">
                  <span className="text-[#c4e22e] font-semibold">
                    Klik untuk memperbesar
                  </span>
                  <div className="flex items-center gap-3">
                    {cert.fileUrl && (
                      <a
                        href={cert.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-white/80 hover:text-[#c4e22e]"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        <span>Dokumen</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    )}
                    {cert.verifyUrl && (
                      <a
                        href={cert.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-[#c4e22e] hover:underline"
                      >
                        <span>Verifikasi</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </SpotlightCard>
            </TiltedCard>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[32px] border border-white/15 bg-[#171920] p-6 text-[#f5f5f2] shadow-2xl md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5 font-mono text-xs">
                <span className="rounded-full bg-[#c4e22e] px-3.5 py-1 font-bold text-[#111213]">
                  {selectedCert.category}
                </span>
                <span className="text-white/60">{selectedCert.issueDate}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                className="rounded-full border border-white/15 p-2 text-white/70 hover:bg-white/10 hover:text-white"
                aria-label="Tutup modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f14]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedCert.imageUrl}
                alt={selectedCert.title}
                className="max-h-[460px] w-full object-contain"
              />
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-2xl font-medium tracking-tight text-white md:text-3xl">
                  {selectedCert.title}
                </h3>
                <p className="mt-1 font-mono text-xs text-[#c4e22e]">
                  Penerbit: {selectedCert.issuer}
                </p>
              </div>

              {(selectedCert.summaryId || selectedCert.summaryEn) && (
                <p className="text-sm leading-relaxed text-white/75">
                  {locale === "id"
                    ? selectedCert.summaryId
                    : selectedCert.summaryEn}
                </p>
              )}

              {selectedCert.credentialId && (
                <div className="flex items-center gap-2 font-mono text-xs text-white/60">
                  <ShieldCheck className="h-4 w-4 text-[#c4e22e]" />
                  <span>No. Kredensial: {selectedCert.credentialId}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/10 font-mono text-xs">
                {selectedCert.fileUrl && (
                  <a
                    href={selectedCert.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="keffi-pill-btn keffi-pill-btn--lime !py-2 !px-5"
                  >
                    <FileText className="h-4 w-4" />
                    <span>
                      {selectedCert.fileUrl.endsWith(".pdf")
                        ? "Buka Berkas PDF Resmi"
                        : "Buka Dokumen Asli"}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
                {selectedCert.verifyUrl && (
                  <a
                    href={selectedCert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-white/85 transition hover:border-[#c4e22e] hover:text-[#c4e22e]"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Verifikasi Kredensial</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
