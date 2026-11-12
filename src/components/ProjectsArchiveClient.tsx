"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Filter } from "lucide-react";
import type { ProjectCaseStudy } from "@/data/site";
import { usePortfolioState } from "@/lib/i18n/context";

export function ProjectsArchiveClient({ projects }: { projects: ProjectCaseStudy[] }) {
  const { locale } = usePortfolioState();
  const [selectedStack, setSelectedStack] = useState<string>("ALL");

  const allStacks = ["ALL", "TypeScript", "Next.js", "Supabase", "PostgreSQL", "Playwright", "GSAP"];

  const filtered =
    selectedStack === "ALL"
      ? projects
      : projects.filter((p) =>
          p.stack.some((s) => s.toLowerCase().includes(selectedStack.toLowerCase()))
        );

  return (
    <section className="section-shell bg-[var(--bg)] pt-24 md:pt-32">
      <div className="page-grid">
        <div className="col-span-12">
          <Link
            href="/"
            className="inline-flex min-h-[36px] items-center gap-2 py-1 text-xs font-semibold text-[var(--ink-muted)] transition hover:-translate-x-0.5 hover:text-[var(--accent)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{locale === "id" ? "Kembali ke Beranda" : "Back to Home"}</span>
          </Link>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-6 border-b border-[var(--rule)] pb-6">
            <div>
              <span className="eyebrow">
                {locale === "id" ? "Daftar Proyek & Studi Kasus" : "Projects & Case Studies"}
              </span>
              <h1 className="page-display-title mt-2">
                {locale === "id" ? "Arsip Proyek Pengembangan" : "Software Projects Archive"}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--ink-muted)]">
                <Filter className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden="true" />
                <span>Filter:</span>
              </span>
              {allStacks.map((tag) => {
                const active = selectedStack === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedStack(tag)}
                    className={`min-h-[34px] rounded-lg border px-3 py-1 font-mono text-xs transition hover:-translate-y-0.5 ${
                      active
                        ? "border-[var(--ink)] bg-[var(--ink)] text-white font-semibold"
                        : "border-[var(--rule-strong)] bg-white text-[var(--ink-muted)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
                    }`}
                  >
                    {tag === "ALL" ? (locale === "id" ? "Semua" : "All") : tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-span-12 mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {filtered.map((project) => (
            <article key={project.id} className="surface-card flex flex-col justify-between p-6">
              <div>
                <div className="flex items-center justify-between border-b border-[var(--rule)] pb-3 font-mono text-xs">
                  <span className="font-semibold text-[var(--accent)]">
                    {project.category}
                  </span>
                  <span className="text-[var(--ink-muted)]">{project.year}</span>
                </div>

                <h2 className="card-display-title mt-4">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex min-h-[30px] items-center py-0.5 transition hover:-translate-y-0.5 hover:text-[var(--accent)] hover:underline"
                  >
                    {project.title}
                  </Link>
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
                  {locale === "id" ? project.summaryId : project.summaryEn}
                </p>

                <dl className="mt-5 grid grid-cols-3 gap-2">
                  {project.metrics.map((m) => (
                    <div
                      key={m.labelEn}
                      className="rounded-xl border border-[var(--rule)] bg-[var(--bg)] p-3"
                    >
                      <dt className="font-mono text-[10px] uppercase text-[var(--ink-muted)]">
                        {locale === "id" ? m.labelId : m.labelEn}
                      </dt>
                      <dd className="font-mono-tabular mt-1 text-sm font-bold text-[var(--ink)]">
                        {m.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-[var(--rule)] bg-[var(--bg)] px-2.5 py-1 font-mono text-[11px] text-[var(--ink)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[var(--rule)] pt-4">
                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex min-h-[34px] items-center gap-1.5 text-xs font-semibold text-[var(--accent)] transition hover:-translate-y-0.5 hover:underline"
                >
                  <span>{locale === "id" ? "Baca Detail Proyek" : "Read Case Study"}</span>
                  <ArrowUpRight className="arrow-icon h-3.5 w-3.5" aria-hidden="true" />
                </Link>

                <div className="flex items-center gap-3">
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[34px] items-center gap-1 font-mono text-xs text-[var(--ink-muted)] transition hover:-translate-y-0.5 hover:text-[var(--ink)]"
                  >
                    <span>GitHub</span>
                    <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </a>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[34px] items-center gap-1 font-mono text-xs text-[var(--ink-muted)] transition hover:-translate-y-0.5 hover:text-[var(--ink)]"
                  >
                    <span>Demo</span>
                    <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
