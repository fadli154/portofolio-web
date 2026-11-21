"use client";

import {
  DEFAULT_CATEGORIES,
  mapCategoryRow,
  type CategoryItem,
} from "@/lib/data/categories";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const CATEGORIES_STORAGE_KEY = "fadli_cms_categories_v1";
const ENTITY_CATEGORIES_KEY = "fadli_cms_entity_categories_v1";

export interface EntityCategoryMap {
  [entityId: string]: string[]; // array of category IDs or slugs
}

export function loadCategoriesClient(): CategoryItem[] {
  if (typeof window === "undefined") return DEFAULT_CATEGORIES;
  try {
    const raw = window.localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (!raw) return DEFAULT_CATEGORIES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export function saveCategoriesClient(items: CategoryItem[]): void {
  if (typeof window === "undefined") return;
  try {
    const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder);
    window.localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(sorted));
    window.dispatchEvent(
      new CustomEvent("fadli-cms-updated", { detail: { categories: sorted } })
    );
  } catch {
    // Ignore storage quota
  }
}

export function loadEntityCategoryMapClient(): EntityCategoryMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(ENTITY_CATEGORIES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveEntityCategoryMapClient(map: EntityCategoryMap): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ENTITY_CATEGORIES_KEY, JSON.stringify(map));
  } catch {
    // Ignore storage quota
  }
}

export function getEntityCategoryIds(entityId: string): string[] {
  const map = loadEntityCategoryMapClient();
  return map[entityId] || [];
}

export function setEntityCategoryIds(entityId: string, categoryIds: string[]): void {
  const map = loadEntityCategoryMapClient();
  map[entityId] = categoryIds;
  saveEntityCategoryMapClient(map);
}

export async function upsertCategoryItem(
  category: CategoryItem
): Promise<{ syncedToSupabase: boolean; items: CategoryItem[] }> {
  const current = loadCategoriesClient();
  const idx = current.findIndex((c) => c.id === category.id || c.slug === category.slug);
  const nextItems =
    idx >= 0
      ? current.map((c, i) => (i === idx ? category : c))
      : [...current, category];

  saveCategoriesClient(nextItems);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      if (supabase) {
        const { error } = await supabase.from("categories").upsert(
          {
            id: category.id.startsWith("cat-") ? undefined : category.id,
            name: category.name,
            slug: category.slug,
            scope: category.scope,
            color_hex: category.colorHex,
            description: category.description || "",
            sort_order: category.sortOrder,
            is_visible: category.isVisible,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "slug" }
        );
        if (!error) {
          return { syncedToSupabase: true, items: nextItems };
        }
      }
    } catch {
      // Fallback
    }
  }

  return { syncedToSupabase: false, items: nextItems };
}

export async function deleteCategoryItem(
  idOrSlug: string
): Promise<{ syncedToSupabase: boolean; items: CategoryItem[] }> {
  const current = loadCategoriesClient();
  const nextItems = current.filter((c) => c.id !== idOrSlug && c.slug !== idOrSlug);
  saveCategoriesClient(nextItems);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      if (supabase) {
        await supabase
          .from("categories")
          .delete()
          .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`);
        return { syncedToSupabase: true, items: nextItems };
      }
    } catch {
      // Fallback
    }
  }

  return { syncedToSupabase: false, items: nextItems };
}

/**
 * Sync entity categories to junction table in Supabase
 */
export async function syncEntityCategoriesToSupabase(
  tableName: "project_categories" | "certificate_categories" | "experience_categories",
  foreignKeyCol: "project_id" | "certificate_id" | "experience_id",
  entityId: string,
  categoryIds: string[]
): Promise<boolean> {
  // Always update local map
  setEntityCategoryIds(entityId, categoryIds);

  if (!isSupabaseConfigured()) return false;
  try {
    const supabase = createClient();
    if (!supabase) return false;

    // Remove old bindings
    await supabase.from(tableName).delete().eq(foreignKeyCol, entityId);

    // Filter valid UUIDs if any
    const validRows = categoryIds
      .filter((id) => /^[0-9a-fA-F-]{36}$/.test(id))
      .map((catId) => ({
        [foreignKeyCol]: entityId,
        category_id: catId,
      }));

    if (validRows.length > 0) {
      await supabase.from(tableName).insert(validRows);
    }
    return true;
  } catch {
    return false;
  }
}
