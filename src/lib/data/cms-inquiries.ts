"use client";

export interface AdminInquiry {
  id: string;
  senderName: string;
  senderEmail: string;
  company: string;
  scope: string;
  receivedAt: string;
  status: "unread" | "read" | "replied";
  message: string;
}

const INQUIRIES_STORAGE_KEY = "fadli_cms_inquiries_v1";

const DEFAULT_INQUIRIES: AdminInquiry[] = [
  {
    id: "inq-01",
    senderName: "Budi Santoso",
    senderEmail: "budi.santoso@kominfo-daerah.example",
    company: "Dinas Komunikasi dan Informatika",
    scope: "contract",
    receivedAt: "2026-11-10 08:42 WIB",
    status: "unread",
    message:
      "Halo Fadli, kami meninjau dokumentasi aplikasi pendataan kependudukan Project Warga (Laravel 9 & MySQL) serta portal pengaduan Kopmas Anda. Apakah tersedia waktu untuk diskusi pengembangan modul integrasi data berikutnya?",
  },
  {
    id: "inq-02",
    senderName: "Dr. Ahmad Fauzi",
    senderEmail: "ahmad.fauzi@riset-ai-haji.example",
    company: "Tim Inovasi Aksesibilitas Jemaah Haji",
    scope: "advisory",
    receivedAt: "2026-11-09 15:18 WIB",
    status: "replied",
    message:
      "Kami sangat tertarik dengan ekosistem HajiCare untuk deteksi mata uang Riyal (SAR) dan penerjemah bahasa isyarat berbasis MediaPipe Hand Landmarks peraih Juara II OASE III.",
  },
  {
    id: "inq-03",
    senderName: "Nurul Hidayah",
    senderEmail: "nurul.h@edutech-banten.example",
    company: "EduTech Solusindo",
    scope: "freelance",
    receivedAt: "2026-11-18 11:05 WIB",
    status: "read",
    message:
      "Selamat siang Fadli, kami melihat portfolio aplikasi E-SPP Paperless Finance yang Anda kembangkan di SMKN 4 Tangerang. Kami ingin mengajak kolaborasi untuk sistem administrasi SPP berbasis Next.js & Supabase.",
  },
];

export function loadInquiriesClient(): AdminInquiry[] {
  if (typeof window === "undefined") return DEFAULT_INQUIRIES;
  try {
    const raw = window.localStorage.getItem(INQUIRIES_STORAGE_KEY);
    if (!raw) return DEFAULT_INQUIRIES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_INQUIRIES;
  } catch {
    return DEFAULT_INQUIRIES;
  }
}

export function saveInquiriesClient(items: AdminInquiry[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("fadli-cms-updated", { detail: { inquiries: items } }));
  } catch {
    // Ignore quota
  }
}

export function upsertInquiryItem(inquiry: AdminInquiry): AdminInquiry[] {
  const current = loadInquiriesClient();
  const idx = current.findIndex((i) => i.id === inquiry.id);
  const next = idx >= 0 ? current.map((i, idx2) => (idx2 === idx ? inquiry : i)) : [inquiry, ...current];
  saveInquiriesClient(next);
  return next;
}

export function deleteInquiryItem(id: string): AdminInquiry[] {
  const current = loadInquiriesClient();
  const next = current.filter((i) => i.id !== id);
  saveInquiriesClient(next);
  return next;
}
