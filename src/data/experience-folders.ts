export interface ExperienceFolderPaper {
  code: string;
  title: string;
  desc: string;
  details?: string[];
}

export interface ExperienceFolderData {
  id: string;
  slug: string;
  tab: string;
  title: string;
  subtitle: string;
  badge: string;
  year: string;
  color: string;
  tabColor: string;
  accentColor: string;
  textColor: string;
  summary: string;
  papers: ExperienceFolderPaper[];
  stack: string[];
  image: string;
}

export const EXPERIENCE_FOLDERS: ExperienceFolderData[] = [
  {
    "id": "exp-01",
    "slug": "simduk-kominfo",
    "tab": "EXP-01 · SIMDUK",
    "title": "Web Developer Intern",
    "subtitle": "Dinas Komunikasi & Informatika",
    "badge": "MAGANG RESMI",
    "year": "2025",
    "color": "#18191c",
    "tabColor": "#222327",
    "accentColor": "#c4e22e",
    "textColor": "#ffffff",
    "summary": "Digitalisasi administrasi kependudukan daerah via SIMDUK berbasis Laravel & MySQL.",
    "papers": [
      {
        "code": "DOC-01",
        "title": "Ringkasan Eksekutif & Demografi",
        "desc": "Arsitektur CRUD kependudukan & validasi NIK/KK"
      },
      {
        "code": "DOC-02",
        "title": "Optimasi Database & Rekapitulasi Sensus",
        "desc": "Query relasional terindeks & ekspor resmi RT/RW"
      },
      {
        "code": "DOC-03",
        "title": "RBAC Multi-Level Kelurahan",
        "desc": "Otentikasi bertingkat staf, verifikator & admin"
      }
    ],
    "stack": [
      "Laravel",
      "PHP",
      "MySQL",
      "Bootstrap",
      "REST API"
    ],
    "image": "/experience-folders/simduk-kominfo.svg"
  },
  {
    "id": "exp-02",
    "slug": "smart-hajj-ai",
    "tab": "AI-01 · SMART HAJJ",
    "title": "Smart Hajj: Vision AI",
    "subtitle": "Sistem Aksesibilitas Inklusif",
    "badge": "AI & COMPUTER VISION",
    "year": "2025 - 2026",
    "color": "#3b1c85",
    "tabColor": "#4c28a8",
    "accentColor": "#c4e22e",
    "textColor": "#ffffff",
    "summary": "Platform Computer Vision deteksi pecahan uang SAR & isyarat dua arah jemaah disabilitas.",
    "papers": [
      {
        "code": "DOC-01",
        "title": "Pipeline 4-Tahap Deteksi Kamera",
        "desc": "Kamera ponsel -> OpenCV -> Klasifikasi SAR -> TTS"
      },
      {
        "code": "DOC-02",
        "title": "21-Titik MediaPipe Hand Landmarks",
        "desc": "Ekstraksi koordinat 3D sendi tangan real-time 60fps"
      },
      {
        "code": "DOC-03",
        "title": "Penerjemah Bahasa Isyarat 2 Arah",
        "desc": "Komunikasi mandiri jemaah haji & petugas Arab Saudi"
      }
    ],
    "stack": [
      "Python",
      "OpenCV",
      "MediaPipe",
      "Deep Learning",
      "Flutter"
    ],
    "image": "/experience-folders/smart-hajj-ai.svg"
  },
  {
    "id": "exp-03",
    "slug": "oase-award",
    "tab": "AWARD · OASE III",
    "title": "Juara II Inovasi Teknologi",
    "subtitle": "Kementerian Agama RI (Nasional)",
    "badge": "PRESTASI NASIONAL",
    "year": "2024",
    "color": "#064e3b",
    "tabColor": "#065f46",
    "accentColor": "#6ee7b7",
    "textColor": "#ffffff",
    "summary": "Penghargaan resmi Juara II Nasional Karya Literasi & Inovasi Teknologi OASE III PTKI se-Indonesia.",
    "papers": [
      {
        "code": "DOC-01",
        "title": "Sertifikat Kejuaraan Nasional Resmi",
        "desc": "Validasi Kementerian Agama Republik Indonesia"
      },
      {
        "code": "DOC-02",
        "title": "Studi Kelayakan & Pengujian Juri",
        "desc": "Pengujian prototipe teknologi literasi di hadapan juri"
      },
      {
        "code": "DOC-03",
        "title": "Arsitektur Sistem Inklusif",
        "desc": "Dampak nyata teknologi pada aksesibilitas publik"
      }
    ],
    "stack": [
      "AI Prototype",
      "Computer Vision",
      "GovTech",
      "Python"
    ],
    "image": "/experience-folders/oase-award.svg"
  },
  {
    "id": "exp-04",
    "slug": "kelompok-k1",
    "tab": "ACADEMIC · TIM K-1",
    "title": "Portal Kewirausahaan K-1",
    "subtitle": "Ekosistem Kolaboratif Informatika",
    "badge": "TIM AKADEMIK",
    "year": "2026",
    "color": "#0f172a",
    "tabColor": "#1e293b",
    "accentColor": "#38bdf8",
    "textColor": "#ffffff",
    "summary": "Rancang bangun portal perkuliahan 6 pertemuan, pelacakan tugas, absensi, & sinkronisasi Supabase.",
    "papers": [
      {
        "code": "DOC-01",
        "title": "Kontrak Perkuliahan & Tim K-1",
        "desc": "Struktur kepengurusan tim, repositori GitHub, & linimasa"
      },
      {
        "code": "DOC-02",
        "title": "Analisis SWOT & Ide Bisnis",
        "desc": "Pemetaan peluang pasar web modern & proposisi nilai"
      },
      {
        "code": "DOC-03",
        "title": "Integrasi Supabase & Headless CMS",
        "desc": "State real-time sinkron dengan database PostgreSQL cloud"
      }
    ],
    "stack": [
      "Next.js 15",
      "TypeScript",
      "Tailwind",
      "Supabase"
    ],
    "image": "/experience-folders/kelompok-k1.svg"
  },
  {
    "id": "exp-05",
    "slug": "govtech-reporting",
    "tab": "DATA · KOMINFO",
    "title": "Dashboard Pelaporan Publik",
    "subtitle": "GovTech Sensus & Ekspor",
    "badge": "DATABASE GOVTECH",
    "year": "2025",
    "color": "#281c1c",
    "tabColor": "#3a2727",
    "accentColor": "#fca5a5",
    "textColor": "#ffffff",
    "summary": "Agregasi demografi kelurahan, rekap RT/RW, dan otomasi pelaporan kependudukan tingkat daerah.",
    "papers": [
      {
        "code": "DOC-01",
        "title": "Skema Relasional Normalisasi 3NF",
        "desc": "Struktur tabel terisolasi untuk data sensus & demografi"
      },
      {
        "code": "DOC-02",
        "title": "Ekspor Dokumen Laporan Kependudukan",
        "desc": "Otomasi generate PDF/Excel terverifikasi tanda tangan"
      },
      {
        "code": "DOC-03",
        "title": "Filter Dinamis & Query Indexing",
        "desc": "Pencarian NIK dalam hitungan milidetik pada puluhan ribu row"
      }
    ],
    "stack": [
      "Laravel",
      "MySQL",
      "REST API",
      "GovTech"
    ],
    "image": "/experience-folders/govtech-reporting.svg"
  },
  {
    "id": "exp-06",
    "slug": "vision-gesture-engine",
    "tab": "VISION · 21-PTS",
    "title": "Vision AI Gesture Engine",
    "subtitle": "Pelacakan Isyarat 21-Titik",
    "badge": "RESEARCH & APPLIED CV",
    "year": "2025",
    "color": "#1e1b4b",
    "tabColor": "#2e276b",
    "accentColor": "#a5b4fc",
    "textColor": "#ffffff",
    "summary": "Engine visi komputer pelacakan sendi tangan real-time dengan toleransi rotasi tinggi untuk mobile.",
    "papers": [
      {
        "code": "DOC-01",
        "title": "Topologi 21 Sendi Tangan MediaPipe",
        "desc": "Pemetaan koordinat 3D pergelangan, jempol, hingga kelingking"
      },
      {
        "code": "DOC-02",
        "title": "Inferensi 60 FPS pada Mobile",
        "desc": "Optimasi model TFLite untuk kamera Android/iOS"
      },
      {
        "code": "DOC-03",
        "title": "Integrasi Suara TTS Dua Arah",
        "desc": "Penerjemahan teks ke suara instan bahasa Arab & Indonesia"
      }
    ],
    "stack": [
      "MediaPipe",
      "OpenCV",
      "TensorFlow Lite",
      "Python"
    ],
    "image": "/experience-folders/vision-gesture-engine.svg"
  }
];
