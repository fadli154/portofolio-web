import {
  CERTIFICATES,
  EDUCATIONS,
  EXPERIENCES,
  KWU_SESSIONS,
  PROJECTS,
  SITE_PROFILE,
  TECHNOLOGIES,
  type CertificateItem,
  type EducationItem,
  type ExperienceItem,
  type KwuSessionItem,
  type ProjectCaseStudy,
  type TechnologyItem,
} from "@/data/site";
import { createPublicSupabaseClient } from "@/lib/supabase/server";
import {
  CERTIFICATE_COLUMNS,
  mapCertificateRow,
  type CertificateRow,
} from "@/lib/data/certificates";

export interface PortfolioSnapshot {
  profile: typeof SITE_PROFILE;
  projects: ProjectCaseStudy[];
  experiences: ExperienceItem[];
  educations: EducationItem[];
  certificates: CertificateItem[];
  courseworkSessions: KwuSessionItem[];
  technologies: TechnologyItem[];
  dataSource: "supabase-live" | "local-seed-fallback";
}

interface CourseworkSessionRow {
  id?: string;
  session_number: number;
  code?: string;
  title_id?: string;
  title_en?: string;
  desc_id?: string;
  desc_en?: string;
  session_date?: string;
  attendance_status?: "Hadir" | "Izin" | "Sakit" | "Belum Dimulai";
  attendance_proof_url?: string | null;
  task_title?: string;
  task_description?: string;
  task_url?: string;
  task_status?: "Selesai" | "Proses" | "Belum Ada Tugas";
  is_visible?: boolean;
  sort_order?: number;
}

function mapCourseworkSessionRow(
  row: CourseworkSessionRow,
  fallbackSessions: KwuSessionItem[]
): KwuSessionItem {
  const fallback = fallbackSessions.find((s) => s.number === row.session_number);
  const ext = row.session_number === 9 ? "jpg" : "png";
  const staticProof = `/coursework/proof-session-${row.session_number}.${ext}`;
  const proof =
    row.attendance_proof_url && !row.attendance_proof_url.startsWith("data:image")
      ? row.attendance_proof_url
      : staticProof;

  return {
    id: row.id || fallback?.id || `kwu-${String(row.session_number).padStart(2, "0")}`,
    number: row.session_number,
    code: row.code || fallback?.code || `PERTEMUAN ${String(row.session_number).padStart(2, "0")}`,
    titleId: row.title_id || fallback?.titleId || "",
    titleEn: row.title_en || fallback?.titleEn || row.title_id || "",
    descId: row.desc_id || fallback?.descId || "",
    descEn: row.desc_en || fallback?.descEn || row.desc_id || "",
    sessionDate: row.session_date || fallback?.sessionDate || `Minggu ${row.session_number} · 2026`,
    attendanceStatus: row.attendance_status || fallback?.attendanceStatus || "Hadir",
    attendanceProofUrl: proof,
    taskTitle: row.task_title || fallback?.taskTitle,
    taskDescription: row.task_description || fallback?.taskDescription,
    taskUrl: row.task_url || fallback?.taskUrl,
    taskStatus: row.task_status || fallback?.taskStatus,
  };
}

/**
 * Fetches portfolio data from Supabase PostgreSQL when configured,
 * and falls back cleanly to verified local seed data (`src/data/site.ts`)
 * so ISR builds, previews, and `/jury` audits run with zero downtime.
 */
export async function getPortfolioSnapshot(): Promise<PortfolioSnapshot> {
  const defaults: PortfolioSnapshot = {
    profile: SITE_PROFILE,
    projects: PROJECTS.filter((p) => p.status === "published"),
    experiences: EXPERIENCES,
    educations: EDUCATIONS,
    certificates: CERTIFICATES,
    courseworkSessions: KWU_SESSIONS,
    technologies: TECHNOLOGIES,
    dataSource: "local-seed-fallback",
  };

  try {
    const supabase = createPublicSupabaseClient();
    if (!supabase) {
      return defaults;
    }

    const [projectsRes, certsRes, sessionsRes] = await Promise.allSettled([
      supabase
        .from("projects")
        .select("*")
        .eq("status", "published")
        .order("is_featured", { ascending: false })
        .order("sort_order", { ascending: true }),
      supabase
        .from("certificates")
        .select(CERTIFICATE_COLUMNS)
        .eq("is_visible", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("coursework_sessions")
        .select("*")
        .order("session_number", { ascending: true }),
    ]);

    let liveProjects = defaults.projects;
    let liveCertificates = defaults.certificates;
    let liveCourseworkSessions = defaults.courseworkSessions;
    let anyLive = false;

    if (
      projectsRes.status === "fulfilled" &&
      !projectsRes.value.error &&
      projectsRes.value.data &&
      projectsRes.value.data.length > 0
    ) {
      anyLive = true;
    }

    if (
      certsRes.status === "fulfilled" &&
      !certsRes.value.error &&
      certsRes.value.data &&
      certsRes.value.data.length > 0
    ) {
      liveCertificates = (certsRes.value.data as CertificateRow[]).map(
        mapCertificateRow
      );
      anyLive = true;
    }

    if (
      sessionsRes.status === "fulfilled" &&
      !sessionsRes.value.error &&
      sessionsRes.value.data &&
      sessionsRes.value.data.length > 0
    ) {
      const rows = sessionsRes.value.data as CourseworkSessionRow[];
      const visibleRows = rows.filter((r) => r.is_visible !== false);
      if (visibleRows.length > 0) {
        liveCourseworkSessions = visibleRows.map((row) =>
          mapCourseworkSessionRow(row, defaults.courseworkSessions)
        );
        anyLive = true;
      }
    }

    return {
      profile: SITE_PROFILE,
      projects: liveProjects,
      experiences: EXPERIENCES,
      educations: EDUCATIONS,
      certificates: liveCertificates,
      courseworkSessions: liveCourseworkSessions,
      technologies: TECHNOLOGIES,
      dataSource: anyLive ? "supabase-live" : "local-seed-fallback",
    };
  } catch {
    return defaults;
  }
}

export async function getProjectBySlug(slug: string): Promise<{
  project: ProjectCaseStudy | null;
  nextProject: ProjectCaseStudy | null;
}> {
  const published = PROJECTS.filter((p) => p.status === "published");
  const idx = published.findIndex((p) => p.slug === slug);
  if (idx === -1) {
    return { project: null, nextProject: null };
  }
  const project = published[idx]!;
  const nextProject = published[(idx + 1) % published.length] ?? null;
  return { project, nextProject };
}

