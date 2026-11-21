"use client";

import { EDUCATIONS, type EducationItem } from "@/data/site";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const EDU_STORAGE_KEY = "fadli_cms_educations_v1";

export function loadEducationsClient(): EducationItem[] {
  if (typeof window === "undefined") return EDUCATIONS;
  try {
    const raw = window.localStorage.getItem(EDU_STORAGE_KEY);
    if (!raw) return EDUCATIONS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : EDUCATIONS;
  } catch {
    return EDUCATIONS;
  }
}

export function saveEducationsClient(items: EducationItem[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(EDU_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("fadli-cms-updated", { detail: { educations: items } }));
  } catch {
    // Ignore storage quota
  }
}

export async function upsertEducationItem(
  edu: EducationItem
): Promise<{ syncedToSupabase: boolean; items: EducationItem[] }> {
  const current = loadEducationsClient();
  const idx = current.findIndex((e) => e.id === edu.id);
  const nextItems = idx >= 0
    ? current.map((e, i) => (i === idx ? edu : e))
    : [...current, edu];

  saveEducationsClient(nextItems);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      if (supabase) {
        const { error } = await supabase.from("educations").upsert(
          {
            id: edu.id,
            institution: edu.institution,
            institution_short: edu.institutionShort || edu.institution,
            website_url: edu.websiteUrl || "",
            degree_id: edu.degreeId,
            degree_en: edu.degreeEn || edu.degreeId,
            period: edu.period,
            status_label_id: edu.statusLabelId || "Aktif",
            status_label_en: edu.statusLabelEn || "Active",
            location: edu.location,
            gpa_or_honors: edu.gpaOrHonors || "",
            focus_id: edu.focusId,
            focus_en: edu.focusEn || edu.focusId,
            curriculum_highlights_id: edu.curriculumHighlightsId || [],
            curriculum_highlights_en: edu.curriculumHighlightsEn || [],
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );
        if (!error) return { syncedToSupabase: true, items: nextItems };
      }
    } catch {
      // Fallback
    }
  }

  return { syncedToSupabase: false, items: nextItems };
}

export async function deleteEducationItem(
  id: string
): Promise<{ syncedToSupabase: boolean; items: EducationItem[] }> {
  const current = loadEducationsClient();
  const nextItems = current.filter((e) => e.id !== id);
  saveEducationsClient(nextItems);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      if (supabase) {
        await supabase.from("educations").delete().eq("id", id);
        return { syncedToSupabase: true, items: nextItems };
      }
    } catch {
      // Fallback
    }
  }

  return { syncedToSupabase: false, items: nextItems };
}
