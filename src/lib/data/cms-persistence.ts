"use client";

import {
  CERTIFICATES,
  EXPERIENCES,
  KWU_SESSIONS,
  PROJECTS,
  type CertificateItem,
  type ExperienceItem,
  type KwuSessionItem,
  type ProjectCaseStudy,
} from "@/data/site";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const CMS_STORAGE_KEY = "fadli_cms_store_v2";
const LEGACY_PROOF_STORAGE_KEY = "fadli_kwu_proofs_v1";

export interface CmsDynamicStore {
  experiences: ExperienceItem[];
  projects: ProjectCaseStudy[];
  courseworkSessions: KwuSessionItem[];
  certificates: CertificateItem[];
  updatedAt: string;
}

export function getDefaultCmsStore(): CmsDynamicStore {
  return {
    experiences: EXPERIENCES,
    projects: PROJECTS,
    courseworkSessions: KWU_SESSIONS,
    certificates: CERTIFICATES,
    updatedAt: new Date().toISOString(),
  };
}

export function loadCmsStoreClient(): CmsDynamicStore {
  const defaults = getDefaultCmsStore();
  if (typeof window === "undefined") {
    return defaults;
  }

  try {
    const raw = window.localStorage.getItem(CMS_STORAGE_KEY);
    const legacyProofsRaw = window.localStorage.getItem(LEGACY_PROOF_STORAGE_KEY);
    let legacyProofs: Record<number, string> = {};
    if (legacyProofsRaw) {
      try {
        legacyProofs = JSON.parse(legacyProofsRaw);
      } catch {
        legacyProofs = {};
      }
    }

    if (!raw) {
      const mergedSessions = defaults.courseworkSessions.map((s) => ({
        ...s,
        attendanceProofUrl: legacyProofs[s.number] || s.attendanceProofUrl || null,
      }));
      return {
        ...defaults,
        courseworkSessions: mergedSessions,
      };
    }

    const parsed = JSON.parse(raw) as Partial<CmsDynamicStore>;
    const sessions = Array.isArray(parsed.courseworkSessions) && parsed.courseworkSessions.length > 0
      ? parsed.courseworkSessions.map((s) => ({
          ...s,
          attendanceProofUrl: s.attendanceProofUrl || legacyProofs[s.number] || null,
        }))
      : defaults.courseworkSessions;

    return {
      experiences:
        Array.isArray(parsed.experiences) && parsed.experiences.length > 0
          ? parsed.experiences
          : defaults.experiences,
      projects:
        Array.isArray(parsed.projects) && parsed.projects.length > 0
          ? parsed.projects
          : defaults.projects,
      certificates:
        Array.isArray(parsed.certificates) && parsed.certificates.length > 0
          ? [...parsed.certificates].sort((a, b) => a.sortOrder - b.sortOrder)
          : defaults.certificates,
      courseworkSessions: sessions.sort((a, b) => a.number - b.number),
      updatedAt: parsed.updatedAt || defaults.updatedAt,
    };
  } catch {
    return defaults;
  }
}

export function saveCmsStoreClient(nextStore: CmsDynamicStore): void {
  if (typeof window === "undefined") return;
  try {
    const normalized: CmsDynamicStore = {
      ...nextStore,
      courseworkSessions: [...nextStore.courseworkSessions].sort(
        (a, b) => a.number - b.number
      ),
      certificates: [...(nextStore.certificates || [])].sort(
        (a, b) => a.sortOrder - b.sortOrder
      ),
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(normalized));

    // Also mirror attendance proofs to legacy key for backward compatibility
    const proofsMap: Record<number, string> = {};
    for (const s of normalized.courseworkSessions) {
      if (s.attendanceProofUrl) {
        proofsMap[s.number] = s.attendanceProofUrl;
      }
    }
    window.localStorage.setItem(LEGACY_PROOF_STORAGE_KEY, JSON.stringify(proofsMap));
    window.dispatchEvent(new CustomEvent("fadli-cms-updated", { detail: normalized }));
  } catch {
    // Ignore localStorage quota errors
  }
}

/**
 * Synchronizes a Coursework Session (Pertemuan, Absen, Bukti, Tugas)
 * to Supabase PostgreSQL (`public.coursework_sessions`) when configured,
 * and always updates the local CMS store immediately.
 */
export async function upsertCourseworkSession(
  session: KwuSessionItem
): Promise<{ syncedToSupabase: boolean; store: CmsDynamicStore }> {
  const current = loadCmsStoreClient();
  const existsIdx = current.courseworkSessions.findIndex(
    (s) => s.number === session.number
  );
  const updatedSessions =
    existsIdx >= 0
      ? current.courseworkSessions.map((s, i) => (i === existsIdx ? session : s))
      : [...current.courseworkSessions, session];

  const nextStore: CmsDynamicStore = {
    ...current,
    courseworkSessions: updatedSessions.sort((a, b) => a.number - b.number),
    updatedAt: new Date().toISOString(),
  };
  saveCmsStoreClient(nextStore);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      if (supabase) {
        const { error } = await supabase.from("coursework_sessions").upsert(
          {
            session_number: session.number,
            code: session.code,
            title_id: session.titleId,
            title_en: session.titleEn || session.titleId,
            desc_id: session.descId,
            desc_en: session.descEn || session.descId,
            session_date: session.sessionDate || "2026",
            attendance_status: session.attendanceStatus || "Hadir",
            attendance_proof_url: session.attendanceProofUrl || null,
            task_title: session.taskTitle || "",
            task_description: session.taskDescription || "",
            task_url: session.taskUrl || "",
            task_status: session.taskStatus || "Selesai",
            sort_order: session.number,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "session_number" }
        );
        if (!error) {
          return { syncedToSupabase: true, store: nextStore };
        }
      }
    } catch {
      // Fallback to local store
    }
  }

  return { syncedToSupabase: false, store: nextStore };
}

export async function deleteCourseworkSession(
  sessionNumber: number
): Promise<{ syncedToSupabase: boolean; store: CmsDynamicStore }> {
  const current = loadCmsStoreClient();
  const nextStore: CmsDynamicStore = {
    ...current,
    courseworkSessions: current.courseworkSessions.filter(
      (s) => s.number !== sessionNumber
    ),
    updatedAt: new Date().toISOString(),
  };
  saveCmsStoreClient(nextStore);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      if (supabase) {
        await supabase
          .from("coursework_sessions")
          .delete()
          .eq("session_number", sessionNumber);
        return { syncedToSupabase: true, store: nextStore };
      }
    } catch {
      // Fallback
    }
  }

  return { syncedToSupabase: false, store: nextStore };
}

/**
 * Synchronizes an Experience item to Supabase (`public.experiences`) and local store.
 */
export async function upsertExperienceItem(
  experience: ExperienceItem
): Promise<{ syncedToSupabase: boolean; store: CmsDynamicStore }> {
  const current = loadCmsStoreClient();
  const existsIdx = current.experiences.findIndex((e) => e.id === experience.id);
  const updatedExperiences =
    existsIdx >= 0
      ? current.experiences.map((e, i) => (i === existsIdx ? experience : e))
      : [...current.experiences, experience];

  const nextStore: CmsDynamicStore = {
    ...current,
    experiences: updatedExperiences,
    updatedAt: new Date().toISOString(),
  };
  saveCmsStoreClient(nextStore);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      if (supabase) {
        const { error } = await supabase.from("experiences").upsert({
          company: experience.company,
          role_en: experience.roleEn || experience.roleId,
          role_id: experience.roleId,
          employment_type: experience.employmentType,
          location: experience.location,
          period_label: experience.period,
          is_current: experience.isCurrent,
          highlights_en: experience.highlightsEn,
          highlights_id: experience.highlightsId,
          is_visible: true,
        });
        if (!error) {
          return { syncedToSupabase: true, store: nextStore };
        }
      }
    } catch {
      // Fallback
    }
  }

  return { syncedToSupabase: false, store: nextStore };
}

export async function deleteExperienceItem(
  id: string
): Promise<{ syncedToSupabase: boolean; store: CmsDynamicStore }> {
  const current = loadCmsStoreClient();
  const nextStore: CmsDynamicStore = {
    ...current,
    experiences: current.experiences.filter((e) => e.id !== id),
    updatedAt: new Date().toISOString(),
  };
  saveCmsStoreClient(nextStore);
  return { syncedToSupabase: false, store: nextStore };
}

/**
 * Synchronizes a Project Case Study item to Supabase (`public.projects`) and local store.
 */
export async function upsertProjectItem(
  project: ProjectCaseStudy
): Promise<{ syncedToSupabase: boolean; store: CmsDynamicStore }> {
  const current = loadCmsStoreClient();
  const existsIdx = current.projects.findIndex((p) => p.id === project.id);
  const updatedProjects =
    existsIdx >= 0
      ? current.projects.map((p, i) => (i === existsIdx ? project : p))
      : [...current.projects, project];

  const nextStore: CmsDynamicStore = {
    ...current,
    projects: updatedProjects,
    updatedAt: new Date().toISOString(),
  };
  saveCmsStoreClient(nextStore);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      if (supabase) {
        const { error } = await supabase.from("projects").upsert(
          {
            slug: project.slug,
            title: project.title,
            category: project.category,
            year_label: project.year,
            role_en: project.roleEn || project.roleId,
            role_id: project.roleId,
            summary_en: project.summaryEn || project.summaryId,
            summary_id: project.summaryId,
            problem_en: project.problemEn || project.summaryId,
            problem_id: project.problemId || project.summaryId,
            architecture_en: project.architectureEn || project.summaryId,
            architecture_id: project.architectureId || project.summaryId,
            live_url: project.liveUrl,
            repo_url: project.repoUrl,
            status: project.status,
            is_featured: project.featured,
          },
          { onConflict: "slug" }
        );
        if (!error) {
          return { syncedToSupabase: true, store: nextStore };
        }
      }
    } catch {
      // Fallback
    }
  }

  return { syncedToSupabase: false, store: nextStore };
}

export async function deleteProjectItem(
  id: string
): Promise<{ syncedToSupabase: boolean; store: CmsDynamicStore }> {
  const current = loadCmsStoreClient();
  const nextStore: CmsDynamicStore = {
    ...current,
    projects: current.projects.filter((p) => p.id !== id),
    updatedAt: new Date().toISOString(),
  };
  saveCmsStoreClient(nextStore);
  return { syncedToSupabase: false, store: nextStore };
}

/**
 * Synchronizes a Certificate item to Supabase (`public.certificates`) and local store.
 */
export async function upsertCertificateItem(
  cert: CertificateItem
): Promise<{ syncedToSupabase: boolean; store: CmsDynamicStore }> {
  const current = loadCmsStoreClient();
  const existsIdx = current.certificates.findIndex((c) => c.id === cert.id);
  const updatedCerts =
    existsIdx >= 0
      ? current.certificates.map((c, i) => (i === existsIdx ? cert : c))
      : [...current.certificates, cert];

  const nextStore: CmsDynamicStore = {
    ...current,
    certificates: updatedCerts.sort((a, b) => a.sortOrder - b.sortOrder),
    updatedAt: new Date().toISOString(),
  };
  saveCmsStoreClient(nextStore);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      if (supabase) {
        const { error } = await supabase.from("certificates").upsert(
          {
            id: cert.id,
            title: cert.title,
            issuer: cert.issuer,
            issue_date: cert.issueDate,
            credential_id: cert.credentialId || "",
            category: cert.category || "Kompetisi",
            image_url: cert.imageUrl,
            file_url: cert.fileUrl,
            verify_url: cert.verifyUrl,
            summary_id: cert.summaryId,
            summary_en: cert.summaryEn || cert.summaryId,
            sort_order: cert.sortOrder,
            is_visible: cert.isVisible,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );
        if (!error) {
          return { syncedToSupabase: true, store: nextStore };
        }
      }
    } catch {
      // Fallback
    }
  }

  return { syncedToSupabase: false, store: nextStore };
}

export async function deleteCertificateItem(
  id: string
): Promise<{ syncedToSupabase: boolean; store: CmsDynamicStore }> {
  const current = loadCmsStoreClient();
  const nextStore: CmsDynamicStore = {
    ...current,
    certificates: current.certificates.filter((c) => c.id !== id),
    updatedAt: new Date().toISOString(),
  };
  saveCmsStoreClient(nextStore);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      if (supabase) {
        await supabase.from("certificates").delete().eq("id", id);
        return { syncedToSupabase: true, store: nextStore };
      }
    } catch {
      // Fallback
    }
  }

  return { syncedToSupabase: false, store: nextStore };
}


