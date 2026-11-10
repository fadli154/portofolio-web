"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Award,
  BookOpen,
  Briefcase,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  Copy,
  ExternalLink,
  Eye,
  FileCheck2,
  FileText,
  FolderGit2,
  GitFork,
  Layers,
  Mail,
  ShieldCheck,
  Sparkles,
  Star,
  Terminal,
  Users,
  X,
} from "lucide-react";
import { usePortfolioState } from "@/lib/i18n/context";
import {
  CERTIFICATES,
  EXPERIENCES,
  KWU_SESSIONS,
  PROJECTS,
  SITE_PROFILE,
  SKILL_GROUP_CARDS,
  SWOT_STRENGTHS,
  SWOT_WEAKNESSES,
  TEAM_K1_MEMBERS,
  type CertificateItem,
  type EducationItem,
  type ExperienceItem,
  type KwuSessionItem,
  type ProjectCaseStudy,
  type TechnologyItem,
} from "@/data/site";
import { playMechanicalClick } from "@/lib/audio/sound-effects";
import {
  loadCmsStoreClient,
  type CmsDynamicStore,
} from "@/lib/data/cms-persistence";
import { BlurText } from "@/components/reactbits/BlurText";
import { DecryptedText } from "@/components/reactbits/DecryptedText";
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";
import { TiltedCard } from "@/components/reactbits/TiltedCard";
import { CountUp } from "@/components/reactbits/CountUp";
import { Magnet } from "@/components/reactbits/Magnet";
import { CustomCursor } from "@/components/reactbits/CustomCursor";
import { DriftWall, type DriftWallItem } from "@/components/reactbits/DriftWall";
import { TechText } from "@/components/reactbits/TechText";
import { RotatingText } from "@/components/reactbits/RotatingText";
import { FlexCarousel, type FlexCarouselItem } from "@/components/reactbits/FlexCarousel";
import LanyardWrapper from "@/components/reactbits/LanyardWrapper";
import { KeffiStackFigure } from "@/components/figures/keffi-svc-figures";

interface HomeClientSectionsProps {
  profile: typeof SITE_PROFILE;
  projects: ProjectCaseStudy[];
  experiences: ExperienceItem[];
  educations: EducationItem[];
  certificates: CertificateItem[];
  technologies: TechnologyItem[];
  architectureRigSlot?: React.ReactNode;
}

interface GitHubRepoItem {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
}

interface GitHubUserStats {
  public_repos: number;
  followers: number;
  following: number;
}

const FALLBACK_GITHUB_REPOS: GitHubRepoItem[] = [
  {
    id: 101,
    name: "smart-hajj-accessibility-ai",
    html_url: "https://github.com/fadli154",
    description:
      "Sistem Aksesibilitas Inklusif Jemaah Haji berbasis Computer Vision: Deteksi Mata Uang Riyal (SAR) & Bahasa Isyarat 2 Arah (MediaPipe).",
    language: "Python",
    stargazers_count: 14,
    forks_count: 3,
    fork: false,
  },
  {
    id: 102,
    name: "simduk-kominfo-laravel",
    html_url: "https://github.com/fadli154",
    description:
      "Aplikasi Web Pendataan Kependudukan (SIMDUK) berbasis Laravel & MySQL dengan validasi NIK/KK, rekap sensus RT/RW, dan RBAC.",
    language: "PHP",
    stargazers_count: 11,
    forks_count: 2,
    fork: false,
  },
  {
    id: 103,
    name: "govtech-reporting-portal",
    html_url: "https://github.com/fadli154",
    description:
      "Portal pelaporan daring dan integrasi data antardivisi instansi pemerintah dengan pelacakan status berkas berkala berbasis SOP.",
    language: "TypeScript",
    stargazers_count: 9,
    forks_count: 1,
    fork: false,
  },
  {
    id: 104,
    name: "portofolio-kewirausahaan-k1",
    html_url: "https://github.com/fadli154",
    description:
      "Portal dokumentasi akademik Kewirausahaan, evaluasi SWOT 20 poin, dan ekosistem kolaborasi Kelompok K-1 Informatika.",
    language: "TypeScript",
    stargazers_count: 8,
    forks_count: 2,
    fork: false,
  },
];

const SVC_VARIANTS = [
  "svc--lime",
  "svc--bone",
  "svc--violet",
  "svc--white",
  "svc--obsidian",
] as const;

export function HomeClientSections({
  profile,
  projects: initialProjects,
  experiences: initialExperiences,
  certificates: initialCertificates = [],
}: HomeClientSectionsProps) {
  const { locale, openInquiryWithScope } = usePortfolioState();
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Dynamic CMS state synced with Admin Dashboard & Supabase
  const [dynamicExperiences, setDynamicExperiences] =
    useState<ExperienceItem[]>(initialExperiences.length > 0 ? initialExperiences : EXPERIENCES);
  const [dynamicProjects, setDynamicProjects] =
    useState<ProjectCaseStudy[]>(initialProjects.length > 0 ? initialProjects : PROJECTS);
  const [dynamicCertificates, setDynamicCertificates] =
    useState<CertificateItem[]>(
      initialCertificates.length > 0 ? initialCertificates : CERTIFICATES
    );
  const [courseworkSessions, setCourseworkSessions] =
    useState<KwuSessionItem[]>(KWU_SESSIONS);

  // Interactive Lightbox / Modal state
  const [selectedCertModal, setSelectedCertModal] =
    useState<CertificateItem | null>(null);

  // Coursework & Ecosystem interactive sub-view
  const [activeHubTab, setActiveHubTab] = useState<
    "pertemuan" | "kelompok-k1" | "swot" | "github"
  >("pertemuan");
  const [selectedSessionModal, setSelectedSessionModal] =
    useState<KwuSessionItem | null>(null);
  const [pertemuanViewMode, setPertemuanViewMode] = useState<"carousel" | "grid">("carousel");

  const courseworkFlexItems: FlexCarouselItem[] = useMemo(() => {
    return courseworkSessions.map((session) => ({
      id: session.number,
      badge: session.code,
      title: locale === "id" ? session.titleId : session.titleEn,
      subtitle: locale === "id" ? session.descId : session.descEn,
      src: session.attendanceProofUrl || "",
      status: session.attendanceStatus || "Hadir",
      taskTitle: session.taskTitle || "",
      taskStatus: session.taskStatus || "Selesai",
      date: session.sessionDate || `Minggu ${session.number} · 2026`,
      raw: session,
    }));
  }, [courseworkSessions, locale]);

  // Live GitHub API state (@fadli154)
  const [ghStats, setGhStats] = useState<GitHubUserStats>({
    public_repos: 18,
    followers: 24,
    following: 20,
  });
  const [ghRepos, setGhRepos] = useState<GitHubRepoItem[]>(FALLBACK_GITHUB_REPOS);
  const [ghLoading, setGhLoading] = useState(true);

  // Load dynamic CMS store on mount & listen for Admin updates
  useEffect(() => {
    const syncFromStore = (store: CmsDynamicStore) => {
      if (store.experiences?.length > 0) {
        setDynamicExperiences(store.experiences);
      }
      if (store.projects?.length > 0) {
        setDynamicProjects(
          store.projects.filter((p) => p.status === "published")
        );
      }
      if (store.courseworkSessions?.length > 0) {
        setCourseworkSessions(store.courseworkSessions);
      }
      if (store.certificates?.length > 0) {
        setDynamicCertificates(store.certificates);
      }
    };

    syncFromStore(loadCmsStoreClient());

    const handleCmsUpdate = (e: Event) => {
      const custom = e as CustomEvent<CmsDynamicStore>;
      if (custom.detail) {
        syncFromStore(custom.detail);
      } else {
        syncFromStore(loadCmsStoreClient());
      }
    };

    const handleStorage = () => {
      syncFromStore(loadCmsStoreClient());
    };

    window.addEventListener("fadli-cms-updated", handleCmsUpdate);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("fadli-cms-updated", handleCmsUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // Fetch live GitHub data for @fadli154
  useEffect(() => {
    let active = true;
    async function fetchGitHub() {
      try {
        const [uRes, rRes] = await Promise.all([
          fetch("https://api.github.com/users/fadli154"),
          fetch("https://api.github.com/users/fadli154/repos?sort=updated&per_page=6"),
        ]);
        if (uRes.ok && active) {
          const uData = await uRes.json();
          setGhStats({
            public_repos: uData.public_repos ?? 18,
            followers: uData.followers ?? 24,
            following: uData.following ?? 20,
          });
        }
        if (rRes.ok && active) {
          const rData: GitHubRepoItem[] = await rRes.json();
          const own = rData.filter((r) => !r.fork).slice(0, 6);
          if (own.length > 0) {
            setGhRepos(own);
          }
        }
      } catch {
        // Keep fallback
      } finally {
        if (active) setGhLoading(false);
      }
    }
    fetchGitHub();
    return () => {
      active = false;
    };
  }, []);

  const driftWallItems: DriftWallItem[] = useMemo(() => {
    const visible = dynamicCertificates.filter((c) => c.isVisible !== false);
    return visible.map((c) => ({
      id: c.id,
      image: c.imageUrl,
      title: c.title,
      issuer: c.issuer,
      issueDate: c.issueDate,
      credentialId: c.credentialId,
      category: c.category,
      summary: locale === "id" ? c.summaryId : c.summaryEn,
      fileUrl: c.fileUrl,
      verifyUrl: c.verifyUrl,
      raw: c,
    }));
  }, [dynamicCertificates, locale]);

  const handleCopyEmail = async () => {
    playMechanicalClick(760);
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      // ignore
    }
  };

  return (
    <div id="top" className="relative">
      <CustomCursor />

      {/* =====================================================================
          1. STUDIO KEFFI HERO + REACTBITS ANIMATED DISPLAY & 3D BENTO STAGE
         ===================================================================== */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="keffi-wrap">
          {/* Hero Top Grid: Left is Text Stack, Right is Pure 3D Lanyard (No Card Container) */}
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Left Column (7 cols): Kicker, Giant Headline, Description & CTAs */}
            <div className="lg:col-span-7">
              {/* Eyebrow Kicker with ReactBits RotatingText */}
              <div className="mb-6 flex flex-wrap items-center gap-4">
                <span className="sec-kicker">
                  <span className="sec-kicker__dot animate-pulse" aria-hidden="true" />
                  <RotatingText
                    texts={
                      locale === "id"
                        ? [
                            "PORTOFOLIO INFORMATIKA · WEB, MOBILE, GOVTECH & VISION AI",
                            "MAGANG RESMI · DINAS KOMINFO (SIMDUK LARAVEL & MYSQL)",
                            "INOVASI AI UNGGULAN · SMART HAJJ AKSESIBILITAS INKLUSIF",
                            "PORTAL AKADEMIK · KELOMPOK K-1 KEWIRAUSAHAAN",
                            "STACK REKAYASA · NEXT.JS 15, FLUTTER & PYTHON OPENCV",
                          ]
                        : [
                            "INFORMATICS PORTFOLIO · WEB, MOBILE, GOVTECH & VISION AI",
                            "OFFICIAL INTERNSHIP · DINAS KOMINFO (SIMDUK LARAVEL & MYSQL)",
                            "FLAGSHIP AI · SMART HAJJ INCLUSIVE ACCESSIBILITY",
                            "ACADEMIC PORTAL · ENTREPRENEURSHIP GROUP K-1",
                            "ENGINEERING STACK · NEXT.JS 15, FLUTTER & PYTHON OPENCV",
                          ]
                    }
                    rotationInterval={3000}
                    staggerDuration={0.015}
                    mainClassName="font-mono text-xs font-semibold tracking-wider text-[var(--ink)]"
                  />
                </span>
              </div>

              {/* Giant Studio Keffi Display Headline with ReactBits TechText */}
              <h1 className="hero-giant">
                <TechText
                  text="Fadli Hifziansyah"
                  guides={true}
                  specks={12}
                  clickKick={true}
                  draggable={true}
                  intro="assemble"
                  className="font-medium tracking-tight text-[var(--ink)]"
                />
                <span className="mt-2 block text-3xl font-normal tracking-tight text-[var(--mute)] md:text-5xl lg:text-6xl">
                  {locale === "id"
                    ? "— rekayasa web, mobile & computer vision."
                    : "— web, mobile & computer vision engineering."}
                </span>
              </h1>

              {/* Sub-Headline Description */}
              <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--mute)] md:text-lg">
                {locale === "id"
                  ? "Mendokumentasikan karya akademik perkuliahan Informatika, pengalaman magang resmi di Dinas Kominfo (SIMDUK Laravel & MySQL), sistem pelaporan GovTech, serta inovasi AI Smart Hajj."
                  : "Documenting Informatics university coursework, official internship work at Dinas Kominfo (SIMDUK Laravel & MySQL), GovTech portals, and Smart Hajj Vision AI."}
              </p>

              {/* CTAs & Action Pills */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Magnet strength={0.2}>
                  <a href="#work" className="keffi-pill-btn" data-cursor="EXPLORE">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={profile.avatarUrl}
                      alt={profile.fullName}
                      width={36}
                      height={36}
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-[#c4e22e]"
                    />
                    <span>
                      {locale === "id"
                        ? "Lihat Pengalaman & Proyek"
                        : "Explore Work & Experience"}
                    </span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </Magnet>

                <Magnet strength={0.16}>
                  <a href="#coursework" className="keffi-pill-outline">
                    <BookOpen className="h-4 w-4 text-[var(--violet)]" aria-hidden="true" />
                    <span>
                      {locale === "id"
                        ? "Portal Kewirausahaan (K-1)"
                        : "Coursework Portal (K-1)"}
                    </span>
                  </a>
                </Magnet>
              </div>
            </div>

            {/* Right Column (5 cols): Pure 3D Interactive Lanyard (No Card Container / Clean Floating WebGL) */}
            <div className="relative flex flex-col items-center justify-center lg:col-span-5">
              <div className="relative h-[420px] w-full cursor-grab active:cursor-grabbing sm:h-[480px]">
                <LanyardWrapper
                  frontImage="/fadli-profile.png"
                  backImage="/fadli-profile.png"
                  imageFit="cover"
                  finish="holographic"
                  cardColor="#ffffff"
                  strapColor="#111111"
                  orientation="portrait"
                  size={0.65}
                  gravity={1.1}
                  breeze={0.4}
                  damping={0.55}
                  elasticity={0.45}
                  interactive={true}
                  className="h-full w-full"
                />
              </div>
              <div className="pointer-events-none -mt-2 inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1 font-mono text-[11px] text-[var(--mute)] backdrop-blur-xs dark:border-white/10 dark:bg-white/5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#c4e22e]" />
                <span>{locale === "id" ? "Tarik / Goyangkan Kartu 3D ✦" : "Grab & Swing 3D Badge ✦"}</span>
              </div>
            </div>
          </div>

          {/* Below: Interactive Developer Terminal (Sole Showcase Element) */}
          <div className="mt-14 md:mt-20">
            <TiltedCard maxTilt={3.5} cursorLabel="TERMINAL" className="w-full rounded-[28px]">
              <SpotlightCard
                spotlightColor="rgba(196, 226, 46, 0.16)"
                className="flex w-full flex-col justify-between rounded-[28px] bg-[#111213] p-6 text-[#f5f5f2] shadow-2xl md:p-9"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-white/12 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                      <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                      <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
                      <span className="ml-2 font-mono text-xs text-white/55">
                        fadli@informatika-k1: ~/portfolio
                      </span>
                    </div>
                    <span className="rounded-full bg-[#c4e22e]/15 px-3 py-1 font-mono text-[11px] font-semibold text-[#c4e22e]">
                      bash · zsh
                    </span>
                  </div>

                  <div className="mt-6 space-y-3 font-mono text-xs leading-relaxed md:text-sm">
                    <div>
                      <span className="text-[#c4e22e]">➜</span>{" "}
                      <span className="text-sky-400">~</span>{" "}
                      <span className="text-white/90">whoami --profile</span>
                    </div>
                    <div className="pl-4 text-white/70">
                      {profile.fullName} (@{profile.handle}) · {locale === "id" ? profile.roleTitleId : profile.roleTitleEn}
                    </div>

                    <div className="pt-1">
                      <span className="text-[#c4e22e]">➜</span>{" "}
                      <span className="text-sky-400">~</span>{" "}
                      <span className="text-white/90">cat experience_and_flagship.json</span>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-xs text-white/80">
                      <div>
                        <span className="text-[#c4e22e]">&quot;internship&quot;</span>:{" "}
                        <span>&quot;Web Developer Intern · Dinas Kominfo (SIMDUK Laravel &amp; MySQL)&quot;</span>,
                      </div>
                      <div className="mt-1">
                        <span className="text-[#c4e22e]">&quot;flagship_ai&quot;</span>:{" "}
                        <span>&quot;Smart Hajj Vision AI (Deteksi Riyal SAR &amp; Isyarat 21-Titik)&quot;</span>,
                      </div>
                      <div className="mt-1">
                        <span className="text-[#c4e22e]">&quot;academic_team&quot;</span>:{" "}
                        <span>&quot;Kelompok K-1 Kewirausahaan ({courseworkSessions.length} Pertemuan Dinamis)&quot;</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/12 pt-5">
                  <div className="flex flex-wrap gap-2">
                    {["Laravel", "Next.js 15", "Flutter", "Python OpenCV", "MySQL & Supabase"].map(
                      (tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[11px] text-white/80"
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={profile.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-white/70 hover:text-[#c4e22e] transition"
                    >
                      LinkedIn ↗
                    </a>
                    <a
                      href={profile.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-white/70 hover:text-[#c4e22e] transition"
                    >
                      Instagram ↗
                    </a>
                    <a
                      href={profile.socials.kelompokK1}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-white/70 hover:text-[#c4e22e] transition"
                    >
                      Portal K-1 ↗
                    </a>
                    <a
                      href={profile.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#c4e22e] hover:underline"
                    >
                      <span>github.com/fadli154</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </SpotlightCard>
            </TiltedCard>
          </div>
        </div>
      </section>

      {/* Infinite Kinetic Ticker */}
      <div className="keffi-ticker" aria-hidden="true">
        <div className="keffi-ticker__track">
          {[...Array(2)].map((_, loopIdx) => (
            <React.Fragment key={loopIdx}>
              {[
                "FADLI HIFZIANSYAH (@FADLI154)",
                "DINAS KOMINFO · SIMDUK LARAVEL & MYSQL",
                "SMART HAJJ VISION AI · SAR & SIGN LANGUAGE",
                "MAHASISWA INFORMATIKA · KELOMPOK K-1",
                "REACT · NEXT.JS 15 · FLUTTER · OPENCV",
                "SUPABASE POSTGRESQL · DYNAMIC CMS",
              ].map((item, idx) => (
                <span
                  key={`${loopIdx}-${idx}`}
                  className="inline-flex items-center gap-5 font-mono text-xs font-medium uppercase tracking-widest text-[var(--ink)]"
                >
                  <span className="h-2 w-2 rounded-full bg-[var(--violet)]" />
                  <span>{item}</span>
                </span>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* =====================================================================
          2. STUDIO KEFFI EDITORIAL ABOUT & ANIMATED COUNTUP METRICS (#about)
         ===================================================================== */}
      <section id="about" className="py-20 md:py-28">
        <div className="keffi-wrap">
          <div className="keffi-grid items-start">
            {/* Left 3 Columns: Studio Keffi Metadata Definition List */}
            <dl className="col-span-12 grid grid-cols-2 gap-6 border-t border-[var(--line)] pt-5 sm:grid-cols-4 lg:col-span-3 lg:grid-cols-1">
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-widest text-[var(--mute)]">
                  {locale === "id" ? "Domisili" : "Based"}
                </dt>
                <dd className="mt-1 text-sm font-medium text-[var(--ink)]">
                  Indonesia · UTC+7
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-widest text-[var(--mute)]">
                  {locale === "id" ? "Fokus Teknis" : "Disciplines"}
                </dt>
                <dd className="mt-1 text-sm font-medium text-[var(--ink)]">
                  Web, Mobile, GovTech, Vision AI
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-widest text-[var(--mute)]">
                  {locale === "id" ? "Tim Akademik" : "Academic Group"}
                </dt>
                <dd className="mt-1 text-sm font-medium text-[var(--ink)]">
                  Informatika · Kelompok K-1
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-widest text-[var(--mute)]">
                  GitHub
                </dt>
                <dd className="mt-1 font-mono text-sm font-semibold text-[var(--violet)]">
                  @fadli154 ({ghStats.public_repos} Repos)
                </dd>
              </div>
            </dl>

            {/* Right 9 Columns: Large Indented Editorial Statement */}
            <div className="col-span-12 lg:col-span-9">
              <p className="about-statement">
                {locale === "id"
                  ? "Saya membangun perangkat lunak yang menyelesaikan masalah nyata di lapangan — mulai dari digitalisasi administrasi kependudukan SIMDUK di Dinas Kominfo menggunakan Laravel & MySQL, hingga sistem kecerdasan buatan Smart Hajj berbasis kamera ponsel untuk mendampingi jemaah disabilitas bertransaksi dan berkomunikasi secara mandiri."
                  : "I build software engineered for real-world utility — from digitizing municipal population records (SIMDUK) at Dinas Kominfo with Laravel & MySQL, to mobile Computer Vision AI (Smart Hajj) empowering deaf and elderly pilgrims to transact and communicate independently."}
              </p>

              {/* Studio Keffi 4-Column Animated Results / CountUp Row */}
              <div className="mt-16 grid grid-cols-2 gap-6 border-t border-[var(--line)] pt-10 md:grid-cols-4">
                <div>
                  <div className="font-sans text-5xl font-medium tracking-tight text-[var(--ink)] md:text-6xl">
                    <CountUp to={5} prefix="0" />
                  </div>
                  <div className="mt-2 font-mono text-xs uppercase tracking-wider text-[var(--mute)]">
                    {locale === "id" ? "Pilar Tech Stack" : "Tech Stack Pillars"}
                  </div>
                </div>

                <div>
                  <div className="font-sans text-5xl font-medium tracking-tight text-[var(--violet)] md:text-6xl">
                    <CountUp to={21} />
                  </div>
                  <div className="mt-2 font-mono text-xs uppercase tracking-wider text-[var(--mute)]">
                    {locale === "id"
                      ? "Titik Tangan MediaPipe AI"
                      : "MediaPipe Hand Landmarks"}
                  </div>
                </div>

                <div>
                  <div className="font-sans text-5xl font-medium tracking-tight text-[var(--ink)] md:text-6xl">
                    <CountUp to={courseworkSessions.length} prefix="0" />
                  </div>
                  <div className="mt-2 font-mono text-xs uppercase tracking-wider text-[var(--mute)]">
                    {locale === "id"
                      ? "Pertemuan Kuliah Tercatat"
                      : "Coursework Sessions Logged"}
                  </div>
                </div>

                <div>
                  <div className="font-sans text-5xl font-medium tracking-tight text-[var(--ink)] md:text-6xl">
                    <CountUp to={20} />
                  </div>
                  <div className="mt-2 font-mono text-xs uppercase tracking-wider text-[var(--mute)]">
                    {locale === "id"
                      ? "Indikator Evaluasi SWOT"
                      : "SWOT Evaluation Points"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. SELECTED WORK & REAL EXPERIENCE (#work) — DYNAMIC VIA ADMIN CMS
         ===================================================================== */}
      <section id="work" className="bg-white py-20 md:py-28">
        <div className="keffi-wrap">
          <div className="sec-head">
            <div>
              <span className="sec-kicker">
                <span className="sec-kicker__dot" />
                <RotatingText
                  texts={
                    locale === "id"
                      ? [
                          "REKAM JEJAK & KARYA UNGGULAN · DINAMIS",
                          "SIMDUK KOMINFO · WEB DEV INTERN LARAVEL",
                          "SMART HAJJ · AI VISION AKSESIBILITAS",
                          "PORTAL GOVTECH · PELAPORAN TERINTEGRASI",
                        ]
                      : [
                          "SELECTED EXPERIENCE & CASE STUDIES · DYNAMIC",
                          "SIMDUK KOMINFO · WEB DEV INTERN LARAVEL",
                          "SMART HAJJ · AI VISION ACCESSIBILITY",
                          "GOVTECH PORTAL · INTEGRATED REPORTING",
                        ]
                  }
                  rotationInterval={3200}
                />
              </span>
              <h2 className="sec-title mt-3">
                <BlurText
                  text={
                    locale === "id"
                      ? "Pengalaman & Studi Kasus."
                      : "Experience & Case Studies."
                  }
                />
              </h2>
            </div>

            <Link href="/projects" className="keffi-pill-outline">
              <span>
                {locale === "id" ? "Lihat Arsip Lengkap" : "View Full Archive"}
              </span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Studio Keffi Asymmetric Pair Showcase:
              Left 6 Cols = Pengalaman Nyata (Dynamic from CMS, starts with 1)
              Right 6 Cols = Dokumentasi Studi Kasus Proyek (Dynamic from CMS, starts with 1) */}
          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* COLUMN A: PENGALAMAN NYATA (EXPERIENCES) */}
            <div className="space-y-8 lg:col-span-6">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--violet)]">
                  <Briefcase className="h-4 w-4" />
                  <span>
                    {locale === "id"
                      ? `Pengalaman Nyata (${dynamicExperiences.length})`
                      : `Real-World Experience (${dynamicExperiences.length})`}
                  </span>
                </span>
                <span className="font-mono text-[11px] text-[var(--mute)]">
                  govtech · internship
                </span>
              </div>

              {dynamicExperiences.map((exp, idx) => {
                const role = locale === "id" ? exp.roleId : exp.roleEn;
                const summary = locale === "id" ? exp.summaryId : exp.summaryEn;
                const highlights =
                  locale === "id" ? exp.highlightsId : exp.highlightsEn;

                return (
                  <TiltedCard
                    key={exp.id}
                    maxTilt={4}
                    cursorLabel="EXPERIENCE"
                    className="rounded-[28px]"
                  >
                    <SpotlightCard
                      spotlightColor="rgba(91, 49, 200, 0.12)"
                      className="rounded-[28px] border border-[var(--line)] bg-[#f5f5f2] p-7 md:p-9"
                    >
                      {/* Visual Top Stage */}
                      <div className="relative mb-7 overflow-hidden rounded-2xl bg-[#111213] p-6 text-[#f5f5f2]">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="rounded-full bg-[#c4e22e] px-3 py-1 font-mono text-[11px] font-bold uppercase text-[#111213]">
                            {exp.employmentType}
                          </span>
                          <span className="font-mono text-xs text-white/65">
                            ({String(idx + 1).padStart(2, "0")}) · {exp.period}
                          </span>
                        </div>
                        <div className="mt-6">
                          <div className="font-mono text-xs uppercase tracking-widest text-[#c4e22e]">
                            {exp.metricsBadge}
                          </div>
                          <h3 className="mt-1.5 text-2xl font-medium tracking-tight text-white md:text-3xl">
                            {role}
                          </h3>
                          <p className="mt-1 text-sm text-white/75">{exp.company}</p>
                        </div>
                      </div>

                      {/* Editorial Description & Highlights */}
                      <p className="text-sm leading-relaxed text-[var(--ink)] md:text-base">
                        {summary}
                      </p>

                      <ul className="mt-6 space-y-3 border-t border-[var(--line)] pt-5">
                        {highlights.map((point, pIdx) => (
                          <li
                            key={pIdx}
                            className="flex items-start gap-3 text-xs leading-relaxed text-[var(--mute)] md:text-sm"
                          >
                            <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--violet)]/12 font-mono text-[10px] font-bold text-[var(--violet)]">
                              0{pIdx + 1}
                            </span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-6 flex flex-wrap gap-2 border-t border-[var(--line)] pt-5">
                        {exp.stack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-full border border-[var(--line)] bg-white px-3.5 py-1 font-mono text-xs font-medium text-[var(--ink)]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </SpotlightCard>
                  </TiltedCard>
                );
              })}
            </div>

            {/* COLUMN B: DOKUMENTASI STUDI KASUS PROYEK (PROJECTS) */}
            <div className="space-y-8 lg:col-span-6">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                <span className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--ink)]">
                  <Code2 className="h-4 w-4 text-[var(--violet)]" />
                  <span>
                    {locale === "id"
                      ? `Dokumentasi Studi Kasus Proyek (${dynamicProjects.length})`
                      : `Project Case Studies (${dynamicProjects.length})`}
                  </span>
                </span>
                <span className="font-mono text-[11px] text-[var(--mute)]">
                  architecture · case study
                </span>
              </div>

              {dynamicProjects.map((project, idx) => {
                const summary =
                  locale === "id" ? project.summaryId : project.summaryEn;
                const role = locale === "id" ? project.roleId : project.roleEn;

                return (
                  <TiltedCard
                    key={project.id}
                    maxTilt={4}
                    cursorLabel="VIEW CASE"
                    className="rounded-[28px]"
                  >
                    <SpotlightCard
                      spotlightColor="rgba(196, 226, 46, 0.2)"
                      className="rounded-[28px] border border-[var(--line)] bg-[#f5f5f2] p-7 md:p-9"
                    >
                      {/* Visual Architectural Stage */}
                      <div className="relative mb-7 overflow-hidden rounded-2xl bg-[#5b31c8] p-6 text-white">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="rounded-full bg-[#c4e22e] px-3 py-1 font-mono text-[11px] font-bold uppercase text-[#111213]">
                            {project.category}
                          </span>
                          <span className="font-mono text-xs text-white/75">
                            ({String(idx + 1).padStart(2, "0")}) · {project.year}
                          </span>
                        </div>

                        <h3 className="mt-5 text-2xl font-medium tracking-tight text-white md:text-3xl">
                          {project.title}
                        </h3>
                        <p className="mt-1 font-mono text-xs text-white/80">
                          {role} · {project.clientOrContext}
                        </p>

                        {/* Mini System Flow Diagram inside Card */}
                        <div className="mt-6 grid grid-cols-2 gap-2 border-t border-white/20 pt-4 font-mono text-[11px] sm:grid-cols-4">
                          {[
                            project.diagramSpec.inputNode,
                            project.diagramSpec.edgeNode,
                            project.diagramSpec.coreNode,
                            project.diagramSpec.outputNode,
                          ].map((node, nIdx) => (
                            <div
                              key={nIdx}
                              className="rounded-xl bg-black/25 p-2.5 text-white/95"
                            >
                              <div className="text-[9px] text-[#c4e22e]">
                                STAGE 0{nIdx + 1}
                              </div>
                              <div className="mt-0.5 truncate font-semibold">
                                {node}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <p className="text-sm leading-relaxed text-[var(--ink)] md:text-base">
                        {summary}
                      </p>

                      {/* Key Metrics */}
                      {project.metrics && project.metrics.length > 0 && (
                        <div className="mt-6 grid grid-cols-3 gap-3 border-t border-[var(--line)] pt-5">
                          {project.metrics.map((m, mIdx) => (
                            <div
                              key={mIdx}
                              className="rounded-2xl bg-white p-3.5 border border-[var(--line)]"
                            >
                              <div className="font-mono text-[10px] uppercase text-[var(--mute)]">
                                {locale === "id" ? m.labelId : m.labelEn}
                              </div>
                              <div className="mt-1 text-lg font-bold text-[var(--ink)]">
                                {m.value}
                              </div>
                              <div className="font-mono text-[10px] text-[var(--violet)]">
                                {m.delta}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-5">
                        <div className="flex flex-wrap gap-1.5">
                          {project.stack.map((tech) => (
                            <span
                              key={tech}
                              className="rounded-full border border-[var(--line)] bg-white px-3 py-1 font-mono text-xs font-medium text-[var(--ink)]"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        <Link
                          href={`/projects/${project.slug}`}
                          className="keffi-pill-btn !py-2 !pl-4 !pr-4 !text-xs"
                        >
                          <span>
                            {locale === "id" ? "Baca Studi Kasus" : "Read Case Study"}
                          </span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </SpotlightCard>
                  </TiltedCard>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. DARK STUDIO KEFFI STICKY STACKING TECH STACK & TRANSPARENT /ANATOMY
         ===================================================================== */}
      <section id="stack" className="bg-[#111213] py-24 text-[#f5f5f2] md:py-32">
        <div className="keffi-wrap">
          <div className="sec-head sec-head--dark">
            <div>
              <span className="sec-kicker !text-white/60">
                <span className="sec-kicker__dot sec-kicker__dot--lime" />
                <RotatingText
                  texts={
                    locale === "id"
                      ? [
                          "ARSITEKTUR SISTEM & 5 KATEGORI TECH STACK",
                          "EXPLODED-VIEW · INSTRUMEN ANATOMI 3D",
                          "FRONTEND, BACKEND, MOBILE, AI & DEVOPS",
                        ]
                      : [
                          "SYSTEM ARCHITECTURE & 5 TECH STACK PILLARS",
                          "EXPLODED-VIEW · 3D ANATOMY RIGS",
                          "FRONTEND, BACKEND, MOBILE, AI & DEVOPS",
                        ]
                  }
                  rotationInterval={3400}
                  mainClassName="text-white/80"
                />
              </span>
              <h2 className="sec-title mt-3 text-[#f5f5f2]">
                <BlurText
                  text={
                    locale === "id"
                      ? "Keahlian & Instrumen Teknis."
                      : "Capabilities & Tech Stack."
                  }
                />
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-white/65">
              {locale === "id"
                ? "Lima instrumen mekanis isometrik 3D (/anatomy) dengan arsitektur fisik unik di setiap kartu — tarik vertikal untuk memicu efek exploded-view atau pilih stasiun untuk menginspeksi lapisan internal sistem."
                : "Five distinct 3D isometric mechanical instruments (/anatomy) with unique physical forms — drag vertically for exploded-view inspection or select a station to analyze the system layers."}
            </p>
          </div>

          {/* STUDIO KEFFI STICKY STACKING CARDS (.svc) WITH 5 /ANATOMY 3D MACHINES */}
          <div className="stack-list">
            {SKILL_GROUP_CARDS.map((group, idx) => {
              const variant = SVC_VARIANTS[idx % SVC_VARIANTS.length]!;
              return (
                <article
                  key={group.id}
                  style={{ "--i": idx } as React.CSSProperties}
                  className={`svc ${variant}`}
                >
                  <div className="keffi-grid items-center">
                    {/* Left 5 Columns: Editorial Stack Info */}
                    <div className="col-span-12 lg:col-span-5">
                      <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest opacity-75">
                        <span>(0{idx + 1})</span>
                        <span>·</span>
                        <span>{group.badge}</span>
                      </div>

                      <h3 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
                        {locale === "id" ? group.titleId : group.titleEn}
                      </h3>

                      <p className="mt-4 text-sm leading-relaxed opacity-80 md:text-base">
                        {locale === "id" ? group.descId : group.descEn}
                      </p>

                      {/* Skill Icons Row */}
                      <div className="mt-6">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={group.skillIconsUrl}
                          alt={group.titleEn}
                          loading="lazy"
                          className="h-10 w-auto object-contain"
                        />
                      </div>

                      <ul className="mt-6 flex flex-wrap gap-2">
                        {group.items.map((skill) => (
                          <li
                            key={skill}
                            className="rounded-full border border-current/20 bg-black/5 px-3.5 py-1.5 font-mono text-xs font-medium"
                          >
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Right 7 Columns: Background-Free Isometric SVG Figure */}
                    <div className="col-span-12 mt-6 lg:col-span-7 lg:mt-0">
                      <KeffiStackFigure id={group.id} />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          4.5 DRIFT WALL · VERIFIED CREDENTIALS & AWARDS VAULT (#certificates)
              Placed directly above "PORTAL AKADEMIK KEWIRAUSAHAAN · KELOMPOK K-1"
         ===================================================================== */}
      <section
        id="certificates"
        className="relative overflow-hidden border-t border-[var(--line)] bg-[#0c0d12] py-24 text-[#f5f5f2] md:py-32"
      >
        <div className="keffi-wrap">
          <div className="sec-head sec-head--dark">
            <div>
              <span className="sec-kicker !text-white/60">
                <span className="sec-kicker__dot sec-kicker__dot--lime" />
                <RotatingText
                  texts={
                    locale === "id"
                      ? [
                          "BRANKAS PRESTASI & SERTIFIKASI KOMPETENSI",
                          "JUARA 1 DESAIN WEBSITE UMKM · IT'S DAY 2025",
                          "JUARA II INOVASI TEKNOLOGI · OASE PTKI II",
                          "DRIFT WALL 3D · DOKUMEN RESMI TERVERIFIKASI",
                        ]
                      : [
                          "VERIFIED CREDENTIALS & AWARDS VAULT",
                          "1ST PLACE UMKM WEB DESIGN · IT'S DAY 2025",
                          "2ND PLACE TECH INNOVATION · OASE PTKI II",
                          "3D DRIFT WALL · VERIFIED CREDENTIALS",
                        ]
                  }
                  rotationInterval={3200}
                  mainClassName="text-white/80"
                />
              </span>
              <h2 className="sec-title mt-3 text-[#f5f5f2]">
                <BlurText
                  text={
                    locale === "id"
                      ? "Sertifikasi & Lisensi Resmi."
                      : "Credentials & Proven Competencies."
                  }
                />
              </h2>
            </div>
            <div className="flex flex-col items-start gap-4 lg:items-end">
              <p className="max-w-md text-sm leading-relaxed text-white/65">
                {locale === "id"
                  ? "Dinding interaktif 3D Drift Wall menampilkan lisensi dan sertifikat penghargaan yang tersinkronisasi dinamis dari Supabase. Arahkan pointer untuk mengubah perspektif 3D, atau klik pada tile untuk memeriksa dokumen detail."
                  : "Interactive 3D Drift Wall rendering verified credentials and competition awards synced dynamically from Supabase. Hover to shift perspective, or click any tile to inspect credential details."}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#c4e22e] px-3.5 py-1 font-mono text-xs font-bold text-[#111213]">
                  {dynamicCertificates.filter((c) => c.isVisible !== false).length}{" "}
                  {locale === "id" ? "Sertifikat Terverifikasi" : "Verified Credentials"}
                </span>
                <Link
                  href="/certificates"
                  className="keffi-pill-btn keffi-pill-btn--lime !py-1.5 !px-4 !text-xs"
                >
                  <span>{locale === "id" ? "Buka Brankas Lengkap" : "Open Full Vault"}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 3D PERSPECTIVE DRIFT WALL - SEAMLESS (NO ENCLOSING CARD, MERGED DIRECTLY INTO SECTION) */}
        <div className="relative mt-8 h-[540px] w-full overflow-hidden md:h-[620px]">
          <DriftWall
            items={driftWallItems}
            columns={4}
            tileWidth={290}
            tileHeight={200}
            gap={24}
            radius={18}
            tilt={13}
            turn={-10}
            perspective={1200}
            depth={110}
            speed={32}
            pauseOnHover={true}
            onTileClick={(item) => {
              const found = dynamicCertificates.find((c) => c.id === item.id);
              if (found) {
                setSelectedCertModal(found);
              } else if (item.raw) {
                setSelectedCertModal(item.raw as CertificateItem);
              }
            }}
          />
          {/* Ambient Lighting & Floating Interaction Hint */}
          <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 py-1.5 font-mono text-[11px] text-white/75 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c4e22e] animate-pulse" />
            <span>
              {locale === "id"
                ? "Arahkan kursor untuk memiringkan 3D · Klik tile untuk detail sertifikat"
                : "Hover to tilt 3D · Click tile to inspect certificate"}
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. PORTAL AKADEMIK KEWIRAUSAHAAN (PERTEMUAN, ABSEN, BUKTI, TUGAS),
             KELOMPOK K-1, EVALUASI SWOT & LIVE GITHUB (#coursework)
         ===================================================================== */}
      <section id="coursework" className="py-24 md:py-32">
        <div className="keffi-wrap">
          <div className="sec-head">
            <div>
              <span className="sec-kicker">
                <span className="sec-kicker__dot" />
                <RotatingText
                  texts={
                    locale === "id"
                      ? [
                          "PORTAL AKADEMIK KEWIRAUSAHAAN · KELOMPOK K-1",
                          "LOG PERTEMUAN MINGGUAN · ABSENSI & BUKTI FOTO",
                          "ANALISIS SWOT 20 INDIKATOR · REKOMENDASI",
                          "REPOSITORI GITHUB LIVE @FADLI154",
                        ]
                      : [
                          "ENTREPRENEURSHIP ACADEMIC PORTAL · GROUP K-1",
                          "WEEKLY SESSIONS LOG · ATTENDANCE & PROOF",
                          "SWOT MATRIX · 20 STRATEGIC INDICATORS",
                          "LIVE GITHUB REPOSITORY SYNC @FADLI154",
                        ]
                  }
                  rotationInterval={3200}
                />
              </span>
              <h2 className="sec-title mt-3">
                <BlurText
                  text={
                    locale === "id"
                      ? "Kewirausahaan & Ekosistem K-1."
                      : "Coursework & K-1 Ecosystem."
                  }
                />
              </h2>
            </div>

            {/* Studio Keffi Pill Switcher for Academic & Telemetry Sub-Views */}
            <div
              className="flex flex-wrap gap-2 rounded-full bg-[var(--bone)] p-1.5"
              role="tablist"
              aria-label="Academic and telemetry tabs"
            >
              {[
                {
                  id: "pertemuan" as const,
                  label:
                    locale === "id"
                      ? `Pertemuan & Tugas (${courseworkSessions.length})`
                      : `Sessions & Tasks (${courseworkSessions.length})`,
                  icon: ClipboardCheck,
                },
                {
                  id: "kelompok-k1" as const,
                  label:
                    locale === "id"
                      ? "Anggota Kelompok K-1 (5)"
                      : "Group K-1 Members (5)",
                  icon: Users,
                },
                {
                  id: "swot" as const,
                  label:
                    locale === "id"
                      ? "Evaluasi SWOT (20 Poin)"
                      : "SWOT Matrix (20 Pts)",
                  icon: Layers,
                },
                {
                  id: "github" as const,
                  label: "GitHub Live (@fadli154)",
                  icon: FolderGit2,
                },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeHubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => {
                      playMechanicalClick(680);
                      setActiveHubTab(tab.id);
                    }}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium transition-all ${
                      active
                        ? "bg-[var(--ink)] text-[var(--cream)] shadow-sm"
                        : "text-[var(--ink)] hover:bg-black/5"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB 1: DYNAMIC PERTEMUAN, ABSEN, BUKTI KEHADIRAN & TUGAS */}
          {activeHubTab === "pertemuan" && (
            <div className="mt-12">
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[var(--line)] bg-white p-6">
                <div>
                  <div className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--violet)]">
                    MATA KULIAH KEWIRAUSAHAAN · LOG ABSENSI &amp; TUGAS TERINTEGRASI SUPABASE
                  </div>
                  <p className="mt-1 text-sm text-[var(--mute)]">
                    {locale === "id"
                      ? "Setiap pertemuan mencatat status kehadiran, foto bukti hadir, serta rincian tugas mingguan yang dikelola langsung oleh Fadli melalui CMS Admin."
                      : "Each session logs attendance status, attendance proof photo, and weekly task deliverables managed dynamically via the Admin CMS."}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                  <span className="rounded-full bg-emerald-500/15 px-3.5 py-1.5 font-semibold text-emerald-800">
                    {
                      courseworkSessions.filter(
                        (s) => (s.attendanceStatus || "Hadir") === "Hadir"
                      ).length
                    }{" "}
                    / {courseworkSessions.length} Hadir
                  </span>
                  <span className="rounded-full bg-[var(--violet)]/12 px-3.5 py-1.5 font-semibold text-[var(--violet)]">
                    {
                      courseworkSessions.filter(
                        (s) => (s.taskStatus || "Selesai") === "Selesai"
                      ).length
                    }{" "}
                    Tugas Selesai
                  </span>

                  {/* View Mode Switcher Pill */}
                  <div className="flex items-center rounded-full bg-black/5 p-1 border border-black/10">
                    <button
                      type="button"
                      onClick={() => {
                        playMechanicalClick(560);
                        setPertemuanViewMode("carousel");
                      }}
                      className={`rounded-full px-3 py-1 font-mono text-[11px] font-semibold transition-all ${
                        pertemuanViewMode === "carousel"
                          ? "bg-[var(--ink)] text-white shadow-sm"
                          : "text-[var(--mute)] hover:text-[var(--ink)]"
                      }`}
                    >
                      Carousel Flow
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playMechanicalClick(580);
                        setPertemuanViewMode("grid");
                      }}
                      className={`rounded-full px-3 py-1 font-mono text-[11px] font-semibold transition-all ${
                        pertemuanViewMode === "grid"
                          ? "bg-[var(--ink)] text-white shadow-sm"
                          : "text-[var(--mute)] hover:text-[var(--ink)]"
                      }`}
                    >
                      Grid
                    </button>
                  </div>
                </div>
              </div>

              {pertemuanViewMode === "carousel" ? (
                <div className="relative overflow-hidden rounded-[32px] border border-[var(--line)] bg-[#f5f5f2]/70 p-4 sm:p-6 md:p-8">
                  <FlexCarousel
                    items={courseworkFlexItems}
                    focusOnClick={true}
                    squeeze={0.25}
                    captions={true}
                    captureWheel={true}
                    onOpenModal={(item) => setSelectedSessionModal(item.raw)}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {courseworkSessions.map((session) => {
                    const status = session.attendanceStatus || "Hadir";
                    const taskStatus = session.taskStatus || "Selesai";
                    const statusColor =
                      status === "Hadir"
                        ? "bg-emerald-500/15 text-emerald-800 border-emerald-500/30"
                        : status === "Izin" || status === "Sakit"
                          ? "bg-amber-500/15 text-amber-800 border-amber-500/30"
                          : "bg-zinc-500/15 text-zinc-700 border-zinc-400/30";

                    return (
                      <TiltedCard
                        key={session.number}
                        maxTilt={4.5}
                        cursorLabel="DETAIL"
                        className="h-full rounded-[26px]"
                      >
                        <SpotlightCard
                          spotlightColor="rgba(91, 49, 200, 0.14)"
                          onClick={() => setSelectedSessionModal(session)}
                          className="flex h-full cursor-pointer flex-col justify-between rounded-[26px] border border-[var(--line)] bg-white p-6 shadow-sm"
                        >
                          <div>
                            {/* Header Row: Pertemuan Badge + Attendance Status */}
                            <div className="flex items-center justify-between gap-2">
                              <span className="rounded-full bg-[var(--ink)] px-3 py-1 font-mono text-[11px] font-semibold text-[var(--cream)]">
                                {session.code}
                              </span>
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] font-semibold ${statusColor}`}
                              >
                                <CheckCircle2 className="h-3 w-3" />
                                <span>Absen: {status}</span>
                              </span>
                            </div>

                            <h3 className="mt-4 text-xl font-medium tracking-tight text-[var(--ink)]">
                              {locale === "id" ? session.titleId : session.titleEn}
                            </h3>
                            <p className="mt-2 text-xs leading-relaxed text-[var(--mute)]">
                              {locale === "id" ? session.descId : session.descEn}
                            </p>

                            {/* Attendance Proof Preview Box */}
                            <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--line)] bg-[#f5f5f2]">
                              {session.attendanceProofUrl ? (
                                <div className="relative h-40 w-full">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={session.attendanceProofUrl}
                                    alt={`Bukti Kehadiran ${session.code}`}
                                    className="h-full w-full object-cover"
                                  />
                                  <span className="absolute bottom-2 right-2 rounded-full bg-black/75 px-2.5 py-1 font-mono text-[10px] text-[#c4e22e]">
                                    Bukti Terunggah ✓
                                  </span>
                                </div>
                              ) : (
                                <div className="flex h-28 flex-col items-center justify-center p-4 text-center">
                                  <FileCheck2 className="h-5 w-5 text-[var(--violet)]" />
                                  <span className="mt-1.5 font-mono text-[11px] font-medium text-[var(--ink)]">
                                    {status === "Hadir"
                                      ? "Kehadiran Tercatat di Sistem"
                                      : `Status: ${status}`}
                                  </span>
                                  <span className="text-[11px] text-[var(--mute)]">
                                    {session.sessionDate || "Semester Aktif · 2026"}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Task / Tugas Section inside Card */}
                            <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[#f5f5f2]/70 p-4">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--violet)]">
                                  TUGAS PERTEMUAN {session.number}
                                </span>
                                <span className="rounded-full bg-[#c4e22e] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#111213]">
                                  {taskStatus}
                                </span>
                              </div>
                              <div className="mt-1.5 text-sm font-semibold text-[var(--ink)]">
                                {session.taskTitle ||
                                  (locale === "id"
                                    ? "Dokumentasi & Evaluasi Mingguan"
                                    : "Weekly Coursework Deliverable")}
                              </div>
                              {session.taskDescription && (
                                <p className="mt-1 line-clamp-2 text-xs text-[var(--mute)]">
                                  {session.taskDescription}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="mt-5 flex items-center justify-between border-t border-[var(--line)] pt-4 font-mono text-xs">
                            <span className="inline-flex items-center gap-1.5 font-medium text-[var(--ink)]">
                              <Eye className="h-3.5 w-3.5 text-[var(--violet)]" />
                              <span>
                                {locale === "id"
                                  ? "Lihat Bukti & Tugas"
                                  : "Inspect Proof & Task"}
                              </span>
                            </span>
                            {session.taskUrl && (
                              <a
                                href={session.taskUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 font-semibold text-[var(--violet)] hover:underline"
                              >
                                <span>Link Tugas</span>
                                <ArrowUpRight className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </div>
                        </SpotlightCard>
                      </TiltedCard>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DIREKTORI 5 ANGGOTA KELOMPOK K-1 INFORMATIKA */}
          {activeHubTab === "kelompok-k1" && (
            <div className="mt-12 space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-[#111213] p-7 text-[#f5f5f2]">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-[#c4e22e]">
                    DIREKTORI KOLABORASI · KELOMPOK K-1 INFORMATIKA
                  </span>
                  <h3 className="mt-2 text-2xl font-medium">
                    5 Anggota Tim &amp; Klasifikasi Profil SWOT
                  </h3>
                </div>
                <a
                  href={profile.socials.kelompokK1}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="keffi-pill-btn keffi-pill-btn--lime !py-2.5 !px-5"
                >
                  <span>Buka Web Utama Kelompok K-1</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {TEAM_K1_MEMBERS.map((member) => (
                  <TiltedCard
                    key={member.number}
                    maxTilt={5}
                    cursorLabel="VISIT PORTO"
                    className="rounded-[26px]"
                  >
                    <SpotlightCard
                      spotlightColor={
                        member.isSelf
                          ? "rgba(196, 226, 46, 0.25)"
                          : "rgba(91, 49, 200, 0.14)"
                      }
                      className={`flex h-full flex-col justify-between rounded-[26px] border p-7 ${
                        member.isSelf
                          ? "border-[#111213] bg-[#c4e22e] text-[#111213]"
                          : "border-[var(--line)] bg-white text-[var(--ink)]"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs font-bold opacity-70">
                            ANGGOTA #{member.number}
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase ${
                              member.isSelf
                                ? "bg-[#111213] text-[#c4e22e]"
                                : member.roleType === "entrepreneur"
                                  ? "bg-[var(--violet)]/12 text-[var(--violet)]"
                                  : "bg-emerald-500/15 text-emerald-800"
                            }`}
                          >
                            {locale === "id"
                              ? member.roleBadgeId
                              : member.roleBadgeEn}
                          </span>
                        </div>

                        <h4 className="mt-5 text-2xl font-medium tracking-tight">
                          {member.name}
                        </h4>
                        <p className="mt-2 text-xs opacity-75">
                          {member.roleType === "entrepreneur"
                            ? "Profil SWOT: Wirausaha / Entrepreneur (3 Anggota K-1)"
                            : "Profil SWOT: Intrapreneur / Pegawai Profesional (2 Anggota K-1)"}
                        </p>
                      </div>

                      <div className="mt-8 pt-4 border-t border-current/10">
                        <a
                          href={member.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex w-full items-center justify-between rounded-full px-4 py-2.5 text-xs font-semibold transition ${
                            member.isSelf
                              ? "bg-[#111213] text-[#f5f5f2] hover:bg-[#5b31c8]"
                              : "bg-[#f5f5f2] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--cream)]"
                          }`}
                        >
                          <span>Kunjungi Portofolio Google Sites</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </SpotlightCard>
                  </TiltedCard>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: EVALUASI DIRI & MATRIKS SWOT 20 POIN */}
          {activeHubTab === "swot" && (
            <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* 10 Strengths */}
              <SpotlightCard
                spotlightColor="rgba(16, 185, 129, 0.14)"
                className="rounded-[28px] border border-[var(--line)] bg-white p-7 md:p-9"
              >
                <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-700">
                    STRENGTHS · 10 KEKUATAN UTAMA (S1–S10)
                  </span>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 font-mono text-xs font-bold text-emerald-800">
                    10 Poin
                  </span>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {SWOT_STRENGTHS.map((item) => (
                    <div
                      key={item.code}
                      className="rounded-2xl border border-[var(--line)] bg-[#f5f5f2] p-4"
                    >
                      <div className="font-mono text-xs font-bold text-emerald-700">
                        {item.code} · {locale === "id" ? item.titleId : item.titleEn}
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-[var(--mute)]">
                        {locale === "id" ? item.descId : item.descEn}
                      </p>
                    </div>
                  ))}
                </div>
              </SpotlightCard>

              {/* 10 Weaknesses / Self-Improvement */}
              <SpotlightCard
                spotlightColor="rgba(91, 49, 200, 0.14)"
                className="rounded-[28px] border border-[var(--line)] bg-white p-7 md:p-9"
              >
                <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--violet)]">
                    WEAKNESSES · 10 EVALUASI &amp; PENGEMBANGAN DIRI (W1–W10)
                  </span>
                  <span className="rounded-full bg-[var(--violet)]/12 px-3 py-1 font-mono text-xs font-bold text-[var(--violet)]">
                    10 Poin
                  </span>
                </div>
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {SWOT_WEAKNESSES.map((item) => (
                    <div
                      key={item.code}
                      className="rounded-2xl border border-[var(--line)] bg-[#f5f5f2] p-4"
                    >
                      <div className="font-mono text-xs font-bold text-[var(--violet)]">
                        {item.code} · {locale === "id" ? item.titleId : item.titleEn}
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-[var(--mute)]">
                        {locale === "id" ? item.descId : item.descEn}
                      </p>
                    </div>
                  ))}
                </div>
              </SpotlightCard>
            </div>
          )}

          {/* TAB 4: LIVE GITHUB @FADLI154 REPOSITORIES */}
          {activeHubTab === "github" && (
            <div className="mt-12 space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-[#111213] p-7 text-[#f5f5f2]">
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-2xl border border-white/20 object-cover"
                  />
                  <div>
                    <div className="font-mono text-xs text-[#c4e22e]">
                      LIVE GITHUB TELEMETRY · @{profile.handle}
                    </div>
                    <h3 className="text-xl font-medium">
                      {ghStats.public_repos} Public Repositories · {ghStats.followers} Followers
                    </h3>
                  </div>
                </div>
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="keffi-pill-btn keffi-pill-btn--lime !py-2.5 !px-5"
                >
                  <span>Buka GitHub @fadli154</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {ghRepos.map((repo) => (
                  <TiltedCard
                    key={repo.id}
                    maxTilt={4}
                    cursorLabel="GITHUB REPO"
                    className="rounded-[24px]"
                  >
                    <SpotlightCard className="flex h-full flex-col justify-between rounded-[24px] border border-[var(--line)] bg-white p-6">
                      <div>
                        <div className="flex items-center justify-between gap-2 font-mono text-xs text-[var(--violet)]">
                          <span className="font-semibold">{repo.name}</span>
                          <span>{repo.language || "Code"}</span>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-[var(--mute)]">
                          {repo.description ||
                            "Repositori proyek perangkat lunak dan eksplorasi akademik Fadli Hifziansyah."}
                        </p>
                      </div>
                      <div className="mt-6 flex items-center justify-between border-t border-[var(--line)] pt-4 font-mono text-xs text-[var(--mute)]">
                        <div className="flex items-center gap-4">
                          <span className="inline-flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 text-amber-500" />
                            {repo.stargazers_count}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <GitFork className="h-3.5 w-3.5" />
                            {repo.forks_count}
                          </span>
                        </div>
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-[var(--ink)] hover:text-[var(--violet)]"
                        >
                          <span>Source</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </SpotlightCard>
                  </TiltedCard>
                ))}
              </div>
              {ghLoading && (
                <p className="font-mono text-xs text-[var(--mute)]">
                  Menyinkronkan repositori langsung dari api.github.com/users/fadli154...
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================================
          6. STUDIO KEFFI CLOSING CONTACT & COLLABORATION SECTION (#contact)
         ===================================================================== */}
      <section id="contact" className="border-t border-[var(--line)] bg-white py-24 md:py-32">
        <div className="keffi-wrap">
          <div className="keffi-grid items-end">
            <div className="col-span-12 lg:col-span-8">
              <span className="sec-kicker">
                <span className="sec-kicker__dot" />
                <RotatingText
                  texts={
                    locale === "id"
                      ? [
                          "KOLABORASI, MAGANG & PROYEK PERANGKAT LUNAK",
                          "KONSULTASI SOLUSI WEB, MOBILE & AI INKLUSIF",
                          "RESPON CEPAT VIA EMAIL, WHATSAPP & LINKEDIN",
                        ]
                      : [
                          "INTERNSHIP, FREELANCE & RESEARCH COLLABORATION",
                          "CONSULTING ON WEB, MOBILE & INCLUSIVE AI",
                          "FAST RESPONSE VIA EMAIL, WHATSAPP & LINKEDIN",
                        ]
                  }
                  rotationInterval={3400}
                />
              </span>
              <h2 className="hero-giant mt-4">
                <BlurText
                  text={
                    locale === "id"
                      ? "Mari berdiskusi & membangun solusi."
                      : "Let's talk & build together."
                  }
                />
              </h2>
            </div>

            <div className="col-span-12 flex flex-col items-start gap-4 lg:col-span-4 lg:items-end">
              <Magnet strength={0.22}>
                <button
                  type="button"
                  onClick={() => openInquiryWithScope("full-time")}
                  className="keffi-pill-btn"
                  data-cursor="MESSAGE"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    width={38}
                    height={38}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-[#c4e22e]"
                  />
                  <span>
                    {locale === "id"
                      ? "Kirim Pesan / Diskusi Proyek"
                      : "Start a Project Conversation"}
                  </span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </Magnet>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="keffi-pill-outline font-mono text-xs"
              >
                {copiedEmail ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>Tersalin: {profile.email}</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>{profile.email}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          MODAL DETAIL PERTEMUAN, BUKTI ABSENSI & TUGAS KULIAH
         ===================================================================== */}
      {selectedSessionModal && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedSessionModal(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-white p-6 text-[var(--ink)] shadow-2xl md:p-9"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
              <div className="flex items-center gap-2.5">
                <span className="rounded-full bg-[var(--ink)] px-3.5 py-1 font-mono text-xs font-bold text-[var(--cream)]">
                  {selectedSessionModal.code}
                </span>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 font-mono text-xs font-semibold text-emerald-800">
                  Absen: {selectedSessionModal.attendanceStatus || "Hadir"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSessionModal(null)}
                className="rounded-full border border-[var(--line)] p-2 hover:bg-black/5"
                aria-label="Tutup modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <h3 className="mt-5 text-2xl font-medium tracking-tight">
              {locale === "id"
                ? selectedSessionModal.titleId
                : selectedSessionModal.titleEn}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--mute)]">
              {locale === "id"
                ? selectedSessionModal.descId
                : selectedSessionModal.descEn}
            </p>

            {/* Bukti Kehadiran */}
            <div className="mt-6">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--mute)]">
                BUKTI KEHADIRAN PERKULIAHAN
              </div>
              {selectedSessionModal.attendanceProofUrl ? (
                <div className="mt-2 overflow-hidden rounded-2xl border border-[var(--line)] bg-[#f5f5f2]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedSessionModal.attendanceProofUrl}
                    alt={`Bukti Kehadiran ${selectedSessionModal.code}`}
                    className="max-h-[360px] w-full object-contain"
                  />
                </div>
              ) : (
                <div className="mt-2 rounded-2xl border border-dashed border-[var(--line)] bg-[#f5f5f2] p-6 text-center font-mono text-xs text-[var(--mute)]">
                  Status Kehadiran: <strong>{selectedSessionModal.attendanceStatus || "Hadir"}</strong> · Bukti foto dapat diunggah/diperbarui melalui Dashboard Admin.
                </div>
              )}
            </div>

            {/* Rincian Tugas Pertemuan */}
            <div className="mt-6 rounded-2xl border border-[var(--line)] bg-[#f5f5f2] p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold uppercase text-[var(--violet)]">
                  RINCIAN TUGAS PERTEMUAN {selectedSessionModal.number}
                </span>
                <span className="rounded-full bg-[#c4e22e] px-3 py-0.5 font-mono text-xs font-bold text-[#111213]">
                  {selectedSessionModal.taskStatus || "Selesai"}
                </span>
              </div>
              <h4 className="mt-2 text-lg font-semibold text-[var(--ink)]">
                {selectedSessionModal.taskTitle || "Dokumentasi Tugas Perkuliahan"}
              </h4>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--mute)]">
                {selectedSessionModal.taskDescription ||
                  "Tugas telah dikerjakan dan terdokumentasi pada repositori/portal Kelompok K-1."}
              </p>
              {selectedSessionModal.taskUrl && (
                <a
                  href={selectedSessionModal.taskUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--ink)] px-4 py-2 font-mono text-xs font-semibold text-[var(--cream)] hover:bg-[var(--violet)]"
                >
                  <span>Buka Dokumen / Link Tugas</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Selected Certificate from Drift Wall */}
      {selectedCertModal && (
        <div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedCertModal(null)}
        >
          <div
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[32px] border border-white/15 bg-[#14161c] p-6 text-[#f5f5f2] shadow-2xl md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="rounded-full bg-[#c4e22e] px-3.5 py-1 font-mono text-xs font-bold text-[#111213]">
                  {selectedCertModal.category}
                </span>
                <span className="font-mono text-xs text-white/60">
                  {selectedCertModal.issueDate}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCertModal(null)}
                className="rounded-full border border-white/15 p-2 text-white/70 hover:bg-white/10 hover:text-white"
                aria-label="Tutup modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Certificate Preview Image */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#07080b]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedCertModal.imageUrl}
                alt={selectedCertModal.title}
                className="max-h-[460px] w-full object-contain"
              />
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-2xl font-medium tracking-tight text-white md:text-3xl">
                  {selectedCertModal.title}
                </h3>
                <p className="mt-1 font-mono text-xs text-[#c4e22e]">
                  Penerbit: {selectedCertModal.issuer}
                </p>
              </div>

              {(selectedCertModal.summaryId || selectedCertModal.summaryEn) && (
                <p className="text-sm leading-relaxed text-white/75">
                  {locale === "id"
                    ? selectedCertModal.summaryId
                    : selectedCertModal.summaryEn}
                </p>
              )}

              {selectedCertModal.credentialId && (
                <div className="flex items-center gap-2 font-mono text-xs text-white/60">
                  <ShieldCheck className="h-4 w-4 text-[#c4e22e]" />
                  <span>No. Kredensial: {selectedCertModal.credentialId}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/10 font-mono text-xs">
                {selectedCertModal.fileUrl && (
                  <a
                    href={selectedCertModal.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="keffi-pill-btn keffi-pill-btn--lime !py-2 !px-5"
                  >
                    <FileText className="h-4 w-4" />
                    <span>
                      {selectedCertModal.fileUrl.endsWith(".pdf")
                        ? "Buka Berkas PDF Resmi"
                        : "Buka Dokumen Asli"}
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}
                {selectedCertModal.verifyUrl && (
                  <a
                    href={selectedCertModal.verifyUrl}
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
    </div>
  );
}
