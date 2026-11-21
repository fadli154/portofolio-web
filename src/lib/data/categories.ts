export type CategoryScope =
  | "all"
  | "projects"
  | "certificates"
  | "experiences"
  | "technologies"
  | "general";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  scope: CategoryScope;
  colorHex: string;
  description?: string;
  sortOrder: number;
  isVisible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  scope?: string;
  color_hex?: string;
  description?: string | null;
  sort_order?: number;
  is_visible?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const PRESET_CATEGORY_COLORS = [
  { name: "Lime Glow (Brand)", hex: "#c4e22e" },
  { name: "Electric Cyan", hex: "#38bdf8" },
  { name: "Emerald Tech", hex: "#34d399" },
  { name: "Cyber Violet", hex: "#a78bfa" },
  { name: "Solar Amber", hex: "#fbbf24" },
  { name: "Rose Ruby", hex: "#fb7185" },
];

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  // Project Categories
  {
    id: "cat-proj-01",
    name: "AI & Computer Vision",
    slug: "ai-computer-vision",
    scope: "projects",
    colorHex: "#c4e22e",
    description: "Model vision on-device, deteksi objek, dan klasifikasi multimodal",
    sortOrder: 1,
    isVisible: true,
  },
  {
    id: "cat-proj-02",
    name: "Mobile Accessibility",
    slug: "mobile-accessibility",
    scope: "projects",
    colorHex: "#38bdf8",
    description: "Aplikasi mobile inklusif, teks-ke-suara, dan ramah disabilitas",
    sortOrder: 2,
    isVisible: true,
  },
  {
    id: "cat-proj-03",
    name: "GovTech & Sektor Publik",
    slug: "govtech-public-sector",
    scope: "projects",
    colorHex: "#34d399",
    description: "Sistem administrasi kependudukan, pelaporan, dan tata kelola instansi",
    sortOrder: 3,
    isVisible: true,
  },
  {
    id: "cat-proj-04",
    name: "Web Application & Architecture",
    slug: "web-architecture",
    scope: "projects",
    colorHex: "#a78bfa",
    description: "Arsitektur web modern full-stack berbasis Next.js, Laravel, dan relasional DB",
    sortOrder: 4,
    isVisible: true,
  },
  {
    id: "cat-proj-05",
    name: "IoT & Edge AI",
    slug: "iot-edge-ai",
    scope: "projects",
    colorHex: "#fbbf24",
    description: "Ekosistem IoT smartband, sensorik cerdas, dan embedded computing",
    sortOrder: 5,
    isVisible: true,
  },
  {
    id: "cat-proj-06",
    name: "Academic & Research",
    slug: "academic-research",
    scope: "projects",
    colorHex: "#f472b6",
    description: "Portal studi akademik, matriks SWOT, dan komputasi riset perkuliahan",
    sortOrder: 6,
    isVisible: true,
  },

  // Certificate Categories
  {
    id: "cat-cert-01",
    name: "Kompetisi Nasional",
    slug: "kompetisi-nasional",
    scope: "certificates",
    colorHex: "#c4e22e",
    description: "Kejuaraan sains, inovasi teknologi, dan olimpiade tingkat nasional",
    sortOrder: 7,
    isVisible: true,
  },
  {
    id: "cat-cert-02",
    name: "Kompetensi & Lisensi",
    slug: "kompetensi-lisensi",
    scope: "certificates",
    colorHex: "#38bdf8",
    description: "Sertifikasi kompetensi keahlian dan lisensi profesional terverifikasi",
    sortOrder: 8,
    isVisible: true,
  },
  {
    id: "cat-cert-03",
    name: "Kursus & Pelatihan",
    slug: "kursus-pelatihan",
    scope: "certificates",
    colorHex: "#a78bfa",
    description: "Bootcamp, kursus intensif teknologi web, mobile, dan kecerdasan buatan",
    sortOrder: 9,
    isVisible: true,
  },
  {
    id: "cat-cert-04",
    name: "Akademik Perguruan Tinggi",
    slug: "akademik-pt",
    scope: "certificates",
    colorHex: "#fbbf24",
    description: "Penghargaan akademik, dekan, dan prestasi perkuliahan",
    sortOrder: 10,
    isVisible: true,
  },

  // Experience Categories
  {
    id: "cat-exp-01",
    name: "Pemerintahan & Dinas Kominfo",
    slug: "exp-govtech",
    scope: "experiences",
    colorHex: "#34d399",
    description: "Pengalaman kerja dan magang resmi pada dinas/instansi pemerintah",
    sortOrder: 11,
    isVisible: true,
  },
  {
    id: "cat-exp-02",
    name: "Proyek Klien & Freelance",
    slug: "exp-freelance",
    scope: "experiences",
    colorHex: "#38bdf8",
    description: "Pengerjaan perangkat lunak komersial untuk klien mandiri dan institusi",
    sortOrder: 12,
    isVisible: true,
  },
  {
    id: "cat-exp-03",
    name: "Kepemimpinan & Organisasi",
    slug: "exp-leadership",
    scope: "experiences",
    colorHex: "#f472b6",
    description: "Manajemen tim, kepengurusan himpunan, dan kolaborasi kelompok riset",
    sortOrder: 13,
    isVisible: true,
  },

  // Universal
  {
    id: "cat-gen-01",
    name: "General Engineering",
    slug: "general-engineering",
    scope: "all",
    colorHex: "#c4e22e",
    description: "Domain rekayasa perangkat lunak dan arsitektur sistem umum",
    sortOrder: 14,
    isVisible: true,
  },
];

export function mapCategoryRow(row: CategoryRow): CategoryItem {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    scope: (row.scope as CategoryScope) || "all",
    colorHex: row.color_hex || "#c4e22e",
    description: row.description || "",
    sortOrder: row.sort_order ?? 0,
    isVisible: row.is_visible ?? true,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function slugifyCategory(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
