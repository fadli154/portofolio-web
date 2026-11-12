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
    id: "exp-01",
    slug: "hajicare",
    tab: "AI-01 · HAJICARE",
    title: "HajiCare: IoT & Edge AI",
    subtitle: "Juara II Nasional OASE III PTKIN",
    badge: "JUARA II NASIONAL",
    year: "2025 - 2026",
    color: "#c4e22e",
    tabColor: "#9fbb17",
    accentColor: "#e8f79c",
    textColor: "#111213",
    summary: "Ekosistem IoT Smartband ESP32-S3 & Edge AI offline deteksi uang SAR dan bahasa isyarat jemaah haji.",
    papers: [
      {
        code: "DOC-01",
        title: "Smart IoT Wearable (ESP32-S3)",
        desc: "Telemetri BLE: GPS, SpO2, BPM, Suhu Tubuh, & Jatuh",
      },
      {
        code: "DOC-02",
        title: "Edge AI Offline 100%",
        desc: "Deteksi Riyal (SAR) TFLite/YOLO dengan suara TTS otomatis",
      },
      {
        code: "DOC-03",
        title: "Aksesibilitas Isyarat & Radar",
        desc: "MediaPipe 21 sendi tangan, safe-radius, & tombol Panic SOS",
      },
    ],
    stack: ["Flutter", "Dart", "Firebase", "ESP32-S3", "TensorFlow Lite", "MediaPipe"],
    image: "/experience-folders/hajicare.png",
  },
  {
    id: "exp-02",
    slug: "sign2speech",
    tab: "AI-02 · SIGN2SPEECH",
    title: "Sign2Speech: Aksesibilitas",
    subtitle: "Universal 2-Way Communication",
    badge: "AI & COMPUTER VISION",
    year: "2025",
    color: "#18191d",
    tabColor: "#111214",
    accentColor: "#d4d4d8",
    textColor: "#ffffff",
    summary: "Sistem komunikasi dua arah Teman Tuli & Teman Dengar via MediaPipe 21 sendi tangan dan TFLite MotionGRU.",
    papers: [
      {
        code: "DOC-01",
        title: "Ekstraksi 21 Sendi Tangan",
        desc: "Pelacakan 3D MediaPipe 60 FPS real-time tanpa latensi",
      },
      {
        code: "DOC-02",
        title: "MotionGRU TFLite Classifier",
        desc: "Klasifikasi sekuensial BISINDO & SIBI offline on-device",
      },
      {
        code: "DOC-03",
        title: "Sintesis Suara FIFO & STT",
        desc: "Antrean TTS bahasa Indonesia dan konversi ucapan ke teks",
      },
    ],
    stack: ["Flutter", "Dart", "GetX", "TensorFlow Lite", "MediaPipe", "TTS & STT"],
    image: "/experience-folders/sign2speech.png",
  },
  {
    id: "exp-03",
    slug: "project-warga-kominfo",
    tab: "GOV-01 · PROJ WARGA",
    title: "Web Developer Intern",
    subtitle: "Dinas Komunikasi & Informatika",
    badge: "MAGANG RESMI",
    year: "2025",
    color: "#334155",
    tabColor: "#1e293b",
    accentColor: "#cbd5e1",
    textColor: "#ffffff",
    summary: "Digitalisasi administrasi kependudukan (Project Warga) di Dinas Kominfo berbasis Laravel 9 & MySQL.",
    papers: [
      {
        code: "DOC-01",
        title: "Arsitektur Kependudukan RT/RW",
        desc: "Manajemen data warga, validasi NIK/KK, & filter demografis",
      },
      {
        code: "DOC-02",
        title: "Server-Side Yajra DataTables",
        desc: "Query relasional terindeks untuk puluhan ribu data sensus",
      },
      {
        code: "DOC-03",
        title: "Otomasi Ekspor Maatwebsite Excel",
        desc: "Ekspor/impor massal berkas rekapitulasi resmi kelurahan",
      },
    ],
    stack: ["Laravel 9", "PHP 8", "MySQL", "Vite", "Yajra DataTables", "Chart.js"],
    image: "/experience-folders/project-warga.png",
  },
  {
    id: "exp-04",
    slug: "kopmas-aduan-susu",
    tab: "GOV-02 · KOPMAS",
    title: "Portal Aduan Susu Nasional",
    subtitle: "GovTech & Perlindungan Kesehatan",
    badge: "PROYEK PEMERINTAH",
    year: "2025",
    color: "#3f3f46",
    tabColor: "#27272a",
    accentColor: "#d4d4d8",
    textColor: "#ffffff",
    summary: "Portal advokasi dan pengawasan distribusi kental manis serta nutrisi balita nasional se-Indonesia.",
    papers: [
      {
        code: "DOC-01",
        title: "Sistem Pengaduan Publik 34 Provinsi",
        desc: "Formulir aduan interaktif berpenanda lokasi & foto bukti",
      },
      {
        code: "DOC-02",
        title: "Kompresi Gambar Client-Side",
        desc: "Optimalisasi bukti upload hingga hemat 75% kuota di daerah",
      },
      {
        code: "DOC-03",
        title: "Dashboard Verifikasi & Tiket Terbuka",
        desc: "Generator nomor tiket publik dan audit laporan petugas",
      },
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "REST API", "Civic Tech"],
    image: "/experience-folders/kopmas.png",
  },
  {
    id: "exp-05",
    slug: "dispress",
    tab: "WEB-01 · DISPRESS",
    title: "Dispress: SPPD & Disposisi",
    subtitle: "Sistem Otomasi Persuratan Dinas",
    badge: "WORKFLOW AUTOMATION",
    year: "2024 - 2025",
    color: "#2b3440",
    tabColor: "#1f2630",
    accentColor: "#cbd5e1",
    textColor: "#ffffff",
    summary: "Otomasi alur disposisi surat dinas masuk/keluar dan pencetakan SPPD elektronik terstandarisasi.",
    papers: [
      {
        code: "DOC-01",
        title: "Alur Disposisi Multi-Role",
        desc: "Tata kelola 3 tingkat: Admin, Officer, dan Staff",
      },
      {
        code: "DOC-02",
        title: "Linimasa Riwayat Surat",
        desc: "Pelacakan kronologis status berkas dinas tanpa kertas",
      },
      {
        code: "DOC-03",
        title: "Generator Lembar SPPD",
        desc: "Pencetakan surat tugas perjalanan dinas standar birokrasi",
      },
    ],
    stack: ["Laravel", "PHP", "MySQL", "Vite", "Stisla Bootstrap", "SweetAlert2"],
    image: "/experience-folders/dispress.png",
  },
  {
    id: "exp-06",
    slug: "fintrack",
    tab: "APP-01 · FINTRACK",
    title: "FinTrack: Smart Finance",
    subtitle: "Asisten Keuangan & Receipt OCR",
    badge: "MOBILE & OCR CV",
    year: "2025",
    color: "#3b3634",
    tabColor: "#292524",
    accentColor: "#d6d3d1",
    textColor: "#ffffff",
    summary: "Pelacak finansial personal dengan scanner struk fisik otomatis berbasis computer vision & analitik grafik.",
    papers: [
      {
        code: "DOC-01",
        title: "Pemindai Struk Kamera (OCR)",
        desc: "Ekstraksi nominal belanja otomatis via flutter_vision",
      },
      {
        code: "DOC-02",
        title: "Visualisasi Grafik FL Chart 60 FPS",
        desc: "Grafik arus kas interaktif & pengelompokan anggaran",
      },
      {
        code: "DOC-03",
        title: "Sinkronisasi Cloud & Ekspor PDF",
        desc: "Firebase Firestore multi-device & cetak laporan bulanan",
      },
    ],
    stack: ["Flutter", "Dart", "GetX", "flutter_vision", "Firebase", "FL Chart", "PDF"],
    image: "/experience-folders/fintrack.png",
  },
  {
    id: "exp-07",
    slug: "project-spp",
    tab: "EDU-01 · E-SPP",
    title: "E-SPP: Paperless Finance",
    subtitle: "Manajemen Pembayaran Sekolah",
    badge: "EDUTECH",
    year: "2024",
    color: "#23252c",
    tabColor: "#16181d",
    accentColor: "#cbd5e1",
    textColor: "#ffffff",
    summary: "Digitalisasi pembayaran SPP sekolah terpadu, menghilangkan buku kas fisik & otomasi kuitansi digital.",
    papers: [
      {
        code: "DOC-01",
        title: "Buku Kas Siswa Digital",
        desc: "Pencatatan transaksi SPP paperless dan ramah lingkungan",
      },
      {
        code: "DOC-02",
        title: "Monitoring Tunggakan & Rekap",
        desc: "Kalkulasi saldo otomatis per siswa dan rekap bulanan",
      },
      {
        code: "DOC-03",
        title: "Kuitansi Pembayaran Otomatis",
        desc: "Pencetakan bukti bayar resmi dan transparansi wali murid",
      },
    ],
    stack: ["Laravel", "PHP", "MySQL", "Laravel-Mix", "Bootstrap", "Axios"],
    image: "/experience-folders/project-spp.png",
  },
  {
    id: "exp-08",
    slug: "travelease",
    tab: "APP-02 · TRAVELEASE",
    title: "TravelEase: Smart Tourism",
    subtitle: "Panduan Wisata Nusantara",
    badge: "GEOLOCATION MOBILE",
    year: "2025",
    color: "#363b4e",
    tabColor: "#262a38",
    accentColor: "#cbd5e1",
    textColor: "#ffffff",
    summary: "Aplikasi mobile panduan wisata nusantara terpadu dengan peta interaktif Google Maps & Cloud Firebase.",
    papers: [
      {
        code: "DOC-01",
        title: "Navigasi Peta Google Maps Native",
        desc: "Pencarian titik destinasi, penanda interaktif, & rute",
      },
      {
        code: "DOC-02",
        title: "Katalog Wisata & Rating Ulasan",
        desc: "Profil wisata lengkap, info tiket, dan ulasan wisatawan",
      },
      {
        code: "DOC-03",
        title: "Arsitektur Cloud Firestore",
        desc: "Sinkronisasi favorit offline/online dan portal admin",
      },
    ],
    stack: ["Flutter", "Dart", "Material 3", "Provider", "Google Maps", "Firebase"],
    image: "/experience-folders/travelease.png",
  },
];
