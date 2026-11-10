import { z } from "zod";
import type { CertificateItem } from "@/data/site";

/** Row shape of `public.certificates` (snake_case, as returned by PostgREST). */
export interface CertificateRow {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  credential_id: string | null;
  category: string | null;
  image_url: string | null;
  file_url: string | null;
  verify_url: string | null;
  summary_id: string | null;
  summary_en: string | null;
  sort_order: number | null;
  is_visible: boolean | null;
}

export const CERTIFICATE_COLUMNS =
  "id,title,issuer,issue_date,credential_id,category,image_url,file_url,verify_url,summary_id,summary_en,sort_order,is_visible";

export const CERTIFICATES_BUCKET = "certificates";
export const MAX_CERTIFICATE_FILE_BYTES = 5 * 1024 * 1024;
export const CERTIFICATE_IMAGE_TYPES = ["image/webp", "image/png", "image/jpeg"] as const;
export const CERTIFICATE_DOCUMENT_TYPES = [...CERTIFICATE_IMAGE_TYPES, "application/pdf"] as const;

export function mapCertificateRow(row: CertificateRow): CertificateItem {
  return {
    id: row.id,
    title: row.title,
    issuer: row.issuer,
    issueDate: row.issue_date,
    credentialId: row.credential_id ?? "",
    category: row.category ?? "Kompetisi",
    imageUrl: row.image_url ?? "",
    fileUrl: row.file_url,
    verifyUrl: row.verify_url,
    summaryId: row.summary_id ?? "",
    summaryEn: row.summary_en ?? "",
    sortOrder: row.sort_order ?? 0,
    isVisible: row.is_visible ?? true,
  };
}

/** Same rule as the `certificates_safe_urls` CHECK constraint: no javascript:/data: URIs. */
const assetUrl = z
  .string()
  .trim()
  .regex(/^(https:\/\/|\/)/, "URL harus diawali https:// atau /");

export const certificateInputSchema = z.object({
  title: z.string().trim().min(3, "Judul minimal 3 karakter").max(200),
  issuer: z.string().trim().min(2, "Penerbit wajib diisi").max(160),
  issueDate: z.string().trim().min(2, "Tanggal wajib diisi").max(60),
  credentialId: z.string().trim().max(120).default(""),
  category: z.string().trim().min(2).max(60).default("Kompetisi"),
  imageUrl: assetUrl,
  fileUrl: assetUrl.nullable(),
  verifyUrl: z
    .string()
    .trim()
    .regex(/^https:\/\//, "Link verifikasi harus https://")
    .nullable(),
  summaryId: z.string().trim().max(600).default(""),
  summaryEn: z.string().trim().max(600).default(""),
  sortOrder: z.number().int().min(0).max(999),
  isVisible: z.boolean(),
});

export type CertificateInput = z.infer<typeof certificateInputSchema>;

export function toCertificateRow(input: CertificateInput) {
  return {
    title: input.title,
    issuer: input.issuer,
    issue_date: input.issueDate,
    credential_id: input.credentialId,
    category: input.category,
    image_url: input.imageUrl,
    file_url: input.fileUrl,
    verify_url: input.verifyUrl,
    summary_id: input.summaryId,
    summary_en: input.summaryEn || input.summaryId,
    sort_order: input.sortOrder,
    is_visible: input.isVisible,
  };
}

export function sortCertificates(items: CertificateItem[]): CertificateItem[] {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder);
}

