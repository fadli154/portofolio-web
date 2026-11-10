import {
  CERTIFICATES,
  EDUCATIONS,
  EXPERIENCES,
  PROJECTS,
  SITE_PROFILE,
  TECHNOLOGIES,
  type CertificateItem,
  type EducationItem,
  type ExperienceItem,
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
  technologies: TechnologyItem[];
  dataSource: "supabase-live" | "local-seed-fallback";
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
    technologies: TECHNOLOGIES,
    dataSource: "local-seed-fallback",
  };

  try {
    const supabase = createPublicSupabaseClient();
    if (!supabase) {
      return defaults;
    }

    const [projectsRes, certsRes] = await Promise.allSettled([
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
    ]);

    let liveProjects = defaults.projects;
    let liveCertificates = defaults.certificates;
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

    return {
      profile: SITE_PROFILE,
      projects: liveProjects,
      experiences: EXPERIENCES,
      educations: EDUCATIONS,
      certificates: liveCertificates,
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

