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
  Star,
  Trophy,
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
    <section className="min-h-screen bg-[#111213] pt-24 pb-20 text-[#f5f5f2] md:pt-32 md:pb-24">
      <div className="keffi-wrap">
        <div>
          <Link
            href="/"
            className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 font-mono text-xs text-white/85 transition hover:-translate-y-0.5 hover:border-white/50 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{locale === "id" ? "Kembali ke Beranda" : "Return to Home"}</span>
          </Link>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-b border-white/12 pb-8">
            <div>
              <span className="sec-kicker !text-white/70">
                <span>
                  {locale === "id"
                    ? "BRANKAS LISENSI & SERTIFIKASI RESMI"
                    : "VERIFIED CREDENTIALS & AWARDS VAULT"}
                </span>
              </span>
              <h1 className="hero-giant mt-4 !text-[#f5f5f2]">
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
                    className={`min-h-[36px] rounded-full border px-4 py-2 font-mono text-xs font-semibold transition hover:-translate-y-0.5 ${active
                      ? "border-[#f5f5f2] bg-[#f5f5f2] text-[#111213]"
                      : "border-white/20 bg-white/5 text-white/80 hover:border-white/40 hover:text-white"
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
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {visible.map((cert) => {
            const isCrown =
              cert.category === "Prestasi Nasional" ||
              cert.id === "6f1d2c3a-0001-4a5b-9c01-0e0f00000001";

            if (isCrown) {
              return (
                <TiltedCard
                  key={cert.id}
                  maxTilt={3}
                  cursorLabel="CROWN ACHIEVEMENT"
                  className="h-full rounded-[24px] md:col-span-2"
                >
                  <SpotlightCard
                    spotlightColor="rgba(255, 255, 255, 0.08)"
                    onClick={() => {
                      playMechanicalClick(750);
                      setSelectedCert(cert);
                    }}
                    className="flex h-full cursor-pointer flex-col justify-between rounded-[24px] border border-amber-300/35 bg-[#17181d] p-6 transition-all duration-300 hover:border-amber-300/60 md:p-8"
                  >
                    <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12 md:gap-8">
                      {/* Left: Certificate Preview Frame */}
                      <div className="relative h-60 w-full overflow-hidden rounded-2xl border border-white/12 bg-[#0d0f14] md:col-span-5 md:h-80">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={cert.imageUrl}
                          alt={cert.title}
                          width={800}
                          height={600}
                          loading="eager"
                          fetchPriority="high"
                          className="h-full w-full object-contain transition-transform duration-500 hover:scale-[1.03]"
                        />
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full border border-amber-300/40 bg-black/85 px-3 py-1 font-mono text-[10px] font-bold text-amber-200 backdrop-blur-md">
                          <Star className="h-3 w-3 fill-amber-200 text-amber-200" aria-hidden="true" />
                          <span>JUARA II NASIONAL</span>
                        </div>
                        <span className="absolute bottom-3 left-3 rounded-full bg-black/80 px-3 py-1 font-mono text-[10px] text-white/80 backdrop-blur-sm">
                          {cert.issueDate}
                        </span>
                      </div>

                      {/* Right: Rich Details & Actions */}
                      <div className="flex flex-col justify-between space-y-4 md:col-span-7">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/35 bg-amber-400/10 px-3 py-1 font-mono text-[11px] font-semibold text-amber-200">
                              <Trophy className="h-3.5 w-3.5 text-amber-200" aria-hidden="true" />
                              <span>PRESTASI UTAMA NASIONAL</span>
                            </span>
                            <span className="rounded-full border border-white/12 bg-black/40 px-3 py-1 font-mono text-[11px] text-white/75">
                              Kemenag RI · OASE III PTKIN
                            </span>
                          </div>

                          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white md:text-3xl">
                            {cert.title}
                          </h2>

                          <div className="mt-2 flex flex-wrap items-center gap-3 font-mono text-xs text-white/75">
                            <span className="inline-flex items-center gap-1.5 text-amber-200">
                              <Award className="h-4 w-4" aria-hidden="true" />
                              <span>{cert.issuer}</span>
                            </span>
                            {cert.credentialId && (
                              <span className="inline-flex items-center gap-1 rounded bg-white/5 px-2 py-0.5 text-[11px] text-white/80">
                                <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
                                No. SK: {cert.credentialId}
                              </span>
                            )}
                          </div>

                          {(cert.summaryId || cert.summaryEn) && (
                            <p className="mt-3.5 text-sm leading-relaxed text-white/80">
                              {locale === "id" ? cert.summaryId : cert.summaryEn}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 font-mono text-xs">
                          <span className="font-semibold text-white/70">
                            Klik kartu untuk memperbesar
                          </span>
                          <div className="flex items-center gap-3">
                            {cert.fileUrl && (
                              <a
                                href={cert.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full bg-[#f5f5f2] px-4 py-1.5 font-sans text-xs font-semibold text-[#111213] transition hover:-translate-y-0.5 hover:bg-white"
                              >
                                <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                                <span>Buka Dokumen PDF Resmi</span>
                                <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </SpotlightCard>
                </TiltedCard>
              );
            }

            return (
              <TiltedCard
                key={cert.id}
                maxTilt={4}
                cursorLabel="INSPECT"
                className="h-full rounded-[24px]"
              >
                <SpotlightCard
                  spotlightColor="rgba(255, 255, 255, 0.08)"
                  onClick={() => {
                    playMechanicalClick(720);
                    setSelectedCert(cert);
                  }}
                  className="flex h-full cursor-pointer flex-col justify-between rounded-[24px] border border-white/12 bg-[#171920] p-6 shadow-md transition hover:border-white/30 md:p-8"
                >
                  <div>
                    {/* Certificate Image Frame */}
                    <div className="relative h-56 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f14] md:h-64">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cert.imageUrl}
                        alt={cert.title}
                        width={800}
                        height={600}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                      />
                      <span className="absolute bottom-3 left-3 rounded-full bg-black/85 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">
                        {cert.category}
                      </span>
                      <span className="absolute bottom-3 right-3 rounded-full bg-black/85 px-3 py-1 font-mono text-[10px] text-white/80 backdrop-blur-sm">
                        {cert.issueDate}
                      </span>
                    </div>

                    <div className="mt-6 flex items-center justify-between font-mono text-xs text-white/75">
                      <span className="inline-flex items-center gap-1.5 text-white/85">
                        <Award className="h-4 w-4" aria-hidden="true" />
                        <span>{cert.issuer}</span>
                      </span>
                      {cert.credentialId && (
                        <span className="line-clamp-1 text-[11px] text-white/65">
                          ID: {cert.credentialId}
                        </span>
                      )}
                    </div>

                    <h2 className="mt-3 text-xl font-medium tracking-tight text-white md:text-2xl">
                      {cert.title}
                    </h2>

                    {(cert.summaryId || cert.summaryEn) && (
                      <p className="mt-3 text-sm leading-relaxed text-white/75">
                        {locale === "id" ? cert.summaryId : cert.summaryEn}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 font-mono text-xs">
                    <span className="font-semibold text-white/75">
                      Klik untuk memperbesar
                    </span>
                    <div className="flex items-center gap-3">
                      {cert.fileUrl && (
                        <a
                          href={cert.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex min-h-[32px] items-center gap-1 text-white/85 transition hover:-translate-y-0.5 hover:text-white"
                        >
                          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Dokumen</span>
                          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                        </a>
                      )}
                      {cert.verifyUrl && (
                        <a
                          href={cert.verifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex min-h-[32px] items-center gap-1 text-white/85 transition hover:-translate-y-0.5 hover:text-white hover:underline"
                        >
                          <span>Verifikasi</span>
                          <ExternalLink className="h-3 w-3" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </div>
                </SpotlightCard>
              </TiltedCard>
            );
          })}
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
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[32px] border border-white/15 bg-[#171920] p-6 text-[#f5f5f2] shadow-md md:p-8"
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
