"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
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
  Star,
  Trophy,
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
import { SpotlightCard } from "@/components/reactbits/SpotlightCard";
import { TiltedCard } from "@/components/reactbits/TiltedCard";
import { CountUp } from "@/components/reactbits/CountUp";
import { Magnet } from "@/components/reactbits/Magnet";
import { CustomCursor } from "@/components/reactbits/CustomCursor";
import { DriftWall, type DriftWallItem } from "@/components/reactbits/DriftWall";
import FadeContent from "@/components/reactbits/FadeContent";
import { LogoLoop, type LogoItem } from "@/components/reactbits/LogoLoop";
import ScrollStack, { ScrollStackItem } from "@/components/reactbits/ScrollStack";
import { TechText } from "@/components/reactbits/TechText";
import type { FlexCarouselItem } from "@/components/reactbits/FlexCarousel";
import { ExperienceFoldersSection } from "@/components/reactbits/ExperienceFoldersSection";
import LanyardWrapper from "@/components/reactbits/LanyardWrapper";
import { KeffiStackFigure } from "@/components/figures/keffi-svc-figures";

const FlexCarousel = dynamic(() => import("@/components/reactbits/FlexCarousel"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-64 w-48 animate-pulse rounded-2xl border border-[var(--line)] bg-black/5 dark:bg-white/5" />
    </div>
  ),
});

const HERO_TECH_LOGOS: LogoItem[] = [
  {
    node: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-[1em] w-[1em]" aria-hidden="true">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12c2.25 0 4.355-.62 6.153-1.698L9.146 9.832v7.056H7.65V7.112h1.908l9.506 13.18A11.96 11.96 0 0 0 24 12c0-6.627-5.373-12-12-12Zm4.65 13.524-1.482-2.063V7.112h1.482v6.412Z" />
      </svg>
    ),
    title: "Next.js",
    href: "https://nextjs.org",
  },
  {
    node: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-[1em] w-[1em]" aria-hidden="true">
        <circle cx="12" cy="12" r="2.1" fill="currentColor" stroke="none" />
        <ellipse cx="12" cy="12" rx="10" ry="4.1" />
        <ellipse cx="12" cy="12" rx="10" ry="4.1" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4.1" transform="rotate(120 12 12)" />
      </svg>
    ),
    title: "React",
    href: "https://react.dev",
  },
  {
    node: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-[1em] w-[1em]" aria-hidden="true">
        <path d="M2 2h20v20H2V2Zm11.7 10.6H16V11h-6.3v1.6h2.3v6.5h1.7v-6.5Zm6.6 4.7c0-1.6-.9-2.3-2.5-2.9l-.6-.2c-.8-.3-1.2-.5-1.2-1 0-.4.4-.7 1-.7.7 0 1.2.3 1.5.9l1.3-.9c-.5-1-1.5-1.5-2.8-1.5-1.6 0-2.7.9-2.7 2.3 0 1.4.9 2.1 2.4 2.7l.6.2c.9.3 1.3.6 1.3 1.1 0 .5-.5.9-1.2.9-.9 0-1.5-.4-1.9-1.1l-1.4.8c.6 1.2 1.7 1.9 3.3 1.9 1.8 0 3-.9 3-2.5Z" />
      </svg>
    ),
    title: "TypeScript",
    href: "https://www.typescriptlang.org",
  },
  {
    node: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-[1em] w-[1em]" aria-hidden="true">
        <path d="M12 6c-2.67 0-4.33 1.33-5 4 1-.67 2.17-.92 3.5-.75.76.19 1.31.74 1.91 1.35.98 1 2.12 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 .67-2.17.92-3.5.75-.76-.19-1.31-.74-1.91-1.35C15.61 7.15 14.47 6 12 6ZM7 12c-2.67 0-4.33 1.33-5 4 1-.67 2.17-.92 3.5-.75.76.19 1.31.74 1.91 1.35.98 1 2.12 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 .67-2.17.92-3.5.75-.76-.19-1.31-.74-1.91-1.35C10.61 13.15 9.47 12 7 12Z" />
      </svg>
    ),
    title: "Tailwind CSS",
    href: "https://tailwindcss.com",
  },
  {
    node: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-[1em] w-[1em]" aria-hidden="true">
        <path d="M14.314 2L3.5 12.814l3.346 3.346L21 2h-6.686Zm0 9.974l-5.736 5.736 5.736 5.736H21l-5.736-5.736L21 11.974h-6.686Z" />
      </svg>
    ),
    title: "Flutter",
    href: "https://flutter.dev",
  },
  {
    node: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" className="h-[1em] w-[1em]" aria-hidden="true">
        <path d="M4 5.5L8.5 3 13 5.5v5L8.5 13 4 10.5v-5Zm11 3L19.5 6 22 7.4v4.2l-4.5 2.6-2.5-1.4V8.5Zm-6.5 4.5L13 10.5l4.5 2.5v5L13 20.5 8.5 18v-5Z" />
      </svg>
    ),
    title: "Laravel",
    href: "https://laravel.com",
  },
  {
    node: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-[1em] w-[1em]" aria-hidden="true">
        <path d="M13.5 22.1c-.5.6-1.5.2-1.5-.6V13.8h7.7c1.4 0 2.2 1.6 1.3 2.7l-7.5 5.6Zm-3-20.2c.5-.6 1.5-.2 1.5.6v7.7H4.3c-1.4 0-2.2-1.6-1.3-2.7l7.5-5.6Z" />
      </svg>
    ),
    title: "Supabase",
    href: "https://supabase.com",
  },
  {
    node: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-[1em] w-[1em]" aria-hidden="true">
        <ellipse cx="12" cy="6" rx="7.5" ry="3" />
        <path d="M4.5 6v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V6" />
        <path d="M4.5 12v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6" />
      </svg>
    ),
    title: "MySQL",
    href: "https://www.mysql.com",
  },
  {
    node: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-[1em] w-[1em]" aria-hidden="true">
        <path d="M12 2L3.5 6.9v4l5.2-3v11.6l3.3 1.9V7.9l3.3-1.9v5.2l3.2 1.8V9.4l2 1.1v-3.6L12 2Z" />
      </svg>
    ),
    title: "TensorFlow",
    href: "https://www.tensorflow.org",
  },
  {
    node: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-[1em] w-[1em]" aria-hidden="true">
        <path d="M6 10h2v2H6zm3 0h2v2H9zm3 0h2v2h-2zm-3-3h2v2H9zm3 0h2v2h-2zm3 3h2v2h-2z" />
        <path d="M2 14h16.5c1.8 0 3.2-1 3.7-2.4-1.2-.2-2-.1-2.7.3.1-1.3-.3-2.2-1-2.9-.8.8-1 1.9-.6 3H2c0 4.2 3.2 7 7.8 7 5.2 0 9.6-3.2 11.2-7.8" />
      </svg>
    ),
    title: "Docker",
    href: "https://www.docker.com",
  },
];

interface HomeClientSectionsProps {
  profile: typeof SITE_PROFILE;
  projects: ProjectCaseStudy[];
  experiences: ExperienceItem[];
  educations: EducationItem[];
  certificates: CertificateItem[];
  courseworkSessions?: KwuSessionItem[];
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
    name: "hajicare",
    html_url: "https://github.com/riverry25/hajicare",
    description:
      "Ekosistem Cerdas Pendamping & Monitoring Jamaah Haji / Umrah Berbasis IoT Smartband ESP32-S3 & Edge AI Offline (Juara II Nasional OASE III PTKIN).",
    language: "Dart",
    stargazers_count: 24,
    forks_count: 7,
    fork: false,
  },
  {
    id: 102,
    name: "sign2speech",
    html_url: "https://github.com/hafizhtzy/sign2speech",
    description:
      "Sistem Komunikasi Dua Arah Aksesibilitas Universal (BISINDO & SIBI) via MediaPipe 21-Point 3D Landmarks & MotionGRU TFLite.",
    language: "Dart",
    stargazers_count: 19,
    forks_count: 4,
    fork: false,
  },
  {
    id: 103,
    name: "project-warga",
    html_url: "https://github.com/Tofu-TheGreat/project-warga",
    description:
      "Aplikasi Sistem Informasi Administrasi Kependudukan Terpadu (Project Warga) Magang Resmi di Dinas Kominfo berbasis Laravel 9, MySQL & Yajra DataTables.",
    language: "PHP",
    stargazers_count: 16,
    forks_count: 5,
    fork: false,
  },
  {
    id: 104,
    name: "aduan-susu-frontend",
    html_url: "https://github.com/alfianchii/aduan-susu-frontend",
    description:
      "Portal Pengaduan & Pengawasan Distribusi Susu Kental Manis Nasional Se-Indonesia (KOPMAS / GovTech) berbasis Next.js & Tailwind.",
    language: "TypeScript",
    stargazers_count: 15,
    forks_count: 3,
    fork: false,
  },
  {
    id: 105,
    name: "dispress",
    html_url: "https://github.com/Tofu-TheGreat/dispress",
    description:
      "Sistem Otomasi Disposisi Surat Dinas & SPPD Elektronik Praktis berbasis Laravel, Stisla Bootstrap, Vite & MySQL.",
    language: "PHP",
    stargazers_count: 12,
    forks_count: 3,
    fork: false,
  },
  {
    id: 106,
    name: "FinTrack",
    html_url: "https://github.com/fadli154/FinTrack",
    description:
      "Asisten Keuangan Personal Pintar dengan Scanner Struk Belanja Kamera (flutter_vision OCR), Grafik FL Chart, & PDF Printing.",
    language: "Dart",
    stargazers_count: 11,
    forks_count: 2,
    fork: false,
  },
  {
    id: 107,
    name: "Project-Spp",
    html_url: "https://github.com/fadli154/Project-Spp",
    description:
      "Aplikasi Manajemen Pembayaran SPP Siswa Sekolah Terpadu & Paperless (Go Green) berbasis Laravel & MySQL.",
    language: "PHP",
    stargazers_count: 10,
    forks_count: 2,
    fork: false,
  },
  {
    id: 108,
    name: "travelease",
    html_url: "https://github.com/fadli154/travelease",
    description:
      "Aplikasi Mobile Panduan Wisata Cerdas & Itinerari Nusantara dengan Google Maps SDK & Cloud Firestore.",
    language: "Dart",
    stargazers_count: 9,
    forks_count: 1,
    fork: false,
  },
  {
    id: 109,
    name: "ngunduh-mantu",
    html_url: "https://github.com/fadli154/ngunduh-mantu",
    description:
      "Platform Undangan Pernikahan Digital Interaktif dengan Personalisasi Tamu Dinamis, Pemutar Audio Terpadu, & Realtime RSVP Firestore.",
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
  courseworkSessions: initialCourseworkSessions = [],
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
    useState<KwuSessionItem[]>(
      initialCourseworkSessions.length > 0 ? initialCourseworkSessions : KWU_SESSIONS
    );

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

  const courseworkFlexItems: (FlexCarouselItem & { raw: KwuSessionItem })[] = useMemo(() => {
    return courseworkSessions.map((session) => ({
      src: session.attendanceProofUrl || `/coursework/session-${session.number}.svg`,
      title: `${session.code} · ${locale === "id" ? session.titleId : session.titleEn}`,
      subtitle: `${session.attendanceStatus || "Hadir"} · ${session.taskStatus || "Selesai"}`,
      alt: locale === "id" ? session.titleId : session.titleEn,
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
        if (initialCourseworkSessions.length > store.courseworkSessions.length) {
          setCourseworkSessions(initialCourseworkSessions);
        } else {
          setCourseworkSessions(store.courseworkSessions);
        }
      } else if (initialCourseworkSessions.length > 0) {
        setCourseworkSessions(initialCourseworkSessions);
      }
      if (store.certificates?.length > 0) {
        setDynamicCertificates(store.certificates);
      }
    };

    syncFromStore(loadCmsStoreClient());

    // Live Supabase client fetch for visitors without localStorage
    import("@/lib/supabase/client").then(({ createClient, isSupabaseConfigured }) => {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        if (supabase) {
          supabase
            .from("coursework_sessions")
            .select("*")
            .order("session_number", { ascending: true })
            .then(({ data, error }) => {
              if (!error && data && data.length > 0) {
                const live: KwuSessionItem[] = data
                  .filter((r) => r.is_visible !== false)
                  .map((row) => ({
                    id: row.id || `kwu-${String(row.session_number).padStart(2, "0")}`,
                    number: row.session_number,
                    code: row.code || `PERTEMUAN ${String(row.session_number).padStart(2, "0")}`,
                    titleId: row.title_id || "",
                    titleEn: row.title_en || row.title_id || "",
                    descId: row.desc_id || "",
                    descEn: row.desc_en || row.desc_id || "",
                    sessionDate: row.session_date || `Minggu ${row.session_number} · 2026`,
                    attendanceStatus: row.attendance_status || "Hadir",
                    attendanceProofUrl:
                      row.attendance_proof_url || `/coursework/proof-session-${row.session_number}.png`,
                    taskTitle: row.task_title || undefined,
                    taskDescription: row.task_description || undefined,
                    taskUrl: row.task_url || undefined,
                    taskStatus: row.task_status || undefined,
                  }));
                if (live.length > 0) {
                  setCourseworkSessions(live);
                }
              }
            });
        }
      }
    });

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
  }, [initialCourseworkSessions]);

  // Viewport tracking for adaptive 3D components & responsive controls
  const [screenWidth, setScreenWidth] = useState(1280);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const handleResize = () => setScreenWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = screenWidth < 768;

  const driftWallConfig = useMemo(() => {
    if (screenWidth < 640) {
      return { columns: 3, tileWidth: 196, tileHeight: 138, gap: 12 };
    }
    if (screenWidth < 1024) {
      return { columns: 4, tileWidth: 270, tileHeight: 185, gap: 20 };
    }
    return { columns: 5, tileWidth: 310, tileHeight: 215, gap: 26 };
  }, [screenWidth]);

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
      fileUrl: c.fileUrl,
      verifyUrl: c.verifyUrl,
      raw: c,
    }));
  }, [dynamicCertificates]);

  const handleDriftTileClick = useCallback(
    (item: DriftWallItem) => {
      const found = dynamicCertificates.find((c) => c.id === item.id);
      if (found) {
        setSelectedCertModal(found);
      } else if (item.raw) {
        setSelectedCertModal(item.raw as CertificateItem);
      }
    },
    [dynamicCertificates]
  );

  const handleFlexSelect = useCallback(
    (index: number) => {
      const matched = courseworkFlexItems[index]?.raw;
      if (matched) {
        playMechanicalClick(680);
        setSelectedSessionModal(matched);
      }
    },
    [courseworkFlexItems]
  );

  // Featured Crown Achievement: Juara II OASE III PTKIN 2026 (Kemenag RI)
  const featuredOaseCert = useMemo(() => {
    return (
      dynamicCertificates.find(
        (c) =>
          c.id === "6f1d2c3a-0001-4a5b-9c01-0e0f00000001" ||
          c.title.includes("OASE")
      ) || dynamicCertificates[0]
    );
  }, [dynamicCertificates]);

  const hajicareProject = useMemo(() => {
    return dynamicProjects.find(
      (p) =>
        p.slug === "smart-hajj" ||
        p.slug === "hajicare" ||
        p.title.toLowerCase().includes("hajj")
    );
  }, [dynamicProjects]);

  const publishedProjectCount = useMemo(() => {
    return dynamicProjects.filter((p) => p.status !== "draft").length;
  }, [dynamicProjects]);

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
      <section id="hero" className="relative overflow-x-clip pt-24 pb-10 md:pt-32 md:pb-10">
        {/* Responsive 3D Lanyard Canvas: Behind text (z-[5]) on mobile/tablet so it never blocks copy, z-20 on desktop */}
        {hasMounted && (
          <div className="pointer-events-none absolute left-0 top-0 z-[5] h-[640px] w-full sm:h-[720px] lg:z-20 lg:h-[860px]">
            <LanyardWrapper
              frontImage="/fadli-profile.png"
              backImage="/fadli-profile.png"
              imageFit="cover"
              finish="holographic"
              cardColor="#ffffff"
              strapColor="#111111"
              orientation="portrait"
              anchor={screenWidth < 640 ? 0.68 : screenWidth < 1024 ? 0.72 : 0.72}
              strapLength={screenWidth < 640 ? 0.46 : screenWidth < 1024 ? 0.48 : 0.5}
              size={screenWidth < 640 ? 0.42 : screenWidth < 1024 ? 0.5 : 0.58}
              gravity={1.1}
              breeze={0.35}
              damping={0.55}
              elasticity={0.45}
              interactive={true}
              baseHeight={screenWidth < 640 ? 600 : screenWidth < 1024 ? 660 : 700}
              className="h-full w-full"
            />
          </div>
        )}

        <div className="keffi-wrap relative z-10">
          {/* Hero Top Grid: Left is Text Stack, Right is Spatial Stage for 3D Lanyard */}
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Left Column (7 cols): Kicker, Giant Headline, Description & CTAs */}
            <div className="relative z-30 lg:col-span-7">
              {/* Eyebrow Kicker */}
              <div className="mb-7 flex flex-wrap items-center gap-4">
                <span className="sec-kicker font-mono text-xs font-semibold tracking-wider text-[var(--ink)] [text-shadow:0_1px_12px_var(--cream)] lg:[text-shadow:none]">
                  {locale === "id"
                    ? "PORTOFOLIO INFORMATIKA · WEB, MOBILE, GOVTECH & VISION AI"
                    : "INFORMATICS PORTFOLIO · WEB, MOBILE, GOVTECH & VISION AI"}
                </span>
              </div>

              {/* Crisp Editorial Display Headline with Official ReactBits TechText */}
              <h1 className="hero-giant">
                <span className="sr-only">Fadli Hifziansyah</span>
                <span
                  aria-hidden="true"
                  className="relative z-20 block h-[64px] w-[111.11%] -ml-[5.55%] overflow-visible text-[var(--ink)] sm:h-[84px] md:h-[104px] lg:h-[120px]"
                >
                  <TechText
                    text="Fadli Hifziansyah"
                    fontSize={92}
                    fontWeight={600}
                    letterSpacing={-0.04}
                    color="currentColor"
                    accentColor="currentColor"
                    align="left"
                    reach={180}
                    softness={0.7}
                    dashLength={4}
                    dashGap={2}
                    strokeWidth={1.35}
                    lineStyle="dashed"
                    reveal="letter"
                    specks={12}
                    selection={true}
                    labels={true}
                    draggable={true}
                    bounce={0.4}
                    sweep={true}
                    speed={0.85}
                    clickKick={true}
                    intro="none"
                    guides={false}
                  />
                </span>
                <span className="mt-1 block max-w-xl text-lg font-normal tracking-tight text-[var(--mute)] [text-shadow:0_1px_16px_var(--cream),0_0_8px_var(--cream)] sm:text-3xl md:text-4xl lg:text-[42px] lg:leading-[1.12] lg:[text-shadow:none]">
                  {locale === "id"
                    ? "Rekayasa Web, Mobile & Computer Vision."
                    : "Web, Mobile & Computer Vision Engineering."}
                </span>
              </h1>

              {/* Sub-Headline Description */}
              <p className="mt-5 max-w-xxl text-base leading-relaxed text-[var(--mute)] [text-shadow:0_1px_16px_var(--cream),0_0_8px_var(--cream)] md:text-lg lg:[text-shadow:none]">
                {locale === "id"
                  ? "Mendokumentasikan karya rekayasa perangkat lunak, pengalaman magang di Dinas Kominfo (Project Warga Laravel), aduan publik pemerintah (Kopmas), IoT dan Edge AI (HajiCare dan Sign2Speech)."
                  : "Documenting software engineering projects, official internship at Dinas Kominfo (Project Warga Laravel), government civic portal (Kopmas), IoT and Edge AI ecosystems (HajiCare and Sign2Speech)."}
              </p>

              {/* CTAs & Action Pills */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Magnet strength={0.2}>
                  <a href="#work" className="keffi-pill-btn" data-cursor="EXPLORE">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={profile.avatarUrl}
                      alt={profile.fullName}
                      width={36}
                      height={36}
                      className="h-9 w-9 rounded-full object-cover border border-white/25"
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
                  <a href="#coursework" className="keffi-pill-outline bg-[var(--cream)]/85 backdrop-blur-xs">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#c4e22e] text-[#111213]" aria-hidden="true">
                      <BookOpen className="h-3 w-3" />
                    </span>
                    <span>
                      {locale === "id"
                        ? "Portal Kewirausahaan (K-1)"
                        : "Coursework Portal (K-1)"}
                    </span>
                  </a>
                </Magnet>
              </div>

              {/* Compact HRD Quick Links Row */}
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[var(--line)] lg:w-[60%] pt-5">
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[32px] items-center gap-1.5 font-mono text-xs font-semibold text-[var(--ink)] transition hover:-translate-y-0.5 hover:text-[var(--violet)] dark:hover:text-[#c4e22e]"
                >
                  <span>GitHub (@fadli154)</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[32px] items-center gap-1 font-mono text-xs text-[var(--mute)] transition hover:-translate-y-0.5 hover:text-[var(--ink)]"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </a>
                <a
                  href={profile.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[32px] items-center gap-1 font-mono text-xs text-[var(--mute)] transition hover:-translate-y-0.5 hover:text-[var(--ink)]"
                >
                  <span>Instagram</span>
                  <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </a>
                <a
                  href={profile.socials.kelompokK1}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[32px] items-center gap-1 font-mono text-xs text-[var(--mute)] transition hover:-translate-y-0.5 hover:text-[var(--ink)]"
                >
                  <span>Portal K-1</span>
                  <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* React Bits LogoLoop: Technology & Stack Ticker */}
      <div className="relative w-full overflow-hidden border-y border-[var(--line)] py-6 md:py-8 select-none bg-transparent text-[var(--ink)]">
        <LogoLoop
          logos={HERO_TECH_LOGOS}
          speed={85}
          direction="left"
          logoHeight={28}
          gap={56}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          labels="inline"
          intro={false}
          ariaLabel="Engineering technology stack"
        />
      </div>

      {/* =====================================================================
          2. STUDIO KEFFI EDITORIAL ABOUT & ANIMATED COUNTUP METRICS (#about)
         ===================================================================== */}
      <section id="about" className="scroll-mt-24 pt-12 pb-14 md:pt-20 md:pb-24">
        <FadeContent blur={6} duration={0.7} ease="power2.out" threshold={0.08} initialOpacity={0} once={true}>
          <div className="keffi-wrap">
          <div className="keffi-grid items-start">
            {/* Left 3 Columns: Studio Keffi Metadata Definition List */}
            <dl className="col-span-12 grid grid-cols-2 gap-5 border-t border-[var(--line)] pt-5 sm:grid-cols-4 lg:col-span-3 lg:grid-cols-1">
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
                <dd className="mt-1 font-mono text-sm font-semibold text-[var(--violet)] dark:text-[#c4e22e]">
                  @fadli154 ({ghStats.public_repos} Repos)
                </dd>
              </div>
            </dl>

            {/* Right 9 Columns: Large Indented Editorial Statement */}
            <div className="col-span-12 lg:col-span-9">
              <p className="about-statement">
                {locale === "id"
                  ? "Saya membangun perangkat lunak yang berfokus pada dampak nyata dan utilitas publik, mulai dari digitalisasi administrasi kependudukan (Project Warga) di Dinas Kominfo dengan Laravel 9 & MySQL, portal aduan gizi anak nasional (Kopmas), hingga aplikasi mobile IoT dan Edge AI aksesibilitas ibadah haji (HajiCare & Sign2Speech)."
                  : "I build software engineered for real-world utility and public impact, spanning municipal citizen administration (Project Warga) at Dinas Kominfo with Laravel 9 & MySQL, national child nutrition reporting (Kopmas), and mobile Edge AI wearables (HajiCare & Sign2Speech)."}
              </p>

              {/* Editorial Metrics Row */}
              <div className="mt-10 grid grid-cols-2 gap-6 border-t border-[var(--line)] pt-8 md:mt-14 md:grid-cols-4 md:pt-10">
                <div>
                  <div className="font-sans text-4xl font-semibold tracking-tight text-[var(--ink)] md:text-5xl">
                    <CountUp to={5} prefix="0" />
                  </div>
                  <div className="mt-2 font-mono text-xs uppercase tracking-wider text-[var(--mute)]">
                    {locale === "id" ? "Pilar Tech Stack" : "Tech Stack Pillars"}
                  </div>
                </div>

                <div>
                  <div className="font-sans text-4xl font-semibold tracking-tight text-[var(--violet)] dark:text-[#c4e22e] md:text-5xl">
                    <CountUp
                      to={publishedProjectCount}
                      prefix={publishedProjectCount < 10 ? "0" : ""}
                    />
                  </div>
                  <div className="mt-2 font-mono text-xs uppercase tracking-wider text-[var(--mute)]">
                    {locale === "id"
                      ? "Proyek Diselesaikan"
                      : "Projects Completed"}
                  </div>
                </div>

                <div>
                  <div className="font-sans text-4xl font-semibold tracking-tight text-[var(--ink)] md:text-5xl">
                    <CountUp
                      to={courseworkSessions.length}
                      prefix={courseworkSessions.length < 10 ? "0" : ""}
                    />
                  </div>
                  <div className="mt-2 font-mono text-xs uppercase tracking-wider text-[var(--mute)]">
                    {locale === "id"
                      ? "Pertemuan Kuliah Tercatat"
                      : "Coursework Sessions Logged"}
                  </div>
                </div>

                <div>
                  <div className="font-sans text-4xl font-semibold tracking-tight text-[var(--ink)] md:text-5xl">
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
        </FadeContent>
      </section>

      {/* =====================================================================
          3. SELECTED WORK & REAL EXPERIENCE (#work) — 3D FOLDER CIRCULAR GALLERY
         ===================================================================== */}
      <ExperienceFoldersSection locale={locale} />

      {/* =====================================================================
          4. DARK STICKY STACKING TECH STACK & TRANSPARENT /ANATOMY
         ===================================================================== */}
      <section id="stack" className="scroll-mt-24 bg-[#111213] pt-16 pb-16 text-[#f5f5f2] md:pt-24 md:pb-24">
        <div className="keffi-wrap">
          <div className="sec-head sec-head--dark">
            <div>
              <div className="mb-7 flex flex-wrap items-center gap-4">
                <span className="sec-kicker font-mono text-xs font-semibold tracking-wider !text-[#f5f5f2]/85">
                  {locale === "id"
                    ? "ARSITEKTUR SISTEM · 5 PILAR TECH STACK & ANATOMI"
                    : "SYSTEM ARCHITECTURE · 5 TECH STACK PILLARS"}
                </span>
              </div>
              <h2 className="sec-title !text-[#f5f5f2]">
                <BlurText
                  text={
                    locale === "id"
                      ? "Keahlian & Instrumen Teknis."
                      : "Capabilities & Tech Stack."
                  }
                />
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-white/70">
              {locale === "id"
                ? "Lima instrumen mekanis isometrik 3D dengan arsitektur fisik di setiap kartu. Tarik vertikal untuk memicu exploded-view atau pilih stasiun untuk menginspeksi lapisan sistem."
                : "Five distinct 3D isometric mechanical instruments with dedicated architectures per layer. Drag vertically for exploded-view inspection or select a station to explore."}
            </p>
          </div>

          {/* REACT BITS SCROLL STACK CARDS (.svc) */}
          <ScrollStack
            className="svc-scroll-stack mt-8"
            useWindowScroll={true}
            smoothScroll={false}
            itemDistance={isMobile ? 28 : 56}
            itemStackDistance={isMobile ? 14 : 24}
            stackPosition={isMobile ? "10%" : "14%"}
            itemScale={isMobile ? 0.035 : 0.045}
            baseScale={0.84}
            dimAmount={0.2}
            blurAmount={0}
            tiltAmount={0}
            rotationAmount={0}
            holdDistance={isMobile ? 40 : 120}
          >
            {SKILL_GROUP_CARDS.map((group, idx) => {
              const variant = SVC_VARIANTS[idx % SVC_VARIANTS.length]!;
              return (
                <ScrollStackItem key={group.id} itemClassName={`svc ${variant}`}>
                  <div className="keffi-grid items-center">
                    {/* Left 5 Columns: Editorial Stack Info */}
                    <div className="col-span-12 lg:col-span-5">
                      <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest opacity-80">
                        <span>(0{idx + 1})</span>
                        <span>·</span>
                        <span>{group.badge}</span>
                      </div>

                      <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
                        {locale === "id" ? group.titleId : group.titleEn}
                      </h3>

                      <p className="mt-3 text-sm leading-relaxed opacity-85 md:text-base">
                        {locale === "id" ? group.descId : group.descEn}
                      </p>

                      {/* Skill Icons Row */}
                      <div className="mt-5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={group.skillIconsUrl}
                          alt={group.titleEn}
                          width={320}
                          height={36}
                          loading="lazy"
                          className="h-9 w-auto object-contain opacity-90 transition hover:opacity-100"
                        />
                      </div>

                      <ul className="mt-5 flex flex-wrap gap-2">
                        {group.items.map((skill) => (
                          <li
                            key={skill}
                            className="rounded-full border border-current/20 bg-black/5 px-3 py-1 font-mono text-xs font-medium"
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
                </ScrollStackItem>
              );
            })}
          </ScrollStack>
        </div>
      </section>

      {/* =====================================================================
          4.5 DRIFT WALL · VERIFIED CREDENTIALS & AWARDS VAULT (#certificates)
              Placed directly above "PORTAL AKADEMIK KEWIRAUSAHAAN · KELOMPOK K-1"
         ===================================================================== */}
      <section
        id="certificates"
        className="scroll-mt-24 relative overflow-hidden border-t border-white/10 bg-[#0c0d12] pt-16 pb-0 text-[#f5f5f2] md:pt-24"
      >
        <FadeContent blur={6} duration={0.7} ease="power2.out" threshold={0.08} initialOpacity={0} once={true}>
          <div className="keffi-wrap">
          <div className="sec-head sec-head--dark">
            <div>
              <div className="mb-7 flex flex-wrap items-center gap-4">
                <span className="sec-kicker font-mono text-xs font-semibold tracking-wider !text-[#f5f5f2]/85">
                  {locale === "id"
                    ? "BRANKAS PRESTASI & SERTIFIKASI KOMPETENSI RESMI"
                    : "VERIFIED CREDENTIALS & AWARDS VAULT"}
                </span>
              </div>
              <h2 className="sec-title !text-[#f5f5f2]">
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
              <p className="max-w-md text-sm leading-relaxed text-white/75">
                {locale === "id"
                  ? "Koleksi lisensi kompetensi dan sertifikat penghargaan yang tersinkronisasi dari Supabase. Klik kartu sertifikat manapun untuk melihat detail resmi."
                  : "Verified credentials and competition awards synced dynamically from Supabase. Click any certificate tile to inspect official details."}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-white/15 bg-white/8 px-3.5 py-1.5 font-mono text-xs font-semibold text-white/90">
                  {dynamicCertificates.filter((c) => c.isVisible !== false).length}{" "}
                  {locale === "id" ? "Sertifikat Terverifikasi" : "Verified Credentials"}
                </span>
                <Link
                  href="/certificates"
                  className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full bg-[#f5f5f2] px-4 py-1.5 font-sans text-xs font-semibold text-[#111213] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <span>{locale === "id" ? "Buka Brankas Lengkap" : "Open Full Vault"}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          {/* =================================================================
              CROWN JEWEL SPOTLIGHT: JUARA II NASIONAL OASE III PTKIN 2026
              (Kementerian Agama Republik Indonesia · Inovasi HajiCare)
             ================================================================= */}
          {featuredOaseCert && (
            <div className="relative mt-10 overflow-hidden rounded-[24px] border border-amber-300/35 bg-[#16171d] p-6 transition-all duration-300 hover:border-amber-300/60 sm:p-8 md:rounded-[28px] md:p-10">
              <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
                {/* Left Column: Prestigious Copy & Metadata */}
                <div className="flex flex-col justify-between space-y-5 lg:col-span-7">
                  <div>
                    {/* Crown Kicker Badge */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-amber-400/12 px-3.5 py-1 font-mono text-[11px] font-semibold text-amber-200">
                        <Trophy className="h-3.5 w-3.5 text-amber-200" aria-hidden="true" />
                        <span>
                          {locale === "id"
                            ? "PRESTASI UTAMA NASIONAL"
                            : "NATIONAL CROWN ACHIEVEMENT"}
                        </span>
                      </span>
                      <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[11px] text-white/75">
                        KEMENAG RI · DIKTIS
                      </span>
                    </div>

                    {/* Main Title */}
                    <h3 className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-4xl leading-tight">
                      {locale === "id" ? (
                        <>
                          Juara II Literasi Inovasi{" "}
                          <span className="text-amber-200">Teknologi</span>
                        </>
                      ) : (
                        <>
                          National 2nd Place: Tech Innovation{" "}
                          <span className="text-amber-200">Literacy</span>
                        </>
                      )}
                    </h3>

                    {/* Subtitle / Competition Venue */}
                    <p className="mt-2 text-sm sm:text-base font-medium text-amber-200/90">
                      OASE III PTKIN se-Indonesia · UIN Sunan Kalijaga Yogyakarta (3 s.d. 7 November 2026)
                    </p>

                    {/* Context & Description */}
                    <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">
                      {locale === "id"
                        ? "Mewakili UIN Sultan Maulana Hasanuddin Banten di tingkat nasional lewat sistem kecerdasan buatan Smart Hajj (HajiCare), menggunakan pelacakan sendi tangan Computer Vision 60fps untuk membantu jamaah haji lansia dan disabilitas rungu."
                        : "Representing UIN Sultan Maulana Hasanuddin Banten at the national finals with Smart Hajj (HajiCare), a mobile Computer Vision system running 60fps hand landmark tracking for deaf and elderly pilgrims."}
                    </p>

                    {/* Official Verification Pills */}
                    <div className="mt-5 flex flex-wrap items-center gap-3 font-mono text-xs text-white/80">
                      <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/12 bg-black/35 px-3 py-1.5">
                        <ShieldCheck className="h-4 w-4 text-emerald-300" aria-hidden="true" />
                        <span>No. SK: 712/Dt.I.III/PP.01/11/2026</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/12 bg-black/35 px-3 py-1.5">
                        <CheckCircle2 className="h-4 w-4 text-amber-200" aria-hidden="true" />
                        <span>Tercatat Resmi Kemenag RI</span>
                      </div>
                    </div>
                  </div>

                  {/* Clean Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                    <a
                      href={featuredOaseCert.fileUrl || "/sertif/oase-juara-2-lit.pdf"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-[#f5f5f2] px-5 py-2 font-sans text-xs font-semibold text-[#111213] transition hover:-translate-y-0.5 hover:bg-white"
                    >
                      <FileText className="h-4 w-4" aria-hidden="true" />
                      <span>{locale === "id" ? "Buka Berkas PDF Resmi" : "Open Official PDF"}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        playMechanicalClick(750);
                        setSelectedCertModal(featuredOaseCert);
                      }}
                      className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-white/25 bg-white/5 px-5 py-2 font-mono text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/10"
                    >
                      <Eye className="h-4 w-4" aria-hidden="true" />
                      <span>{locale === "id" ? "Perbesar Sertifikat" : "Inspect Certificate"}</span>
                    </button>

                    {hajicareProject && (
                      <Link
                        href={`/projects/${hajicareProject.slug}`}
                        onClick={() => playMechanicalClick(720)}
                        className="inline-flex min-h-[40px] items-center gap-1.5 px-3 py-2 font-mono text-xs font-medium text-white/80 transition hover:-translate-y-0.5 hover:text-white"
                      >
                        <span>{locale === "id" ? "Studi Kasus HajiCare" : "HajiCare Case Study"}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </div>

                {/* Right Column: Interactive Certificate Frame */}
                <div className="lg:col-span-5">
                  <div
                    onClick={() => {
                      playMechanicalClick(780);
                      setSelectedCertModal(featuredOaseCert);
                    }}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/15 bg-[#0d0f14] transition-all duration-300 hover:border-amber-300/60"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={featuredOaseCert.imageUrl}
                      alt={featuredOaseCert.title}
                      width={800}
                      height={600}
                      className="w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />

                    {/* Seal Badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full border border-amber-300/40 bg-black/85 px-3 py-1 font-mono text-[10px] font-bold text-amber-200 backdrop-blur-md">
                      <Star className="h-3 w-3 fill-amber-200 text-amber-200" aria-hidden="true" />
                      <span>JUARA II NASIONAL</span>
                    </div>

                    {/* Hover Overlay with Inspect prompt */}
                    <div className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-black/85 via-black/15 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f5f5f2] px-4 py-1.5 font-mono text-xs font-semibold text-[#111213] shadow-md">
                        <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{locale === "id" ? "Klik untuk Memperbesar" : "Click to inspect"}</span>
                      </span>
                    </div>
                  </div>
                  <p className="mt-2.5 text-center font-mono text-[11px] text-white/60">
                    {locale === "id"
                      ? "Dokumen resmi terverifikasi · Kementerian Agama RI"
                      : "Official verified document · Ministry of Religious Affairs"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section Transition Header for 3D Drift Wall */}
          <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
            <div>
              <span className="sec-kicker !text-white/70">
                <span>
                  {locale === "id"
                    ? "DINDING 3D LISENSI & SERTIFIKASI KOMPETENSI"
                    : "3D DRIFT WALL · TECHNICAL CREDENTIALS & LICENSES"}
                </span>
              </span>
              <p className="mt-1.5 text-xs text-white/75 max-w-xl">
                {locale === "id"
                  ? "Sertifikasi resmi Cisco IOS, MikroTik MTCNA, Keamanan Siber, Administrasi Linux, dan Kompetisi Web UMKM."
                  : "Verified certifications spanning Cisco IOS, MikroTik MTCNA, Cybersecurity, Linux Administration, and UMKM Web Competition."}
              </p>
            </div>
          </div>
        </div>
        </FadeContent>

        {/* 3D PERSPECTIVE DRIFT WALL - SEAMLESS, CENTERED, WITH SMOOTH EDGE FADES */}
        <FadeContent blur={false} duration={0.7} ease="power2.out" threshold={0.08} initialOpacity={0} once={true}>
        <div className="relative isolate mt-6 h-[400px] w-full overflow-hidden sm:mt-8 sm:h-[480px] md:h-[580px]">
          {/* Top Fade Gradient Shadow - Smooth Seamless Blend */}
          <div
            className="pointer-events-none absolute inset-x-0 -top-px z-20 h-20 sm:h-24"
            style={{
              background:
                "linear-gradient(to bottom, #0c0d12 0%, rgba(12, 13, 18, 0.72) 48%, rgba(12, 13, 18, 0) 100%)",
            }}
          />

          {/* 3D Drift Wall Component with responsive columns and balanced centering */}
          <DriftWall
            className="isolate"
            items={driftWallItems}
            columns={driftWallConfig.columns}
            tileWidth={driftWallConfig.tileWidth}
            tileHeight={driftWallConfig.tileHeight}
            gap={driftWallConfig.gap}
            radius={16}
            tilt={12}
            turn={-7}
            perspective={1250}
            depth={90}
            speed={28}
            fade={0}
            pauseOnHover={true}
            onTileClick={handleDriftTileClick}
          />

          {/* Bottom Inner Gradient Shadow - Seamless Flush Dissolve into Section Bottom */}
          <div
            className="pointer-events-none absolute inset-x-0 -bottom-px z-20 h-28 sm:h-32"
            style={{
              background:
                "linear-gradient(to top, #0c0d12 0%, #0c0d12 18%, rgba(12, 13, 18, 0.78) 54%, rgba(12, 13, 18, 0) 100%)",
            }}
          />
        </div>
        </FadeContent>
      </section>

      {/* =====================================================================
          5. PORTAL AKADEMIK KEWIRAUSAHAAN (PERTEMUAN, ABSEN, BUKTI, TUGAS),
             KELOMPOK K-1, EVALUASI SWOT & LIVE GITHUB (#coursework)
         ===================================================================== */}
      <section
        id="coursework"
        className="scroll-mt-24 relative overflow-hidden bg-white pt-14 md:pt-24 dark:bg-[#0a0a0c]"
      >
        <FadeContent blur={6} duration={0.7} ease="power2.out" threshold={0.08} initialOpacity={0} once={true}>
        <div className="keffi-wrap">
          <div className="sec-head">
            <div>
              <div className="mb-7 flex flex-wrap items-center gap-4">
                <span className="sec-kicker font-mono text-xs font-semibold tracking-wider text-[var(--ink)]">
                  {locale === "id"
                    ? "PORTAL AKADEMIK KEWIRAUSAHAAN · KELOMPOK K-1"
                    : "ENTREPRENEURSHIP ACADEMIC PORTAL · GROUP K-1"}
                </span>
              </div>
              <h2 className="sec-title text-[var(--ink)] dark:text-[#f5f5f2]">
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
              className="flex max-w-full overflow-x-auto gap-2 rounded-2xl md:rounded-full bg-[var(--bone)] p-1.5 no-scrollbar scroll-smooth"
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
                    className={`inline-flex shrink-0 items-center gap-2 rounded-xl md:rounded-full px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-all ${active
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
        </div>
        </FadeContent>

        <FadeContent blur={false} duration={0.7} ease="power2.out" threshold={0.08} initialOpacity={0} once={true}>
        {/* TAB 1: DYNAMIC PERTEMUAN, ABSEN, BUKTI KEHADIRAN & TUGAS */}
        {activeHubTab === "pertemuan" && (
          <div className="mt-8">
            {/* Clean Editorial Sub-Header (No Card, Seamless Section Integration) */}
            <div className="keffi-wrap">
              <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[var(--line)] pb-6 dark:border-white/10">
                <div>
                  <span className="inline-block rounded-full bg-[#c4e22e] px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-[#111213]">
                    MATA KULIAH KEWIRAUSAHAAN · LOG ABSENSI &amp; TUGAS TERINTEGRASI SUPABASE
                  </span>
                  <p className="mt-1.5 max-w-2xl text-sm text-[var(--mute)] dark:text-gray-400">
                    {locale === "id"
                      ? "Setiap pertemuan mencatat status kehadiran, foto bukti hadir, serta rincian tugas mingguan yang dikelola langsung melalui CMS Admin."
                      : "Each session logs attendance status, attendance proof photo, and weekly task deliverables managed dynamically via the Admin CMS."}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                  <span className="rounded-full border border-[var(--line)] bg-[var(--bone)] px-3.5 py-1.5 font-semibold text-[var(--ink)] dark:border-white/15 dark:bg-white/10 dark:text-white">
                    {
                      courseworkSessions.filter(
                        (s) => (s.attendanceStatus || "Hadir") === "Hadir"
                      ).length
                    }{" "}
                    / {courseworkSessions.length} Hadir
                  </span>
                  <span className="rounded-full border border-[var(--line)] bg-white px-3.5 py-1.5 font-semibold text-[var(--ink)] dark:border-white/15 dark:bg-white/5 dark:text-white">
                    {
                      courseworkSessions.filter(
                        (s) => (s.taskStatus || "Selesai") === "Selesai"
                      ).length
                    }{" "}
                    Tugas Selesai
                  </span>

                  {/* View Mode Switcher Pill */}
                  <div className="inline-flex items-center rounded-full border border-[var(--line)] bg-[#f5f5f2] p-1 dark:border-white/15 dark:bg-black/40">
                    <button
                      type="button"
                      onClick={() => {
                        playMechanicalClick(560);
                        setPertemuanViewMode("carousel");
                      }}
                      className={`min-h-[32px] rounded-full px-3.5 py-1 font-mono text-[11px] font-semibold transition-all ${pertemuanViewMode === "carousel"
                        ? "bg-white text-[var(--ink)] shadow-xs dark:bg-[#1a1b1e] dark:text-white"
                        : "text-[var(--mute)] hover:text-[var(--ink)] dark:text-gray-400 dark:hover:text-white"
                        }`}
                    >
                      Flex Carousel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playMechanicalClick(580);
                        setPertemuanViewMode("grid");
                      }}
                      className={`min-h-[32px] rounded-full px-3.5 py-1 font-mono text-[11px] font-semibold transition-all ${pertemuanViewMode === "grid"
                        ? "bg-white text-[var(--ink)] shadow-xs dark:bg-[#1a1b1e] dark:text-white"
                        : "text-[var(--mute)] hover:text-[var(--ink)] dark:text-gray-400 dark:hover:text-white"
                        }`}
                    >
                      Grid
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {pertemuanViewMode === "carousel" ? (
              <div className="relative h-[460px] w-full overflow-hidden text-[var(--ink)] sm:h-[520px] md:h-[580px]">
                <FlexCarousel
                  items={courseworkFlexItems}
                  preset="liquid"
                  intro="rise"
                  cardHeight={0.48}
                  gap={14}
                  radius={14}
                  fit="natural"
                  focusOnClick={false}
                  captions={true}
                  captureWheel={false}
                  autoplay={true}
                  onSelect={handleFlexSelect}
                  className="h-full w-full"
                />
              </div>
            ) : (
              <div className="keffi-wrap mt-10">
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
                          spotlightColor="rgba(196, 226, 46, 0.2)"
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
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DIREKTORI 5 ANGGOTA KELOMPOK K-1 INFORMATIKA */}
        {activeHubTab === "kelompok-k1" && (
          <div className="keffi-wrap mt-12 space-y-8">
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
                        : "rgba(196, 226, 46, 0.18)"
                    }
                    className={`flex h-full flex-col justify-between rounded-[26px] border p-7 ${member.isSelf
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
                          className={`rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase ${member.isSelf
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
                        className={`inline-flex w-full items-center justify-between rounded-full px-4 py-2.5 text-xs font-semibold transition ${member.isSelf
                          ? "bg-[#111213] text-[#f5f5f2] hover:bg-[#c4e22e] hover:text-[#111213]"
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
          <div className="keffi-wrap mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* 10 Strengths */}
            <SpotlightCard
              spotlightColor="rgba(16, 185, 129, 0.14)"
              className="rounded-[28px] border border-[var(--line)] bg-white p-7 md:p-9"
            >
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-700">
                  STRENGTHS · 10 KEKUATAN UTAMA (S1-S10)
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
              spotlightColor="rgba(196, 226, 46, 0.2)"
              className="rounded-[28px] border border-[var(--line)] bg-white p-7 md:p-9"
            >
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--violet)]">
                  WEAKNESSES · 10 EVALUASI &amp; PENGEMBANGAN DIRI (W1-W10)
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
          <div className="keffi-wrap mt-12 space-y-8">
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
        </FadeContent>
      </section>

      {/* =====================================================================
          6. STUDIO KEFFI CLOSING CONTACT & COLLABORATION SECTION (#contact)
         ===================================================================== */}
      <section id="contact" className="scroll-mt-24 border-t border-[var(--line)] bg-[var(--bg)] pt-16 pb-16 md:pt-24 md:pb-24">
        <FadeContent blur={6} duration={0.7} ease="power2.out" threshold={0.08} initialOpacity={0} once={true}>
        <div className="keffi-wrap">
          <div className="keffi-grid items-end">
            <div className="col-span-12 lg:col-span-8">
              <div className="mb-7 flex flex-wrap items-center gap-4">
                <span className="sec-kicker font-mono text-xs font-semibold tracking-wider text-[var(--ink)]">
                  {locale === "id"
                    ? "KOLABORASI, MAGANG & PROYEK PERANGKAT LUNAK"
                    : "INTERNSHIP, FREELANCE & RESEARCH COLLABORATION"}
                </span>
              </div>
              <h2 className="hero-giant">
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
                    className="h-9 w-9 rounded-full object-cover border border-white/25"
                  />
                  <span>
                    {locale === "id"
                      ? "Kirim Pesan / Diskusi Proyek"
                      : "Start a Project Conversation"}
                  </span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
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
        </FadeContent>
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
