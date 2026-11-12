"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  GitBranch,
  Layers,
  Scale,
} from "lucide-react";
import type { ProjectCaseStudy } from "@/data/site";
import { usePortfolioState } from "@/lib/i18n/context";

export function ProjectCaseStudyClient({
  project,
  nextProject,
}: {
  project: ProjectCaseStudy;
  nextProject: ProjectCaseStudy | null;
}) {
  const { locale } = usePortfolioState();

  return (
    <article className="section-shell bg-[var(--bg)] pt-24 md:pt-32">
      <div className="page-grid">
        {/* Back Breadcrumb */}
        <div className="col-span-12 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--rule)] pb-4">
          <Link
            href="/projects"
            className="inline-flex min-h-[36px] items-center gap-2 py-1 text-xs font-semibold text-[var(--ink-muted)] transition hover:-translate-x-0.5 hover:text-[var(--accent)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{locale === "id" ? "Semua Proyek" : "All Projects"}</span>
          </Link>

          <div className="font-mono text-xs text-[var(--ink-muted)]">
            {project.year} · {project.clientOrContext}
          </div>
        </div>

        {/* Case Study Hero Header */}
        <header className="col-span-12 mt-6 lg:col-span-8">
          <span className="eyebrow">
            {project.category}
          </span>
          <h1 className="page-display-title mt-3">{project.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--ink-muted)] sm:text-lg">
            {locale === "id" ? project.summaryId : project.summaryEn}
          </p>
        </header>

        {/* Quick Links & Role Metadata */}
        <aside className="surface-card col-span-12 mt-6 flex flex-col justify-between p-6 lg:col-span-4">
          <div>
            <div className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
              {locale === "id" ? "Peran & Tanggung Jawab" : "Engineering Role"}
            </div>
            <div className="mt-1 text-lg font-bold text-[var(--ink)]">
              {locale === "id" ? project.roleId : project.roleEn}
            </div>
            <div className="mt-4 font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
              {locale === "id" ? "Teknologi yang Digunakan" : "Tech Stack"}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {project.stack.map((item) => (
                <span
                  key={item}
                  className="rounded-md border border-[var(--rule)] bg-[var(--bg)] px-2.5 py-1 font-mono text-[11px] font-medium text-[var(--ink)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2.5 border-t border-[var(--rule)] pt-4">
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full justify-between !py-2.5"
            >
              <span>{locale === "id" ? "Buka Repository GitHub" : "View GitHub Repository"}</span>
              <ArrowUpRight className="arrow-icon h-4 w-4" aria-hidden="true" />
            </a>
            <Link
              href="/#contact"
              className="btn-secondary w-full justify-between !py-2.5"
            >
              <span>{locale === "id" ? "Diskusikan Proyek Serupa" : "Discuss Similar Project"}</span>
              <Layers className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
            </Link>
          </div>
        </aside>

        {/* Impact Metrics Row */}
        <div className="col-span-12 mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {project.metrics.map((metric) => (
            <div key={metric.labelEn} className="surface-card p-5">
              <div className="font-mono text-xs uppercase tracking-wider text-[var(--ink-muted)]">
                {locale === "id" ? metric.labelId : metric.labelEn}
              </div>
              <div className="font-mono-tabular mt-2 text-3xl font-bold text-[var(--ink)]">
                {metric.value}
              </div>
              <div className="mt-1 inline-flex items-center gap-1.5 font-mono text-xs text-[var(--accent)]">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{metric.delta}</span>
              </div>
            </div>
          ))}
        </div>

        {/* System Architecture Flow */}
        <div className="surface-card col-span-12 mt-6 p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--rule)] pb-3 font-mono text-xs">
            <span className="inline-flex items-center gap-2 font-semibold text-[var(--ink)]">
              <Cpu className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
              <span>{locale === "id" ? "Alur Arsitektur Sistem" : "System Architecture Flow"}</span>
            </span>
            <span className="text-[var(--accent)]">{project.diagramSpec.throughputLabel}</span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-4">
            {[
              { stage: "01 · Input", title: project.diagramSpec.inputNode },
              { stage: "02 · Edge", title: project.diagramSpec.edgeNode },
              { stage: "03 · Core", title: project.diagramSpec.coreNode },
              { stage: "04 · Output", title: project.diagramSpec.outputNode },
            ].map((node) => (
              <div key={node.stage} className="rounded-xl border border-[var(--rule)] bg-[var(--bg)] p-4">
                <div className="font-mono text-[11px] font-semibold text-[var(--accent)]">{node.stage}</div>
                <div className="mt-1.5 text-base font-bold text-[var(--ink)]">{node.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Problem Statement & System Architecture Deep-Dive */}
        <div className="col-span-12 mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="surface-card p-6 lg:col-span-6">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
              <span>01 · {locale === "id" ? "Latar Belakang Masalah" : "Problem Statement"}</span>
            </div>
            <h2 className="mt-2 text-xl font-bold text-[var(--ink)]">
              {locale === "id"
                ? "Tantangan Teknis yang Dihadapi"
                : "Technical Challenges Addressed"}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)] sm:text-base">
              {locale === "id" ? project.problemId : project.problemEn}
            </p>
          </div>

          <div className="surface-card p-6 lg:col-span-6">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
              <GitBranch className="h-3.5 w-3.5" aria-hidden="true" />
              <span>02 · {locale === "id" ? "Arsitektur Solusi" : "Solution Architecture"}</span>
            </div>
            <h2 className="mt-2 text-xl font-bold text-[var(--ink)]">
              {locale === "id"
                ? "Implementasi & Desain Sistem"
                : "System Design & Implementation"}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)] sm:text-base">
              {locale === "id" ? project.architectureId : project.architectureEn}
            </p>
          </div>
        </div>

        {/* Architectural Decisions */}
        {project.tradeoffs.length > 0 && (
          <div className="col-span-12 mt-6">
            <div className="surface-card p-6 md:p-8">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                <Scale className="h-4 w-4" aria-hidden="true" />
                <span>
                  03 · {locale === "id" ? "Keputusan Teknis Utama" : "Key Technical Decisions"}
                </span>
              </div>

              <div className="mt-5 space-y-4">
                {project.tradeoffs.map((item) => (
                  <div
                    key={item.decision}
                    className="rounded-xl border border-[var(--rule)] bg-[var(--bg)] p-5"
                  >
                    <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)]">
                      {item.decision}
                    </div>
                    <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div className="rounded-lg border border-blue-200 bg-blue-50/70 p-3">
                        <span className="font-mono text-[10px] font-semibold uppercase text-[var(--accent)]">
                          {locale === "id" ? "Pendekatan yang Dipilih" : "Chosen Approach"}
                        </span>
                        <div className="mt-1 font-mono text-sm font-bold text-[var(--ink)]">
                          {item.chosen}
                        </div>
                      </div>
                      <div className="rounded-lg border border-[var(--rule)] bg-white p-3">
                        <span className="font-mono text-[10px] uppercase text-[var(--ink-muted)]">
                          {locale === "id" ? "Alternatif Pembanding" : "Alternative Evaluated"}
                        </span>
                        <div className="mt-1 font-mono text-sm text-[var(--ink-muted)]">
                          {item.alternative}
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
                      {locale === "id" ? item.rationaleId : item.rationaleEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Next Project Navigation */}
        {nextProject && (
          <div className="col-span-12 mt-10">
            <Link
              href={`/projects/${nextProject.slug}`}
              className="surface-card group flex flex-wrap items-center justify-between gap-6 p-7"
            >
              <div>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
                  {locale === "id" ? "Proyek Berikutnya" : "Next Project"}
                </span>
                <h3 className="mt-1.5 text-2xl font-bold text-[var(--ink)] transition group-hover:translate-x-0.5 group-hover:text-[var(--accent)]">
                  {nextProject.title}
                </h3>
              </div>
              <span className="btn-primary">
                <span>{locale === "id" ? "Lihat Proyek" : "View Project"}</span>
                <ArrowRight className="arrow-icon h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
