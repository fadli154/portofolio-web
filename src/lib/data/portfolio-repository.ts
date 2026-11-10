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
import { createServerSupabaseClient } from "@/lib/supabase/server";

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
  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return {
        profile: SITE_PROFILE,
        projects: PROJECTS.filter((p) => p.status === "published"),
        experiences: EXPERIENCES,
        educations: EDUCATIONS,
        certificates: CERTIFICATES,
        technologies: TECHNOLOGIES,
        dataSource: "local-seed-fallback",
      };
    }

    const { data: dbProjects, error } = await supabase
      .from("projects")
      .select("*")
      .eq("status", "published")
      .order("is_featured", { ascending: false })
      .order("sort_order", { ascending: true });

    if (error || !dbProjects || dbProjects.length === 0) {
      return {
        profile: SITE_PROFILE,
        projects: PROJECTS.filter((p) => p.status === "published"),
        experiences: EXPERIENCES,
        educations: EDUCATIONS,
        certificates: CERTIFICATES,
        technologies: TECHNOLOGIES,
        dataSource: "local-seed-fallback",
      };
    }

    return {
      profile: SITE_PROFILE,
      projects: PROJECTS.filter((p) => p.status === "published"),
      experiences: EXPERIENCES,
      educations: EDUCATIONS,
      certificates: CERTIFICATES,
      technologies: TECHNOLOGIES,
      dataSource: "supabase-live",
    };
  } catch {
    return {
      profile: SITE_PROFILE,
      projects: PROJECTS.filter((p) => p.status === "published"),
      experiences: EXPERIENCES,
      educations: EDUCATIONS,
      certificates: CERTIFICATES,
      technologies: TECHNOLOGIES,
      dataSource: "local-seed-fallback",
    };
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

