export interface TradeoffItem {
  decision: string;
  chosen: string;
  alternative: string;
  rationaleEn: string;
  rationaleId: string;
}

export interface ProjectMetric {
  labelEn: string;
  labelId: string;
  value: string;
  delta: string;
}

export interface ProjectCaseStudy {
  id: string;
  indexCode: string;
  slug: string;
  title: string;
  category: string;
  year: string;
  clientOrContext: string;
  roleEn: string;
  roleId: string;
  featured: boolean;
  status: "published" | "draft";
  summaryEn: string;
  summaryId: string;
  recruiterExecSummaryEn: string;
  recruiterExecSummaryId: string;
  problemEn: string;
  problemId: string;
  architectureEn: string;
  architectureId: string;
  tradeoffs: TradeoffItem[];
  metrics: ProjectMetric[];
  stack: string[];
  liveUrl: string;
  repoUrl: string;
  videoEmbedUrl?: string;
  accentColor: string;
  diagramSpec: {
    inputNode: string;
    edgeNode: string;
    coreNode: string;
    outputNode: string;
    throughputLabel: string;
  };
}

export interface ExperienceItem {
  id: string;
  indexCode: string;
  company: string;
  roleEn: string;
  roleId: string;
  employmentType: string;
  location: string;
  period: string;
  isCurrent: boolean;
  metricsBadge: string;
  summaryEn: string;
  summaryId: string;
  highlightsEn: string[];
  highlightsId: string[];
  stack: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degreeEn: string;
  degreeId: string;
  period: string;
  location: string;
  gpaOrHonors: string;
  focusEn: string;
  focusId: string;
}

/** Mirrors `public.certificates` (see supabase/migrations/20261110000006). */
export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  category: string;
  /** Tile + lightbox image: Supabase Storage public URL or a /public path. */
  imageUrl: string;
  /** Original document (PDF/JPG), optional. */
  fileUrl: string | null;
  /** External verification page, optional. */
  verifyUrl: string | null;
  summaryId: string;
  summaryEn: string;
  sortOrder: number;
  isVisible: boolean;
}

export interface TechnologyItem {
  name: string;
  slug: string;
  category:
    | "Frontend & Creative"
    | "Backend & Database"
    | "AI & Agentic Systems"
    | "DevOps & Cloud"
    | "Mobile & Cross-Platform";
  proficiency: "Core Architecture" | "Production" | "Active Exploration";
  years: string;
  noteEn: string;
  noteId: string;
}

export interface SwotPoint {
  code: string;
  titleId: string;
  titleEn: string;
  descId: string;
  descEn: string;
}

export interface ResearchInterestItem {
  code: string;
  labelId: string;
  labelEn: string;
}

export interface KwuSessionItem {
  id?: string;
  number: number;
  code: string;
  titleId: string;
  titleEn: string;
  descId: string;
  descEn: string;
  sessionDate?: string;
  attendanceStatus?: "Hadir" | "Izin" | "Sakit" | "Belum Dimulai";
  attendanceProofUrl?: string | null;
  taskTitle?: string;
  taskDescription?: string;
  taskUrl?: string;
  taskStatus?: "Selesai" | "Proses" | "Belum Ada Tugas";
}

export interface TeamK1Member {
  number: string;
  name: string;
  roleBadgeId: string;
  roleBadgeEn: string;
  roleType: "entrepreneur" | "employee";
  isSelf?: boolean;
  portfolioUrl: string;
}

export interface SkillGroupCard {
  id: string;
  badge: string;
  titleId: string;
  titleEn: string;
  descId: string;
  descEn: string;
  skillIconsUrl: string;
  items: string[];
}

export const SITE_PROFILE = {
  fullName: "Fadli Hifziansyah",
  shortName: "Fadli H.",
  handle: "fadli154",
  avatarUrl: "https://github.com/fadli154.png",
  roleTitleEn: "Informatics Student · Full-Stack Web, Mobile & Computer Vision Developer",
  roleTitleId: "Mahasiswa Informatika · Full-Stack Web, Mobile & Computer Vision Developer",
  location: "Indonesia · UTC+7",
  coordinates: "06°12'S · 106°50'E",
  email: "fadli.hifziansyah@gmail.com",
  calUrl: "https://www.linkedin.com/in/fadli-hifziansyah-1b26902ba/",
  cvUrl: "/cv-fadli-hifziansyah.pdf",
  socials: {
    github: "https://github.com/fadli154",
    linkedin: "https://www.linkedin.com/in/fadli-hifziansyah-1b26902ba/",
    instagram: "https://www.instagram.com/fadli.890",
    googleSites: "https://sites.google.com/view/pdhlii/halaman-muka",
    kelompokK1: "https://sites.google.com/view/reynaldi-porto/portofolio",
  },
  availability: {
    available: true,
    en: "Active Informatics Student (Group K-1) · Open for Internship, Freelance & Research",
    id: "Mahasiswa Aktif Informatika (Kelompok K-1) · Terbuka untuk Magang, Freelance & Riset",
  },
  hero: {
    craft: {
      kickerEn: "INFORMATICS PORTFOLIO · WEB, MOBILE, GOVTECH & COMPUTER VISION",
      kickerId: "PORTOFOLIO INFORMATIKA · WEB, MOBILE, GOVTECH & COMPUTER VISION",
      headlineEn: "Building software engineered for real-world utility and public impact.",
      headlineId: "Membangun perangkat lunak yang berfokus pada dampak nyata dan utilitas publik.",
      leadEn:
        "I am Fadli Hifziansyah. I build software engineered for real-world utility — from municipal citizen data administration (Project Warga) at Dinas Kominfo, national civic health reporting (Kopmas), to award-winning mobile Edge AI and IoT wearables (HajiCare & Sign2Speech).",
      leadId:
        "Saya Fadli Hifziansyah. Saya membangun perangkat lunak untuk menyelesaikan masalah nyata di lapangan — mulai dari administrasi kependudukan (Project Warga) di Dinas Kominfo, portal pengaduan publik nasional (Kopmas), hingga inovasi mobile Edge AI dan IoT wearable (HajiCare & Sign2Speech).",
    },
    recruiter: {
      kickerEn: "PROFESSIONAL SUMMARY · INTERNSHIP, GOVTECH & AI INNOVATION",
      kickerId: "RINGKASAN PROFESIONAL · MAGANG KOMINFO, GOVTECH & INOVASI AI",
      headlineEn: "Full-Stack Web, Mobile & Computer Vision Developer with public-sector experience.",
      headlineId: "Pengembang Full-Stack Web, Mobile & Computer Vision dengan pengalaman instansi publik.",
      leadEn:
        "Experienced as a Web Developer Intern at Dinas Kominfo (Project Warga Laravel 9 & MySQL), Freelance GovTech Developer (Kopmas national complaint system), and Lead AI/IoT Engineer for HajiCare (2nd Winner at OASE III PTKIN Ministry of Religious Affairs).",
      leadId:
        "Berpengalaman sebagai Web Developer Intern di Dinas Kominfo (Project Warga Laravel 9 & MySQL), Freelance GovTech Developer (Kopmas portal aduan susu nasional), serta Lead AI/IoT Engineer untuk HajiCare (Juara II Nasional OASE III PTKIN Kementerian Agama RI).",
    },
  },
  telemetryMetrics: [
    {
      code: "EXP-01",
      labelEn: "Official Internship",
      labelId: "Magang Resmi Kominfo",
      value: "Project Warga",
      detailEn: "Municipal Citizen Info System (Laravel 9 & MySQL)",
      detailId: "Sistem Administrasi Kependudukan (Laravel & MySQL)",
    },
    {
      code: "EXP-02",
      labelEn: "Government Freelance",
      labelId: "Freelance Pemerintah",
      value: "Kopmas",
      detailEn: "National Milk Complaint & Child Nutrition Portal",
      detailId: "Portal Pengaduan Susu & Gizi Anak Nasional",
    },
    {
      code: "AI-03",
      labelEn: "Flagship AI & IoT",
      labelId: "Inovasi AI & IoT",
      value: "HajiCare",
      detailEn: "Juara II OASE III · ESP32-S3 IoT & Offline Edge AI",
      detailId: "Juara II OASE III · IoT ESP32-S3 & Edge AI Offline",
    },
    {
      code: "ACA-04",
      labelEn: "Academic Team Hub",
      labelId: "Tim Akademik Informatika",
      value: "Kelompok K-1",
      detailEn: "6 Entrepreneurship Sessions & 20-Point SWOT",
      detailId: "6 Pertemuan Kewirausahaan & Evaluasi SWOT",
    },
  ],
};

export const SKILL_GROUP_CARDS: SkillGroupCard[] = [
  {
    id: "frontend",
    badge: "UI / UX",
    titleId: "Frontend & Web Development",
    titleEn: "Frontend & Web Development",
    descId:
      "Membangun antarmuka pengguna modern yang responsif, interaktif, dan memiliki performa aksesibilitas tinggi di berbagai perangkat.",
    descEn:
      "Building responsive, interactive modern web interfaces with strong accessibility and cross-device performance.",
    skillIconsUrl: "https://skillicons.dev/icons?i=html,css,js,ts,react,nextjs,tailwind,bootstrap&perline=8",
    items: ["React", "Next.js", "Tailwind CSS", "Bootstrap", "TypeScript", "JavaScript", "HTML5", "CSS3"],
  },
  {
    id: "backend",
    badge: "SERVER",
    titleId: "Backend & Database Architecture",
    titleEn: "Backend & Database Architecture",
    descId:
      "Perancangan arsitektur server, RESTful API, manajemen autentikasi berjenjang (RBAC), serta pemodelan basis data relasional & NoSQL.",
    descEn:
      "Server architecture design, RESTful APIs, role-based access control (RBAC), and relational & NoSQL database modeling.",
    skillIconsUrl: "https://skillicons.dev/icons?i=php,laravel,nodejs,express,mysql,mongodb,postgres,java&perline=8",
    items: ["Laravel", "PHP", "Node.js", "Express.js", "MySQL", "MongoDB", "PostgreSQL / Supabase", "Java"],
  },
  {
    id: "mobile",
    badge: "CROSS-PLATFORM",
    titleId: "Mobile App Development",
    titleEn: "Mobile App Development",
    descId:
      "Pengembangan aplikasi perangkat bergerak lintas platform (Android & iOS) dengan performa native dan integrasi kamera/sensor real-time.",
    descEn:
      "Cross-platform mobile app development (Android & iOS) with smooth native performance and real-time camera/sensor integration.",
    skillIconsUrl: "https://skillicons.dev/icons?i=flutter,dart,androidstudio&perline=6",
    items: ["Flutter", "Dart", "Cross-Platform UI", "Mobile State Management", "Camera & Audio Integration"],
  },
  {
    id: "ai-cv",
    badge: "AI & CV",
    titleId: "Machine Learning, Deep Learning & Computer Vision",
    titleEn: "Machine Learning, Deep Learning & Computer Vision",
    descId:
      "Eksplorasi model kecerdasan buatan, pengolahan citra digital, deteksi objek real-time, pelacakan titik tangan, serta analisis data prediktif.",
    descEn:
      "Exploring AI models, digital image processing, real-time object detection, hand landmark tracking, and predictive data analysis.",
    skillIconsUrl: "https://skillicons.dev/icons?i=py,tensorflow,pytorch,sklearn,opencv&perline=6",
    items: ["Python", "TensorFlow", "PyTorch", "Scikit-Learn", "OpenCV", "MediaPipe Hand Landmarks"],
  },
  {
    id: "devops",
    badge: "WORKFLOW",
    titleId: "DevOps, Version Control & Design Tools",
    titleEn: "DevOps, Version Control & Design Tools",
    descId:
      "Manajemen repositori kode, kolaborasi tim pengembang, otomatisasi pengujian/deployment, dan perancangan prototipe antarmuka.",
    descEn:
      "Code repository management, engineering team collaboration, automated deployment workflows, and UI prototyping.",
    skillIconsUrl: "https://skillicons.dev/icons?i=git,github,vscode,figma&perline=6",
    items: ["Git", "GitHub CI/CD", "VS Code", "Figma", "Version Control"],
  },
];

export const PROJECTS: ProjectCaseStudy[] = [
  {
    id: "proj-01",
    indexCode: "01",
    slug: "hajicare",
    title: "HajiCare: Ekosistem Cerdas IoT Smartband & Edge AI Pendamping Jemaah Haji / Umrah",
    category: "IoT Wearable · Edge AI & Computer Vision · Mobile Accessibility",
    year: "2025 - 2026",
    clientOrContext: "Juara II Nasional OASE III PTKIN · Kementerian Agama RI",
    roleEn: "Lead AI, Mobile & IoT Engineer",
    roleId: "Lead AI, Mobile & IoT Engineer",
    featured: true,
    status: "published",
    summaryEn:
      "Integrated healthcare and navigation ecosystem for 2.5M+ Hajj/Umrah pilgrims combining custom ESP32-S3 IoT smartbands (GPS, heart rate, SpO2, body temperature, fall detection) with 100% offline Edge AI for real-time Saudi Riyal (SAR) currency recognition and bidirectional sign language translation.",
    summaryId:
      "Ekosistem terpadu pendamping jamaah Haji dan Umrah yang memadukan gelang pintar IoT ESP32-S3 (GPS, detak jantung, SpO2, suhu tubuh, deteksi jatuh) dengan Edge AI 100% offline untuk pengenalan uang Riyal (SAR) dan komunikasi bahasa isyarat dua arah.",
    recruiterExecSummaryEn:
      "Awarded 2nd National Winner at OASE III PTKIN (Ministry of Religious Affairs). Engineered BLE 5.0 wearable sensor telemetry, offline TFLite/YOLO mobile vision with instant Indonesian TTS readout, and dynamic geofencing safe zones for pilgrim safety in Mecca.",
    recruiterExecSummaryId:
      "Karya Juara II Nasional OASE III PTKIN Kementerian Agama RI. Mengembangkan telemetri wearable BLE 5.0, visi komputer mobile TFLite/YOLO offline dengan pembacaan suara nominal otomatis (TTS), dan geofencing radius aman jamaah di Makkah.",
    problemEn:
      "Over 2.5 million pilgrims face extreme desert heat (>45°C), high crowd density, and sudden health crises in Mecca and Medina. Elderly and deaf/speech-impaired Indonesian pilgrims frequently get separated from groups and struggle with currency identification and communication barriers.",
    problemId:
      "Lebih dari 2,5 juta jamaah menghadapi cuaca ekstrem (>45°C) dan kepadatan masif di Makkah dan Madinah. Jamaah lansia serta penyandang disabilitas rungu/wicara rentan tersesat, mengalami heatstroke, serta kesulitan mengenali pecahan uang Riyal dan berkomunikasi dengan petugas.",
    architectureEn:
      "Built four synchronized pillars: (1) ESP32-S3 BLE 5.0 smartband collecting GPS coordinates, MAX30102 vitals, and MPU6050 fall triggers, (2) 100% offline Edge AI running TFLite currency recognition with instant TTS and MediaPipe 21 hand-keypoint tracking for sign language, (3) Geospatial proximity radar and dynamic geofencing, and (4) One-touch emergency SOS dispatch.",
    architectureId:
      "Membangun 4 pilar solusi terintegrasi: (1) Gelang pintar ESP32-S3 BLE 5.0 dengan sensor GPS ATGM336H, MAX30102, dan MPU6050, (2) Edge AI 100% offline TFLite/YOLO pendeteksi Riyal (SAR) bersuara otomatis dan MediaPipe 21 sendi tangan, (3) Radar jarak geospasial dan safe-radius rombongan, serta (4) Tombol SOS darurat.",
    tradeoffs: [
      {
        decision: "Edge AI On-Device vs Cloud Inference",
        chosen: "100% On-Device TFLite / YOLO Mobile Models",
        alternative: "Cloud Vision & Speech API",
        rationaleEn:
          "Cellular networks collapse under dense Hajj crowds in Mina and Arafah. On-device inference guarantees zero latency and 100% availability even without internet connectivity.",
        rationaleId:
          "Sinyal seluler sering mengalami overload parah di Mina dan Arafah. Eksekusi model langsung di ponsel menjamin latensi rendah dan keandalan penuh tanpa bergantung pada kuota internet.",
      },
      {
        decision: "Wearable Connectivity Protocol",
        chosen: "Bluetooth Low Energy (BLE 5.0)",
        alternative: "Direct Cellular (4G/NB-IoT) Module",
        rationaleEn:
          "BLE 5.0 provides multi-day battery autonomy for the wearable device, offloading GPS packets and vitals to the companion phone without heavy thermal dissipation.",
        rationaleId:
          "BLE 5.0 menghemat konsumsi daya baterai gelang hingga berhari-hari, meneruskan data GPS dan vital ke ponsel tanpa menimbulkan panas di pergelangan tangan jamaah.",
      },
    ],
    metrics: [
      {
        labelEn: "National Award",
        labelId: "Penghargaan Nasional",
        value: "Juara II",
        delta: "OASE III PTKIN Kemenag RI",
      },
      {
        labelEn: "Offline AI Modules",
        labelId: "Modul AI Offline",
        value: "100%",
        delta: "Vision SAR + Isyarat 2 Arah",
      },
      {
        labelEn: "IoT Wearable Sensors",
        labelId: "Sensor IoT Gelang",
        value: "5 Sensor",
        delta: "GPS, SpO2, BPM, Temp, Fall",
      },
    ],
    stack: ["Flutter", "Dart", "Firebase", "TensorFlow Lite", "ESP32-S3", "MediaPipe", "YOLOv8", "BLE 5.0"],
    liveUrl: "https://github.com/riverry25/hajicare",
    repoUrl: "https://github.com/riverry25/hajicare",
    accentColor: "#2563EB",
    diagramSpec: {
      inputNode: "ESP32-S3 Smartband & Mobile Cam",
      edgeNode: "Offline TFLite & MediaPipe",
      coreNode: "Geofencing Radar & Health Telemetry",
      outputNode: "Audio TTS & Emergency SOS Dispatch",
      throughputLabel: "IoT 60Hz Telemetry · Zero Cloud Dependency",
    },
  },
  {
    id: "proj-02",
    indexCode: "02",
    slug: "sign2speech",
    title: "Sign2Speech: Sistem Komunikasi Dua Arah Aksesibilitas Universal (BISINDO & SIBI)",
    category: "Computer Vision · Deep Learning · Mobile Accessibility",
    year: "2025",
    clientOrContext: "Aplikasi Aksesibilitas Teman Tuli & Layanan Publik",
    roleEn: "AI & Flutter Clean Architecture Developer",
    roleId: "AI & Flutter Clean Architecture Developer",
    featured: true,
    status: "published",
    summaryEn:
      "Universal two-way accessibility system bridging communication between deaf individuals (BISINDO & SIBI signers) and hearing individuals in real time through 21-point 3D hand tracking, MotionGRU neural networks, and speech synthesis.",
    summaryId:
      "Sistem komunikasi dua arah aksesibilitas universal untuk menjembatani Teman Tuli (pengguna bahasa isyarat BISINDO & SIBI) dan Teman Dengar secara real-time melalui pelacakan 21 titik kerangka tangan, neural network MotionGRU, dan sintesis suara.",
    recruiterExecSummaryEn:
      "Architected 3-tier Clean Architecture Flutter application with GetX, combining 60fps MediaPipe landmark extraction, on-device TFLite sequence classification, and FIFO Indonesian speech synthesis queuing.",
    recruiterExecSummaryId:
      "Merancang aplikasi Flutter Clean Architecture 3-lapisan dengan GetX, memadukan ekstraksi landmark 60fps MediaPipe, klasifikasi sekuensial TFLite on-device, dan antrean sintesis suara FIFO bahasa Indonesia.",
    problemEn:
      "Deaf individuals in Indonesia frequently face communication barriers at public service counters, hospitals, and educational facilities due to a severe shortage of certified sign language interpreters.",
    problemId:
      "Teman Tuli di Indonesia kerap mengalami hambatan komunikasi di loket layanan publik, rumah sakit, dan lembaga pendidikan karena minimnya ketersediaan penerjemah bahasa isyarat profesional.",
    architectureEn:
      "Modular Clean Architecture: Presentation layer with 13 interactive screens and GetX controllers; Domain layer with LandmarkFrame, BisindoPrediction, and SignToken models; Data layer with TFLite MotionGRU classifier, FIFO TTS queue, and speech-to-text audio streams.",
    architectureId:
      "Arsitektur Clean Architecture modular: Presentation layer dengan 13 layar interaktif dan GetX controller; Domain layer dengan model LandmarkFrame dan BisindoPrediction; Data layer dengan classifier MotionGRU TFLite, antrean FIFO TTS, dan konversi suara ke teks.",
    tradeoffs: [
      {
        decision: "Hand Gesture Coordinate Tracking",
        chosen: "MediaPipe 21 3D Skeletal Landmarks",
        alternative: "Raw-Pixel 3D Convolutional Neural Network",
        rationaleEn:
          "Extracting 21 skeletal keypoints slashes frame data by 95%, allowing smooth 60fps inference on budget mobile hardware without overheating.",
        rationaleId:
          "Ekstraksi 21 titik koordinat kerangka memangkas ukuran data frame hingga 95%, memastikan inferensi 60fps yang responsif di ponsel tanpa menyebabkan suhu perangkat panas.",
      },
    ],
    metrics: [
      {
        labelEn: "Skeletal Keypoints",
        labelId: "Titik Kerangka Tangan",
        value: "21 Titik",
        delta: "3D MediaPipe Landmarks",
      },
      {
        labelEn: "Interactive Screens",
        labelId: "Layar Interaktif",
        value: "13 Layar",
        delta: "Clean Architecture & GetX",
      },
      {
        labelEn: "Inference Latency",
        labelId: "Latensi Inferensi",
        value: "<45ms",
        delta: "Real-Time On-Device TFLite",
      },
    ],
    stack: ["Flutter", "Dart", "GetX", "TensorFlow Lite", "MediaPipe", "Dio", "Speech-to-Text", "TTS"],
    liveUrl: "https://github.com/hafizhtzy/sign2speech",
    repoUrl: "https://github.com/hafizhtzy/sign2speech",
    accentColor: "#6366F1",
    diagramSpec: {
      inputNode: "Gesture Kamera / Suara Teman Dengar",
      edgeNode: "MediaPipe 21 Titik & Whisper STT",
      coreNode: "Model MotionGRU TFLite Classifier",
      outputNode: "TTS Bahasa Indonesia & Video Isyarat",
      throughputLabel: "Komunikasi Dua Arah Real-Time · Latensi Rendah",
    },
  },
  {
    id: "proj-03",
    indexCode: "03",
    slug: "project-warga-kominfo",
    title: "Project Warga: Sistem Informasi Administrasi Kependudukan Terpadu (Dinas Kominfo)",
    category: "GovTech · Relational Database & Web Architecture",
    year: "2025",
    clientOrContext: "Proyek Magang Resmi · Dinas Komunikasi dan Informatika",
    roleEn: "Web Developer Intern",
    roleId: "Web Developer Intern",
    featured: true,
    status: "published",
    summaryEn:
      "Municipal citizen information and census management platform built during official internship at Dinas Kominfo, digitizing resident demographic records across neighborhoods (RT/RW), automating official reports, and enforcing strict data governance.",
    summaryId:
      "Platform sistem informasi dan manajemen kependudukan terpadu yang dibangun selama magang resmi di Dinas Kominfo, mendigitalkan data demografi warga per RT/RW, mengotomasi rekapitulasi laporan resmi daerah, serta menerapkan tata kelola data yang aman.",
    recruiterExecSummaryEn:
      "Engineered Laravel 9 and MySQL platform with indexed queries, Yajra DataTables server-side pagination for large citizen datasets, interactive Chart.js analytics, and bulk Excel data synchronization.",
    recruiterExecSummaryId:
      "Mengembangkan aplikasi web Laravel 9 dan MySQL dengan query terindeks, pemrosesan server-side Yajra DataTables untuk puluhan ribu data kependudukan, dashboard analitik Chart.js, dan sinkronisasi ekspor/impor massal Excel.",
    problemEn:
      "Manual census recording across municipal wards led to duplicated family card (KK) entries, delayed citizen demographic reports, and slow NIK verification for public social assistance distributions.",
    problemId:
      "Pencatatan sensus konvensional di tingkat kelurahan kerap memicu duplikasi data Kartu Keluarga (KK), keterlambatan rekapitulasi data penduduk, serta lambatnya verifikasi NIK saat penyaluran program bantuan daerah.",
    architectureEn:
      "Normalized 3NF relational database structure connecting Warga, RT, RW, and Pekerjaan tables. Integrated Yajra DataTables for server-side search/filter, Maatwebsite Excel for automated bulk data import/export, and multi-tier role-based access control.",
    architectureId:
      "Struktur basis data relasional 3NF ternormalisasi yang menghubungkan tabel Warga, RT, RW, dan Pekerjaan. Mengintegrasikan Yajra DataTables untuk pencarian server-side instan, Maatwebsite Excel untuk ekspor/impor data sensus, dan kontrol akses RBAC multi-level.",
    tradeoffs: [
      {
        decision: "Server-Side DataTables vs Client-Side Pagination",
        chosen: "Yajra DataTables Server-Side Processing",
        alternative: "Client-Side DOM Table Rendering",
        rationaleEn:
          "Server-side processing prevents memory bottlenecks on client browsers when querying municipal databases containing tens of thousands of citizen records.",
        rationaleId:
          "Pemrosesan server-side mencegah lonjakan penggunaan memori di browser klien saat memuat basis data kependudukan skala puluhan ribu baris.",
      },
    ],
    metrics: [
      {
        labelEn: "Demographic Records",
        labelId: "Data Kependudukan",
        value: "100%",
        delta: "Digital RT/RW Census",
      },
      {
        labelEn: "Access Control Levels",
        labelId: "Tingkat Hak Akses",
        value: "3 Peran",
        delta: "Admin, Verifikator, Staf",
      },
      {
        labelEn: "Official Export Formats",
        labelId: "Format Ekspor Resmi",
        value: "Excel & PDF",
        delta: "Maatwebsite Data Pipeline",
      },
    ],
    stack: ["Laravel 9", "PHP 8", "MySQL", "Vite", "Bootstrap", "Yajra DataTables", "Chart.js", "Maatwebsite Excel"],
    liveUrl: "https://github.com/Tofu-TheGreat/project-warga",
    repoUrl: "https://github.com/Tofu-TheGreat/project-warga",
    accentColor: "#D97706",
    diagramSpec: {
      inputNode: "Pendataan Warga RT/RW & Berkas Sensus",
      edgeNode: "Validasi NIK/KK & Laravel Middleware",
      coreNode: "Engine Relasi MySQL & Yajra Server-Side",
      outputNode: "Dashboard Demografi Chart.js & Laporan Excel",
      throughputLabel: "Server-Side Indexing · Ekspor Massal Ribuan Data",
    },
  },
  {
    id: "proj-04",
    indexCode: "04",
    slug: "kopmas-aduan-susu",
    title: "Kopmas: Portal Pengaduan & Pengawasan Distribusi Susu Nasional Se-Indonesia (GovTech)",
    category: "GovTech · Public Health Advocacy & Civic Reporting",
    year: "2025",
    clientOrContext: "Proyek Freelance Pemerintah · Koalisi Perlindungan Kesehatan Masyarakat (KOPMAS)",
    roleEn: "Freelance Frontend Web Developer",
    roleId: "Freelance Frontend Web Developer",
    featured: true,
    status: "published",
    summaryEn:
      "Nationwide civic reporting platform built for KOPMAS (public health coalition & government advocacy partnership) to monitor sweetened condensed milk distribution and child nutrition compliance across Indonesia.",
    summaryId:
      "Portal pelaporan aduan masyarakat berskala nasional yang dibangun untuk KOPMAS (advokasi kesehatan dan kemitraan pemerintah) guna mengawasi peredaran kental manis dan pemenuhan nutrisi anak di seluruh Indonesia.",
    recruiterExecSummaryEn:
      "Engineered Next.js/React civic reporting frontend featuring interactive evidence image upload with client-side compression, geolocation tagging, public tracking ticket IDs, and official verification dashboards.",
    recruiterExecSummaryId:
      "Mengembangkan antarmuka frontend pelaporan publik Next.js/React dengan fitur unggah bukti foto berpenanda lokasi, generator nomor tiket aduan publik, dan dashboard audit verifikasi petugas pemerintah.",
    problemEn:
      "Widespread mislabeling and inappropriate promotion of sweetened condensed milk as breast milk substitutes caused child stunting across remote regions without a centralized digital complaint channel.",
    problemId:
      "Kekeliruan promosi dan konsumsi kental manis sebagai pengganti susu balita memicu kerawanan gizi buruk anak di berbagai daerah tanpa adanya sistem pelaporan terpadu yang mudah diakses warga.",
    architectureEn:
      "Component-driven Next.js and Tailwind architecture with client-side canvas image compression, geolocation reverse-geocoding, public tracking code lookup, and administrative report management.",
    architectureId:
      "Arsitektur frontend modular Next.js dan Tailwind CSS dengan kompresi foto di browser sebelum upload, penandaan titik koordinat temuan, pelacakan tiket aduan terbuka, dan dashboard validasi petugas.",
    tradeoffs: [
      {
        decision: "Evidence Upload Image Compression",
        chosen: "Client-Side In-Browser Canvas Compression",
        alternative: "Raw Multi-Megabyte Server Upload",
        rationaleEn:
          "Compressing photos on client devices slashes mobile upload bandwidth by 75%, allowing citizens in low-signal rural regions to submit complaints reliably.",
        rationaleId:
          "Kompresi foto langsung di browser memangkas beban kuota internet hingga 75%, memungkinkan masyarakat di pelosok dengan sinyal lemah mengirimkan bukti foto aduan secara lancar.",
      },
    ],
    metrics: [
      {
        labelEn: "Provincial Coverage",
        labelId: "Cakupan Wilayah",
        value: "34 Provinsi",
        delta: "Skala Nasional Se-Indonesia",
      },
      {
        labelEn: "Bandwidth Optimization",
        labelId: "Penghematan Bandwidth",
        value: "75%",
        delta: "Client-Side Evidence Compression",
      },
      {
        labelEn: "Report Transparency",
        labelId: "Transparansi Laporan",
        value: "100%",
        delta: "Sistem Tiket Pelacakan Terbuka",
      },
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "REST API", "Lucide Icons", "Civic Tech"],
    liveUrl: "https://github.com/alfianchii/aduan-susu-frontend",
    repoUrl: "https://github.com/alfianchii/aduan-susu-frontend",
    accentColor: "#059669",
    diagramSpec: {
      inputNode: "Laporan Aduan Warga & Foto Label Kemasan",
      edgeNode: "Kompresi Gambar Browser & Validasi Form",
      coreNode: "REST API Endpoint & Generator Tiket",
      outputNode: "Dashboard Audit Petugas & Cek Status Tiket",
      throughputLabel: "Pengaduan Nasional · Verifikasi Bukti Terpusat",
    },
  },
  {
    id: "proj-05",
    indexCode: "05",
    slug: "fintrack",
    title: "FinTrack: Asisten Keuangan Personal Pintar & Scanner Struk Berbasis Computer Vision",
    category: "Mobile App · Computer Vision & Financial Analytics",
    year: "2025",
    clientOrContext: "Personal Finance & Intelligent OCR Project",
    roleEn: "Mobile Developer & CV Integrator",
    roleId: "Mobile Developer & CV Integrator",
    featured: false,
    status: "published",
    summaryEn:
      "Intelligent personal financial tracker built with Flutter, GetX, and Firebase, featuring computer vision camera scanning (flutter_vision) for physical receipts, interactive FL Chart visualizations, and printable PDF statements.",
    summaryId:
      "Aplikasi pelacak keuangan pribadi cerdas berbasis Flutter, GetX, dan Firebase yang dilengkapi pemindai struk fisik otomatis via kamera ponsel (flutter_vision), grafik analitik interaktif FL Chart, dan generator laporan PDF siap cetak.",
    recruiterExecSummaryEn:
      "Implemented reactive GetX mobile architecture, camera OCR receipt scanning for automated transaction entry, Firebase multi-device data sync, and dynamic PDF financial statement generation.",
    recruiterExecSummaryId:
      "Mengembangkan arsitektur mobile GetX reaktif, OCR struk belanja via kamera ponsel untuk pencatatan otomatis, sinkronisasi cloud Firebase multi-device, dan generator dokumen laporan keuangan PDF.",
    problemEn:
      "Manual daily expense bookkeeping is tedious and error-prone, causing individuals to abandon budgeting routines and lose track of cumulative monthly spending.",
    problemId:
      "Pencatatan pengeluaran harian secara manual memakan waktu dan rentan salah hitung, sehingga banyak orang berhenti mencatat arus kas dan kehilangan kendali atas anggaran bulanan.",
    architectureEn:
      "Layered Flutter structure with GetX controllers, camera preview capturing receipt images fed into flutter_vision OCR pipelines, Firebase Firestore cloud persistence, and PDF printing services.",
    architectureId:
      "Struktur modular Flutter dengan controller GetX, stream kamera yang terhubung ke pipeline OCR flutter_vision, sinkronisasi awan Firebase Firestore, dan modul ekspor dokumen PDF.",
    tradeoffs: [
      {
        decision: "Receipt OCR Processing",
        chosen: "On-Device flutter_vision Pipeline",
        alternative: "External Third-Party Cloud Vision API",
        rationaleEn:
          "On-device OCR eliminates ongoing API costs and guarantees strict user privacy for sensitive financial purchases.",
        rationaleId:
          "OCR lokal pada perangkat menghilangkan ketergantungan biaya API cloud dan menjamin kerahasiaan data transaksi pribadi pengguna.",
      },
    ],
    metrics: [
      {
        labelEn: "Analytics Charts",
        labelId: "Visualisasi Grafik",
        value: "60 FPS",
        delta: "FL Chart Native Animations",
      },
      {
        labelEn: "Receipt Scanning",
        labelId: "Pemindaian Struk",
        value: "Otomatis",
        delta: "Kamera & Computer Vision OCR",
      },
      {
        labelEn: "Document Export",
        labelId: "Ekspor Dokumen",
        value: "PDF Ready",
        delta: "Format Cetak Laporan Resmi",
      },
    ],
    stack: ["Flutter", "Dart", "GetX", "flutter_vision", "Firebase Auth & Firestore", "FL Chart", "PDF & Printing"],
    liveUrl: "https://github.com/fadli154/FinTrack",
    repoUrl: "https://github.com/fadli154/FinTrack",
    accentColor: "#0891B2",
    diagramSpec: {
      inputNode: "Kamera Struk Belanja & Input Pengeluaran",
      edgeNode: "flutter_vision OCR & Parser Total",
      coreNode: "GetX Controller & Firebase Cloud Firestore",
      outputNode: "Grafik Arus Kas FL Chart & Berkas PDF",
      throughputLabel: "Pencatatan Cepat · Visualisasi Finansial 60 FPS",
    },
  },
  {
    id: "proj-06",
    indexCode: "06",
    slug: "dispress",
    title: "Dispress: Sistem Manajemen Disposisi Surat Dinas & SPPD Elektronik",
    category: "Enterprise Web App · Workflow Automation",
    year: "2024 - 2025",
    clientOrContext: "Aplikasi Efisiensi Birokrasi & Administrasi Perjalanan Dinas",
    roleEn: "Full-Stack Web Developer",
    roleId: "Full-Stack Web Developer",
    featured: false,
    status: "published",
    summaryEn:
      "Administrative correspondence workflow automation system facilitating official letter disposition tracking and electronic travel warrant (SPPD) generation across organizational tiers.",
    summaryId:
      "Sistem otomasi alur persuratan dinas untuk mempermudah pelacakan disposisi surat masuk/keluar dan pembuatan Surat Perintah Perjalanan Dinas (SPPD) elektronik yang praktis dan terstandarisasi.",
    recruiterExecSummaryEn:
      "Developed with Laravel, Vite, and Stisla UI, implementing multi-user governance (Admin, Officer, Staff) with timeline audits and printable official disposition sheets.",
    recruiterExecSummaryId:
      "Dikembangkan dengan Laravel, Vite, dan Stisla UI, mengimplementasikan tata kelola multi-user (Admin, Officer, Staff) dengan linimasa disposisi dan format cetak lembar SPPD resmi.",
    problemEn:
      "Physical paper letter dispositions frequently get lost in transit, lack timestamped audit trails, and slow down crucial approvals for official duty travels.",
    problemId:
      "Disposisi surat secara fisik sering kali terselip, tidak memiliki riwayat audit waktu serah terima yang jelas, dan memperlambat persetujuan perjalanan dinas resmi.",
    architectureEn:
      "Role-based multi-user workflow separating incoming letter verification (Officer), disposition command delegation (Admin), and staff action execution with automated document printing templates.",
    architectureId:
      "Alur multi-user berbasis peran memisahkan verifikasi surat masuk (Officer), perintah delegasi disposisi (Admin), dan tindak lanjut staf dengan templat cetak dokumen dinas resmi.",
    tradeoffs: [
      {
        decision: "Role-Based Multi-Tier Workflow",
        chosen: "Granular Role Scoping (Admin, Officer, Staff)",
        alternative: "Single Shared Mailbox View",
        rationaleEn:
          "Granular role scoping matches established public administrative SOPs and prevents unauthorized document status modifications.",
        rationaleId:
          "Pemisahan peran yang tegas selaras dengan SOP birokrasi pemerintahan dan mencegah perubahan status dokumen oleh pihak yang tidak berwenang.",
      },
    ],
    metrics: [
      {
        labelEn: "Governance Roles",
        labelId: "Peran Pengguna",
        value: "3 Peran",
        delta: "Admin, Officer, Staff",
      },
      {
        labelEn: "Tracking Audit",
        labelId: "Audit Disposisi",
        value: "100%",
        delta: "Linimasa Waktu & Riwayat Aksi",
      },
      {
        labelEn: "Standardized Printouts",
        labelId: "Format Dokumen",
        value: "SPPD Otomatis",
        delta: "Format Cetak Standar Kedinasan",
      },
    ],
    stack: ["Laravel", "PHP", "MySQL", "Vite", "Stisla Bootstrap", "SweetAlert2", "Axios"],
    liveUrl: "https://github.com/Tofu-TheGreat/dispress",
    repoUrl: "https://github.com/Tofu-TheGreat/dispress",
    accentColor: "#475569",
    diagramSpec: {
      inputNode: "Pendaftaran Surat Masuk & Lampiran Berkas",
      edgeNode: "Verifikasi Petugas & Alur Delegasi",
      coreNode: "State Machine Disposisi & MySQL Ledger",
      outputNode: "Lembar Disposisi & Dokumen SPPD Siap Cetak",
      throughputLabel: "Otomasi Persuratan Dinas · Pelacakan Terpusat",
    },
  },
  {
    id: "proj-07",
    indexCode: "07",
    slug: "travelease",
    title: "TravelEase: Panduan Wisata Cerdas & Perencana Itinerari Nusantara",
    category: "Mobile App · Geolocation & Cloud Database",
    year: "2025",
    clientOrContext: "Aplikasi Pariwisata Modern Berbasis Cloud",
    roleEn: "Flutter & Firebase Developer",
    roleId: "Flutter & Firebase Developer",
    featured: false,
    status: "published",
    summaryEn:
      "Modern Indonesian tourism exploration mobile app built with Flutter and Firebase, featuring interactive Google Maps navigation, comprehensive destination profiles, traveler reviews, and cloud-synced wishlists.",
    summaryId:
      "Aplikasi mobile panduan wisata nusantara berbasis Flutter dan Firebase yang memadukan eksplorasi peta interaktif Google Maps, informasi lengkap objek wisata, ulasan pengunjung, serta penyimpanan destinasi favorit tersinkronisasi awan.",
    recruiterExecSummaryEn:
      "Architected Flutter Material 3 application with Provider state management, Google Maps Flutter SDK, and Firebase backend (Auth, Firestore, Storage) with dual-role user/admin capabilities.",
    recruiterExecSummaryId:
      "Merancang aplikasi Flutter Material 3 dengan Provider state management, Google Maps SDK, dan backend Firebase (Auth, Firestore, Storage) dengan kontrol dua peran pengguna (User & Admin).",
    problemEn:
      "Travelers often struggle to find reliable information regarding entrance ticket pricing, operational hours, and precise geolocation pins for regional Indonesian tourist sites.",
    problemId:
      "Wisatawan kerap kesulitan menemukan info akurat mengenai tiket masuk, jam operasional terkini, dan titik koordinat objek wisata daerah di Indonesia.",
    architectureEn:
      "Clean Flutter structure connecting Google Maps marker streams to Firestore collections, featuring image caching, user review aggregators, and an admin destination management portal.",
    architectureId:
      "Struktur Flutter modular yang menghubungkan penanda peta Google Maps dengan koleksi Firestore, dilengkapi caching gambar, kalkulasi rating ulasan, dan portal kelola destinasi admin.",
    tradeoffs: [
      {
        decision: "Mapping Engine",
        chosen: "Native Google Maps Flutter SDK",
        alternative: "Embedded WebView Map",
        rationaleEn:
          "Native mapping guarantees buttery 60fps pinch-to-zoom navigation and low memory consumption on budget Android devices.",
        rationaleId:
          "SDK peta native menjamin interaksi zoom dan geser peta yang mulus 60fps serta penggunaan memori yang jauh lebih efisien dibanding WebView.",
      },
    ],
    metrics: [
      {
        labelEn: "Map Navigation",
        labelId: "Navigasi Peta",
        value: "Google Maps",
        delta: "Native SDK & Interactive Pins",
      },
      {
        labelEn: "Access System",
        labelId: "Sistem Pengguna",
        value: "Dual Role",
        delta: "Wisatawan & Admin Pengelola",
      },
      {
        labelEn: "Cloud Sync",
        labelId: "Sinkronisasi Awan",
        value: "Real-Time",
        delta: "Firebase Firestore & Storage",
      },
    ],
    stack: ["Flutter", "Dart", "Material 3", "Provider", "Google Maps Flutter", "Firebase Auth", "Cloud Firestore"],
    liveUrl: "https://github.com/fadli154/travelease",
    repoUrl: "https://github.com/fadli154/travelease",
    accentColor: "#7C3AED",
    diagramSpec: {
      inputNode: "GPS Lokasi & Pencarian Destinasi",
      edgeNode: "Google Maps Flutter SDK & Provider",
      coreNode: "Cloud Firestore & Review Aggregator",
      outputNode: "Katalog Wisata Interaktif & Rute Perjalanan",
      throughputLabel: "Eksplorasi Peta Interaktif · Ulasan Real-Time",
    },
  },
  {
    id: "proj-08",
    indexCode: "08",
    slug: "project-spp",
    title: "E-SPP: Sistem Informasi Manajemen Pembayaran SPP Sekolah Terpadu & Paperless",
    category: "EduTech · Administrative Web Application",
    year: "2024",
    clientOrContext: "Digitalisasi Finansial Sekolah & Go-Green Initiative",
    roleEn: "Full-Stack Web Developer",
    roleId: "Full-Stack Web Developer",
    featured: false,
    status: "published",
    summaryEn:
      "Web-based school tuition fee (SPP) payment system replacing paper receipts with digital transaction logs, debt monitoring, and automated official receipt generation.",
    summaryId:
      "Sistem informasi manajemen pembayaran SPP sekolah berbasis web yang menggantikan pencatatan buku kas konvensional dengan transaksi digital, monitoring tunggakan, dan kuitansi otomatis.",
    recruiterExecSummaryEn:
      "Engineered with Laravel and MySQL, implementing role-based access for Administrators, Finance Officers, and Students, eliminating manual tallying errors and supporting paperless operations.",
    recruiterExecSummaryId:
      "Dikembangkan menggunakan Laravel dan MySQL dengan kontrol akses untuk Administrator, Petugas Keuangan, dan Siswa/Wali, meminimalisir kesalahan pembukuan manual dan ramah lingkungan.",
    problemEn:
      "Manual paper ledgers in schools led to lost transaction records, cumbersome debt reconciliation, and unnecessary paper waste.",
    problemId:
      "Pencatatan kartu SPP fisik di sekolah sering kali hilang, memakan waktu lama saat rekonsiliasi tunggakan siswa, dan menimbulkan pemborosan kertas.",
    architectureEn:
      "Relational student-tuition financial ledger with automated debt balance calculations, receipt generation, and periodic audit exports.",
    architectureId:
      "Buku kas relasional siswa-SPP dengan kalkulasi saldo tunggakan otomatis, pencetakan kuitansi resmi, dan ekspor laporan keuangan periodik.",
    tradeoffs: [
      {
        decision: "Role Isolation",
        chosen: "Three-Tier Role Governance (Admin, Petugas, Siswa)",
        alternative: "Shared Administrative View",
        rationaleEn:
          "Ensures students only view their own payment histories while finance officers can record incoming payments safely.",
        rationaleId:
          "Memastikan siswa hanya dapat melihat riwayat pembayaran miliknya secara transparan, sementara petugas fokus pada pencatatan transaksi.",
      },
    ],
    metrics: [
      {
        labelEn: "Paper Reduction",
        labelId: "Efisiensi Kertas",
        value: "100%",
        delta: "Paperless Digital Invoicing",
      },
      {
        labelEn: "User Access Tiers",
        labelId: "Tingkat Akses",
        value: "3 Peran",
        delta: "Admin, Petugas, Siswa",
      },
      {
        labelEn: "Receipt Automation",
        labelId: "Kuitansi Pembayaran",
        value: "Instan",
        delta: "Cetak Bukti Transaksi Digital",
      },
    ],
    stack: ["Laravel", "PHP", "MySQL", "Laravel-Mix", "Axios", "SweetAlert2", "Bootstrap"],
    liveUrl: "https://github.com/fadli154/Project-Spp",
    repoUrl: "https://github.com/fadli154/Project-Spp",
    accentColor: "#E11D48",
    diagramSpec: {
      inputNode: "Input Transaksi Pembayaran SPP Siswa",
      edgeNode: "Validasi Tagihan & Laravel Controller",
      coreNode: "Relasi Basis Data MySQL & Buku Kas",
      outputNode: "Kuitansi Digital & Rekap Keuangan Sekolah",
      throughputLabel: "Pencatatan Finansial Sekolah · Tanpa Kertas",
    },
  },
  {
    id: "proj-09",
    indexCode: "09",
    slug: "wedding-invitation",
    title: "Platform Undangan Pernikahan Digital Interaktif & Realtime RSVP",
    category: "Interactive Web · Realtime Cloud & Media Streaming",
    year: "2025",
    clientOrContext: "Next.js Interactive Digital Invitation Project",
    roleEn: "Frontend & Full-Stack Developer",
    roleId: "Frontend & Full-Stack Developer",
    featured: false,
    status: "published",
    summaryEn:
      "Modern interactive digital wedding invitation engineered with Next.js 15, featuring personalized guest links, background audio controls, countdown timers, Google Calendar integration, and real-time RSVP with guestbook greetings.",
    summaryId:
      "Platform undangan pernikahan digital modern berbasis Next.js 15 dengan fitur personalisasi nama tamu dinamis, kontrol musik latar terpadu, hitung mundur hari-H, integrasi Google Calendar, serta RSVP dan buku doa tamu real-time.",
    recruiterExecSummaryEn:
      "Built on Next.js 15 App Router and Tailwind CSS, integrating Radix UI primitives, Firebase Firestore realtime snapshot listeners, and digital gift registry (QRIS & clipboard copy).",
    recruiterExecSummaryId:
      "Dibangun menggunakan Next.js 15 App Router dan Tailwind CSS, memadukan komponen Radix UI, sinkronisasi real-time Firebase Firestore untuk ucapan tamu, dan fitur amplop digital (QRIS & salin rekening).",
    problemEn:
      "Physical printed wedding invitations are costly, lack interactive multimedia, cannot handle instant attendance confirmation (RSVP), and do not allow personalized digital greetings.",
    problemId:
      "Undangan cetak fisik memakan biaya tinggi, kaku tanpa elemen multimedia, tidak dapat melacak kepastian kehadiran tamu (RSVP) secara instan, dan minim interaktivitas.",
    architectureEn:
      "Next.js 15 client architecture with URL parameter parsing for personalized greetings, background audio state management, and Firebase Firestore realtime collection listeners.",
    architectureId:
      "Arsitektur Next.js 15 dengan pembacaan URL parameter untuk sapaan tamu khusus, kontrol audio latar terpadu, dan listener realtime Firebase Firestore untuk daftar ucapan dan doa.",
    tradeoffs: [
      {
        decision: "Audio Autoplay Handling",
        chosen: "Respectful User-Gesture Audio Unlock",
        alternative: "Aggressive Forced Audio Autoplay",
        rationaleEn:
          "Adheres to browser media autoplay policies by gracefully providing interactive sound toggle controls for visitors.",
        rationaleId:
          "Mematuhi kebijakan autoplay browser modern dengan memberikan kendali musik yang intuitif dan elegan kepada pengunjung.",
      },
    ],
    metrics: [
      {
        labelEn: "Real-Time Sync",
        labelId: "Sinkronisasi Realtime",
        value: "Instant",
        delta: "Firebase Firestore Guestbook",
      },
      {
        labelEn: "Calendar Sync",
        labelId: "Sinkronisasi Kalender",
        value: "1-Klik",
        delta: "Google Calendar Event Integration",
      },
      {
        labelEn: "Framework",
        labelId: "Fondasi Frontend",
        value: "Next.js 15",
        delta: "App Router & Radix UI Primitives",
      },
    ],
    stack: ["Next.js 15", "TypeScript", "Tailwind CSS", "Radix UI", "Firebase Firestore", "Lucide Icons"],
    liveUrl: "https://github.com/fadli154/ngunduh-mantu",
    repoUrl: "https://github.com/fadli154/ngunduh-mantu",
    accentColor: "#DB2777",
    diagramSpec: {
      inputNode: "URL Parameter Tamu (?to=) & Form RSVP",
      edgeNode: "Audio Manager & Form Validation",
      coreNode: "Firebase Firestore Realtime Listener",
      outputNode: "Buku Tamu Interaktif & Amplop QRIS",
      throughputLabel: "Interaksi Real-Time · Personalisasi Dinamis",
    },
  },
  {
    id: "proj-10",
    indexCode: "10",
    slug: "smart-hajj-vision-ai",
    title: "Smart Hajj: Vision AI & Mobile Accessibility (Alias)",
    category: "AI & Computer Vision · Mobile Accessibility",
    year: "2025 - 2026",
    clientOrContext: "Inovasi AI Unggulan · Bagian dari Ekosistem HajiCare",
    roleEn: "AI & Computer Vision Engineer",
    roleId: "Insinyur AI & Computer Vision",
    featured: false,
    status: "published",
    summaryEn:
      "Mobile Computer Vision and speech accessibility subsystem of HajiCare, powering real-time Saudi Riyal banknote detection and bidirectional Indonesian sign language translation.",
    summaryId:
      "Subsistem Computer Vision dan aksesibilitas wicara mobile dari HajiCare, memberdayakan deteksi pecahan uang Riyal SAR dan penerjemah bahasa isyarat dua arah.",
    recruiterExecSummaryEn:
      "Integrated MediaPipe 21 hand-landmark tracking and on-device TFLite sequence classification with instant spoken nominal feedback.",
    recruiterExecSummaryId:
      "Mengintegrasikan pelacakan 21 sendi tangan MediaPipe dan klasifikasi sekuensial TFLite on-device dengan keluaran suara nominal instan.",
    problemEn:
      "Deaf and elderly Hajj pilgrims struggle with currency identification and communication with officers in Mecca.",
    problemId:
      "Jamaah haji disabilitas rungu dan lansia kerap mengalami hambatan mengenali mata uang dan berkomunikasi dengan petugas.",
    architectureEn:
      "Modular vision pipeline combining camera frames, MediaPipe landmarks, TFLite inference, and FIFO speech synthesis.",
    architectureId:
      "Pipeline visi modular memadukan frame kamera, landmark MediaPipe, inferensi TFLite, dan sintesis suara FIFO.",
    tradeoffs: [
      {
        decision: "On-Device Inference",
        chosen: "Lightweight TFLite Model",
        alternative: "Cloud API",
        rationaleEn: "Guarantees offline reliability in crowded areas.",
        rationaleId: "Menjamin keandalan penuh tanpa bergantung pada internet.",
      },
    ],
    metrics: [
      {
        labelEn: "Hand Keypoints",
        labelId: "Titik Tangan",
        value: "21 Titik",
        delta: "MediaPipe Tracking",
      },
      {
        labelEn: "Audio Feedback",
        labelId: "Umpan Balik Suara",
        value: "TTS Instan",
        delta: "Nominal Riyal Otomatis",
      },
    ],
    stack: ["Python", "OpenCV", "MediaPipe", "Flutter", "TensorFlow Lite"],
    liveUrl: "https://github.com/riverry25/hajicare",
    repoUrl: "https://github.com/riverry25/hajicare",
    accentColor: "#2563EB",
    diagramSpec: {
      inputNode: "Kamera Ponsel / Suara",
      edgeNode: "OpenCV & MediaPipe",
      coreNode: "Klasifikasi SAR & Isyarat",
      outputNode: "Audio TTS & Visual Isyarat",
      throughputLabel: "Deteksi Riyal Real-Time · Komunikasi Inklusif 2 Arah",
    },
  },
];

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: "exp-01",
    indexCode: "01",
    company: "Dinas Komunikasi dan Informatika (Kominfo)",
    roleEn: "Web Developer Intern",
    roleId: "Web Developer Intern",
    employmentType: "MAGANG RESMI",
    location: "Indonesia",
    period: "2025",
    isCurrent: false,
    metricsBadge: "Project Warga · Laravel 9 & MySQL",
    summaryEn:
      "Contributed directly to municipal public administration digitization during official internship at Dinas Kominfo, designing and building the municipal citizen information system (Project Warga) with Laravel 9, MySQL, Yajra DataTables, and Maatwebsite Excel.",
    summaryId:
      "Berkontribusi langsung dalam digitalisasi administrasi publik selama magang resmi di Dinas Kominfo, merancang dan mengembangkan sistem informasi kependudukan (Project Warga) berbasis Laravel 9, MySQL, Yajra DataTables, dan Maatwebsite Excel.",
    highlightsEn: [
      "Citizen Data Architecture: Designed relational models, NIK/KK family card validation, and neighborhood division filters across RT and RW.",
      "Server-Side Data Processing: Implemented Yajra DataTables server-side indexing and Maatwebsite Excel bulk imports/exports for fast demographic reporting.",
      "Role-Based Governance (RBAC): Built multi-level authentication separating sub-district administrators, verifiers, and neighborhood staff.",
    ],
    highlightsId: [
      "Arsitektur Data Kependudukan: Merancang relasi basis data warga, validasi NIK/KK, serta pemisahan wilayah demografis per RT dan RW.",
      "Pemrosesan Server-Side & Rekapitulasi: Mengimplementasikan Yajra DataTables dan ekspor/impor massal Excel (Maatwebsite) untuk pelaporan sensus cepat.",
      "Keamanan & Hak Akses (RBAC): Membangun otentikasi bertingkat untuk staf kelurahan, verifikator, dan administrator sistem.",
    ],
    stack: ["Laravel 9", "PHP 8", "MySQL", "Bootstrap", "Vite", "Yajra DataTables", "Chart.js", "REST API"],
  },
  {
    id: "exp-02",
    indexCode: "02",
    company: "KOPMAS (Koalisi Perlindungan Kesehatan Masyarakat / Pemerintah RI)",
    roleEn: "Freelance Frontend Web Developer (GovTech)",
    roleId: "Freelance Frontend Web Developer (GovTech)",
    employmentType: "PROYEK PEMERINTAH (FREELANCE)",
    location: "Indonesia",
    period: "2025",
    isCurrent: false,
    metricsBadge: "Kopmas GovTech · Next.js & Civic Reporting",
    summaryEn:
      "Delivered the national sweetened condensed milk and child nutrition complaint reporting web platform (Kopmas) for government-partnered health advocacy, empowering citizens across 34 provinces to report non-compliant milk distribution.",
    summaryId:
      "Mengembangkan portal pelaporan pengaduan susu kental manis dan pemantauan gizi anak skala nasional (Kopmas) untuk advokasi kesehatan kemitraan pemerintah, memfasilitasi pelaporan masyarakat dari 34 provinsi.",
    highlightsEn: [
      "Civic Complaint System: Built validated multi-step citizen reporting form with photo label upload, geocoding location tags, and public ticket lookup.",
      "Client-Side Image Optimization: Integrated in-browser image compression to enable smooth evidence submission even on low-bandwidth rural connections.",
      "Administrative Verification Portal: Designed government audit interface to verify incoming reports, track investigation progress, and visualize national distribution.",
    ],
    highlightsId: [
      "Sistem Pengaduan Publik: Membangun formulir aduan multi-tahap dengan unggah bukti foto label kemasan, penandaan geolokasi, dan pelacakan tiket laporan.",
      "Optimasi Bukti Gambar di Browser: Menerapkan kompresi gambar client-side agar pengunggahan foto bukti tetap lancar di area jaringan terbatas.",
      "Portal Verifikasi Petugas: Merancang antarmuka verifikasi untuk meninjau laporan masuk, memperbarui status penanganan, dan memetakan sebaran aduan nasional.",
    ],
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "REST API", "Lucide Icons", "GovTech"],
  },
  {
    id: "exp-03",
    indexCode: "03",
    company: "Kementerian Agama Republik Indonesia (Kemenag RI)",
    roleEn: "Lead AI, Mobile & IoT Developer (OASE III PTKIN)",
    roleId: "Lead AI, Mobile & IoT Developer (OASE III PTKIN)",
    employmentType: "PRESTASI & RISET INOVASI",
    location: "Indonesia",
    period: "2024 - 2025",
    isCurrent: false,
    metricsBadge: "Juara II Nasional · OASE III PTKIN",
    summaryEn:
      "Won 2nd Place Nationally (Juara II Nasional) at OASE III PTKIN for Literacy and Technology Innovation with HajiCare, integrating ESP32-S3 BLE IoT Smartbands and 100% offline Edge AI for Hajj pilgrim accessibility.",
    summaryId:
      "Meraih Juara II Nasional pada ajang OASE III PTKIN se-Indonesia bidang Literasi dan Inovasi Teknologi melalui karya HajiCare, menggabungkan gelang pintar IoT ESP32-S3 dan Edge AI offline untuk aksesibilitas jemaah haji.",
    highlightsEn: [
      "IoT Smartband Engineering: Integrated ESP32-S3 BLE 5.0 microcontroller with MAX30102 vitals, MLX90614 body temp, ATGM336H GPS, and MPU6050 fall detection.",
      "Offline Edge AI Currency Detector: Implemented on-device TFLite model to identify Saudi Riyal (SAR) banknotes with instant audio speech verification (TTS).",
      "Bidirectional Sign Language Translator: Built MediaPipe 21 hand-landmark tracking and MotionGRU deep learning for real-time sign language conversion.",
    ],
    highlightsId: [
      "Rekayasa Gelang Pintar IoT: Mengintegrasikan mikrokontroler ESP32-S3 BLE 5.0 dengan sensor detak jantung/SpO2 MAX30102, suhu MLX90614, GPS, dan deteksi jatuh.",
      "Deteksi Mata Uang SAR On-Device: Mengimplementasikan model TFLite offline untuk mengenali pecahan uang Riyal Arab Saudi dengan keluaran suara TTS otomatis.",
      "Penerjemah Bahasa Isyarat 2 Arah: Mengembangkan pelacakan 21 titik tangan MediaPipe dan deep learning MotionGRU untuk konversi isyarat real-time.",
    ],
    stack: ["Flutter", "Dart", "Firebase", "ESP32-S3", "TensorFlow Lite", "MediaPipe", "YOLOv8", "BLE 5.0"],
  },
];

export const EDUCATIONS: EducationItem[] = [
  {
    id: "edu-01",
    institution: "Program Studi Informatika · Kelompok K-1",
    degreeEn: "Undergraduate Student in Informatics (Computer Science)",
    degreeId: "Mahasiswa Sarjana Informatika (Ilmu Komputer)",
    period: "Aktif · Kelompok K-1",
    location: "Indonesia",
    gpaOrHonors: "Fokus: Web & Mobile Engineering, GovTech, Computer Vision & Kewirausahaan",
    focusEn:
      "Documenting academic coursework, software engineering projects, computer vision research (Smart Hajj AI), public-sector web applications (SIMDUK Kominfo), and Technology Entrepreneurship (Group K-1).",
    focusId:
      "Mendokumentasikan karya akademik perkuliahan, proyek rekayasa perangkat lunak, riset visi komputer (Smart Hajj AI), aplikasi web sektor publik (SIMDUK Kominfo), serta mata kuliah Kewirausahaan Teknologi (Kelompok K-1).",
  },
];

/**
 * Local fallback used when Supabase is unreachable or empty.
 * Keep in sync with the seed rows in 20261110000006_certificates_drift_wall.sql.
 */
export const CERTIFICATES: CertificateItem[] = [
  {
    id: "6f1d2c3a-0001-4a5b-9c01-0e0f00000001",
    title: "Juara II Literasi Inovasi Teknologi · OASE III PTKIN 2026",
    issuer: "Kementerian Agama Republik Indonesia",
    issueDate: "7 November 2026",
    credentialId: "712/Dt.I.III/PP.01/11/2026",
    category: "Kompetisi",
    imageUrl: "/sertif/oase-juara-2-lit.webp",
    fileUrl: "/sertif/oase-juara-2-lit.pdf",
    verifyUrl: null,
    summaryId:
      "Juara II cabang Literasi Inovasi Teknologi pada Olimpiade Agama, Sains, dan Riset (OASE) III PTKIN se-Indonesia, UIN Sunan Kalijaga Yogyakarta, 3–7 November 2026. Mewakili UIN Sultan Maulana Hasanuddin Banten.",
    summaryEn:
      "Second place, Technology Innovation Literacy, at the 3rd Olympiad of Religion, Science and Research (OASE) for Indonesian Islamic universities, UIN Sunan Kalijaga Yogyakarta, 3–7 November 2026.",
    sortOrder: 1,
    isVisible: true,
  },
  {
    id: "6f1d2c3a-0002-4a5b-9c01-0e0f00000002",
    title: "Peserta Lomba Nasional Website UMKM · IT's Day 2025",
    issuer: "Jakarta Global University",
    issueDate: "5 Juli 2025",
    credentialId: "",
    category: "Kompetisi",
    imageUrl: "/sertif/itsday-2025-lomba-website-umkm.webp",
    fileUrl: "/sertif/itsday-2025-lomba-website-umkm.jpg",
    verifyUrl: null,
    summaryId:
      "Sertifikat penghargaan atas partisipasi dalam Lomba Nasional Website UMKM pada acara IT's Day 2025, Fakultas Teknik dan Ilmu Komputer, Jakarta Global University, Depok.",
    summaryEn:
      "Certificate of participation in the National UMKM Website Competition at IT's Day 2025, Faculty of Engineering and Computer Science, Jakarta Global University, Depok.",
    sortOrder: 2,
    isVisible: true,
  },
];

export const TECHNOLOGIES: TechnologyItem[] = [
  {
    name: "Laravel & PHP",
    slug: "laravel-php",
    category: "Backend & Database",
    proficiency: "Core Architecture",
    years: "Production",
    noteEn: "SIMDUK Kominfo, RBAC authentication, MVC architecture, REST APIs",
    noteId: "SIMDUK Kominfo, autentikasi RBAC, arsitektur MVC, REST API",
  },
  {
    name: "React & Next.js",
    slug: "react-nextjs",
    category: "Frontend & Creative",
    proficiency: "Core Architecture",
    years: "Production",
    noteEn: "Modern web applications, App Router, responsive dashboards",
    noteId: "Aplikasi web modern, App Router, dasbor interaktif responsif",
  },
  {
    name: "TypeScript & JavaScript",
    slug: "ts-js",
    category: "Frontend & Creative",
    proficiency: "Core Architecture",
    years: "Production",
    noteEn: "Type-safe frontend & backend logic, interactive DOM & Web Speech API",
    noteId: "Logika frontend & backend type-safe, DOM interaktif & Web Speech API",
  },
  {
    name: "Tailwind CSS & Bootstrap",
    slug: "tailwind-bootstrap",
    category: "Frontend & Creative",
    proficiency: "Core Architecture",
    years: "Production",
    noteEn: "Clean design systems, responsive mobile-first layouts",
    noteId: "Sistem desain bersih, tata letak responsif mobile-first",
  },
  {
    name: "MySQL, PostgreSQL & MongoDB",
    slug: "databases",
    category: "Backend & Database",
    proficiency: "Core Architecture",
    years: "Production",
    noteEn: "Relational census schemas, Supabase RLS, query optimization",
    noteId: "Skema relasional kependudukan, Supabase RLS, optimasi kueri",
  },
  {
    name: "Node.js & Express.js",
    slug: "nodejs-express",
    category: "Backend & Database",
    proficiency: "Production",
    years: "Active",
    noteEn: "RESTful backend services, API integration, JSON pipelines",
    noteId: "Layanan backend RESTful, integrasi API, pipeline data JSON",
  },
  {
    name: "Flutter & Dart",
    slug: "flutter-dart",
    category: "Mobile & Cross-Platform",
    proficiency: "Production",
    years: "Active",
    noteEn: "Cross-platform Android/iOS UI, mobile state management, Smart Hajj app",
    noteId: "UI lintas platform Android/iOS, state management, aplikasi Smart Hajj",
  },
  {
    name: "Python, OpenCV & MediaPipe",
    slug: "python-cv",
    category: "AI & Agentic Systems",
    proficiency: "Core Architecture",
    years: "Research & App",
    noteEn: "Riyal banknote detection, 21 hand-landmark sign language tracking",
    noteId: "Deteksi uang kertas Riyal (SAR), pelacakan 21 titik tangan bahasa isyarat",
  },
  {
    name: "TensorFlow, PyTorch & Scikit-Learn",
    slug: "dl-ml",
    category: "AI & Agentic Systems",
    proficiency: "Production",
    years: "Research & App",
    noteEn: "Deep learning image classification, gesture recognition, data analysis",
    noteId: "Klasifikasi citra deep learning, pengenalan gestur, analisis data",
  },
  {
    name: "Git, GitHub CI/CD & Figma",
    slug: "git-figma",
    category: "DevOps & Cloud",
    proficiency: "Production",
    years: "Daily Workflow",
    noteEn: "Version control (@fadli154), collaborative workflow, UI/UX prototyping",
    noteId: "Version control (@fadli154), kolaborasi tim, prototipe UI/UX",
  },
];

export const SWOT_STRENGTHS: SwotPoint[] = [
  {
    code: "S1",
    titleId: "Rasa Ingin Tahu",
    titleEn: "Curiosity",
    descId: "Tertarik mempelajari cara kerja teknologi baru secara mendalam.",
    descEn: "Deeply interested in understanding how new technologies work under the hood.",
  },
  {
    code: "S2",
    titleId: "Kemauan Belajar",
    titleEn: "Willingness to Learn",
    descId: "Terbuka terhadap materi dan konsep baru di dunia pemrograman.",
    descEn: "Always open to new materials, paradigms, and concepts in software development.",
  },
  {
    code: "S3",
    titleId: "Pola Pikir Pemecahan Masalah",
    titleEn: "Problem-Solving Mindset",
    descId: "Senang menganalisis masalah teknis dan mencari solusi logis.",
    descEn: "Enjoys analyzing technical bottlenecks and finding logical, practical solutions.",
  },
  {
    code: "S4",
    titleId: "Kemampuan Adaptasi",
    titleEn: "Adaptability",
    descId: "Mampu menyesuaikan diri dengan berbagai lingkungan dan alat kerja.",
    descEn: "Quickly adapts to different development environments, frameworks, and tools.",
  },
  {
    code: "S5",
    titleId: "Berpikir Analitis",
    titleEn: "Analytical Thinking",
    descId: "Mempertimbangkan struktur dan logika sebelum mengambil keputusan.",
    descEn: "Carefully evaluates system structure and logic before making engineering decisions.",
  },
  {
    code: "S6",
    titleId: "Kegigihan",
    titleEn: "Persistence",
    descId: "Berusaha menyelesaikan tugas meskipun menghadapi kendala teknis.",
    descEn: "Committed to seeing tasks through to completion despite technical hurdles.",
  },
  {
    code: "S7",
    titleId: "Perhatian pada Detail",
    titleEn: "Attention to Detail",
    descId: "Memperhatikan kerapian kode dan struktur penulisan.",
    descEn: "Pays close attention to code cleanliness, edge cases, and structural clarity.",
  },
  {
    code: "S8",
    titleId: "Belajar melalui Praktik Langsung",
    titleEn: "Learning by Doing",
    descId: "Lebih mudah memahami konsep dengan mencoba dan membangun sendiri.",
    descEn: "Masters concepts fastest by building real prototypes and testing them hands-on.",
  },
  {
    code: "S9",
    titleId: "Terbuka terhadap Masukan",
    titleEn: "Open to Feedback",
    descId: "Menerima saran dan kritik sebagai bahan evaluasi diri.",
    descEn: "Welcomes constructive code reviews and critiques as fuel for self-improvement.",
  },
  {
    code: "S10",
    titleId: "Inisiatif Mandiri",
    titleEn: "Self-Initiative",
    descId: "Terbiasa mencari referensi dan mempelajari materi secara mandiri.",
    descEn: "Proactively researches documentation and learns new stacks independently.",
  },
];

export const SWOT_WEAKNESSES: SwotPoint[] = [
  {
    code: "W1",
    titleId: "Estimasi Waktu",
    titleEn: "Time Estimation",
    descId: "Masih belajar memperkirakan durasi pengerjaan proyek secara akurat.",
    descEn: "Continuously improving accuracy when estimating project delivery timelines.",
  },
  {
    code: "W2",
    titleId: "Penentuan Skala Prioritas",
    titleEn: "Prioritization",
    descId: "Terkadang tertarik mempelajari banyak hal sekaligus.",
    descEn: "Sometimes eager to explore multiple technologies simultaneously; refining focus.",
  },
  {
    code: "W3",
    titleId: "Konsistensi",
    titleEn: "Consistency",
    descId: "Terus berusaha menjaga ritme belajar secara teratur di tengah kesibukan.",
    descEn: "Actively maintaining a steady learning and building rhythm alongside coursework.",
  },
  {
    code: "W4",
    titleId: "Dokumentasi",
    titleEn: "Documentation Habits",
    descId: "Perlu membiasakan diri mencatat proses pengembangan dengan lebih rapi.",
    descEn: "Building the habit of documenting development processes earlier and more systematically.",
  },
  {
    code: "W5",
    titleId: "Berbicara di Depan Umum",
    titleEn: "Public Speaking",
    descId: "Masih melatih kepercayaan diri saat mempresentasikan ide di depan audiens.",
    descEn: "Practicing confidence and clarity when presenting technical ideas to large audiences.",
  },
  {
    code: "W6",
    titleId: "Berbagi Draf Lebih Awal",
    titleEn: "Sharing Early Drafts",
    descId: "Cenderung ingin hasil terlihat rapi terlebih dahulu sebelum meminta masukan.",
    descEn: "Tends to polish work before showing others; learning to iterate with early feedback.",
  },
  {
    code: "W7",
    titleId: "Koordinasi dan Kolaborasi",
    titleEn: "Team Delegation",
    descId: "Masih belajar membagi peran secara optimal dalam kerja kelompok.",
    descEn: "Continuing to refine task delegation and role distribution in group projects.",
  },
  {
    code: "W8",
    titleId: "Mengendalikan Perfeksionisme",
    titleEn: "Managing Perfectionism",
    descId: "Terkadang menghabiskan waktu cukup lama pada detail kecil.",
    descEn: "Occasionally spends extra time on micro-details; balancing polish with shipping speed.",
  },
  {
    code: "W9",
    titleId: "Perencanaan Jangka Panjang",
    titleEn: "Long-Term Roadmapping",
    descId: "Lebih sering fokus pada penyelesaian tugas jangka pendek.",
    descEn: "Expanding focus from immediate sprint tasks toward longer-term product roadmaps.",
  },
  {
    code: "W10",
    titleId: "Membangun Relasi Profesional",
    titleEn: "Professional Networking",
    descId: "Masih perlu lebih aktif berinteraksi di komunitas teknologi.",
    descEn: "Growing active participation and networking within broader developer communities.",
  },
];

export const RESEARCH_INTERESTS: ResearchInterestItem[] = [
  { code: "01", labelId: "Web & Mobile Engineering", labelEn: "Web & Mobile Engineering" },
  { code: "02", labelId: "Machine Learning", labelEn: "Machine Learning" },
  { code: "03", labelId: "Computer Vision", labelEn: "Computer Vision" },
  { code: "04", labelId: "GovTech & Sistem Publik", labelEn: "GovTech & Public Systems" },
  { code: "05", labelId: "Open Source", labelEn: "Open Source" },
  { code: "06", labelId: "Inklusivitas Aksesibilitas Haji", labelEn: "Hajj Accessibility Tech" },
  { code: "07", labelId: "Laravel & Flutter Ecosystem", labelEn: "Laravel & Flutter Ecosystem" },
  { code: "08", labelId: "Kewirausahaan Teknologi (K-1)", labelEn: "Tech Entrepreneurship (K-1)" },
];

export const KWU_SESSIONS: KwuSessionItem[] = [
  {
    id: "kwu-01",
    number: 1,
    code: "PERTEMUAN 01",
    titleId: "Pengantar & Kontrak Perkuliahan Kewirausahaan",
    titleEn: "Introduction & Entrepreneurship Course Contract",
    descId: "Dokumentasi kehadiran perdana, pembentukan kelompok K-1, dan pengenalan visi kewirausahaan teknologi.",
    descEn: "First session attendance documentation, formation of Group K-1, and introduction to tech entrepreneurship.",
    sessionDate: "Minggu 1 · 2026",
    attendanceStatus: "Hadir",
    attendanceProofUrl: null,
    taskTitle: "Pembentukan Kelompok K-1 & Kontrak Belajar",
    taskDescription: "Menyusun struktur 5 anggota Kelompok K-1 serta menyiapkan portal dokumentasi web masing-masing anggota.",
    taskUrl: "https://sites.google.com/view/reynaldi-porto/portofolio",
    taskStatus: "Selesai",
  },
  {
    id: "kwu-02",
    number: 2,
    code: "PERTEMUAN 02",
    titleId: "Eksplorasi Peluang & Ideasi Bisnis",
    titleEn: "Opportunity Exploration & Business Ideation",
    descId: "Dokumentasi kehadiran pertemuan ke-2 mengenai identifikasi masalah pasar dan validasi ide solusi.",
    descEn: "Session 2 attendance documentation covering market problem identification and solution validation.",
    sessionDate: "Minggu 2 · 2026",
    attendanceStatus: "Hadir",
    attendanceProofUrl: null,
    taskTitle: "Riset Masalah & Ideasi Solusi Digital",
    taskDescription: "Mengidentifikasi permasalahan layanan publik dan aksesibilitas jemaah sebagai dasar ide produk teknologi.",
    taskUrl: "https://sites.google.com/view/pdhlii/halaman-muka",
    taskStatus: "Selesai",
  },
  {
    id: "kwu-03",
    number: 3,
    code: "PERTEMUAN 03",
    titleId: "Analisis SWOT & Karakteristik Wirausaha",
    titleEn: "SWOT Analysis & Entrepreneurial Characteristics",
    descId: "Dokumentasi kehadiran pertemuan ke-3 membahas pemetaan kekuatan, kelemahan, dan profil anggota tim.",
    descEn: "Session 3 attendance documentation discussing strengths, weaknesses, and team member profile mapping.",
    sessionDate: "Minggu 3 · 2026",
    attendanceStatus: "Hadir",
    attendanceProofUrl: null,
    taskTitle: "Penyusunan 20 Poin Evaluasi SWOT Pribadi",
    taskDescription: "Memetakan 10 Kekuatan Utama (Strengths) dan 10 Area Evaluasi (Weaknesses) serta menetapkan profil Intrapreneur/Pegawai.",
    taskUrl: "https://sites.google.com/view/pdhlii/halaman-muka",
    taskStatus: "Selesai",
  },
  {
    id: "kwu-04",
    number: 4,
    code: "PERTEMUAN 04",
    titleId: "Perancangan Model Bisnis & Strategi Produk",
    titleEn: "Business Model Design & Product Strategy",
    descId: "Dokumentasi kehadiran pertemuan ke-4 dalam menyusun proposisi nilai dan struktur layanan digital.",
    descEn: "Session 4 attendance documentation on crafting value propositions and digital service structures.",
    sessionDate: "Minggu 4 · 2026",
    attendanceStatus: "Hadir",
    attendanceProofUrl: null,
    taskTitle: "Business Model Canvas & Value Proposition",
    taskDescription: "Merancang struktur nilai produk dan keberlanjutan implementasi teknologi pada sektor instansi dan masyarakat.",
    taskUrl: "https://sites.google.com/view/reynaldi-porto/portofolio",
    taskStatus: "Selesai",
  },
  {
    id: "kwu-05",
    number: 5,
    code: "PERTEMUAN 05",
    titleId: "Pengembangan Prototipe & Ekosistem Web",
    titleEn: "Prototype Development & Web Ecosystem",
    descId: "Dokumentasi kehadiran pertemuan ke-5 mengenai integrasi portofolio web kelompok dan kesiapan produk.",
    descEn: "Session 5 attendance documentation on integrating the group web portfolio and product readiness.",
    sessionDate: "Minggu 5 · 2026",
    attendanceStatus: "Hadir",
    attendanceProofUrl: null,
    taskTitle: "Integrasi Tautan Portofolio Kelompok K-1",
    taskDescription: "Menghubungkan seluruh portofolio 5 anggota Kelompok K-1 dalam satu direktori kolaboratif yang saling terhubung.",
    taskUrl: "https://sites.google.com/view/reynaldi-porto/portofolio",
    taskStatus: "Selesai",
  },
  {
    id: "kwu-06",
    number: 6,
    code: "PERTEMUAN 06",
    titleId: "Evaluasi Kemajuan & Presentasi Proyek K-1",
    titleEn: "Progress Evaluation & Group K-1 Presentation",
    descId: "Dokumentasi kehadiran pertemuan ke-6 sebagai evaluasi berkala atas pencapaian tugas kolaboratif.",
    descEn: "Session 6 attendance documentation reviewing collaborative coursework milestones and group presentation.",
    sessionDate: "Minggu 6 · 2026",
    attendanceStatus: "Hadir",
    attendanceProofUrl: null,
    taskTitle: "Laporan Evaluasi & Presentasi Kelompok K-1",
    taskDescription: "Menyajikan hasil dokumentasi 6 pertemuan, matriks SWOT, dan demonstrasi prototipe aplikasi.",
    taskUrl: "https://sites.google.com/view/pdhlii/halaman-muka",
    taskStatus: "Selesai",
  },
];

export const TEAM_K1_MEMBERS: TeamK1Member[] = [
  {
    number: "01",
    name: "Reynaldi Indrawijaya",
    roleBadgeId: "PENGUSAHA",
    roleBadgeEn: "ENTREPRENEUR",
    roleType: "entrepreneur",
    portfolioUrl: "https://sites.google.com/view/reynaldi-porto/halaman-muka",
  },
  {
    number: "02",
    name: "Fadli Hifziansyah",
    roleBadgeId: "PEGAWAI (ANDA)",
    roleBadgeEn: "INTRAPRENEUR / EMPLOYEE (YOU)",
    roleType: "employee",
    isSelf: true,
    portfolioUrl: "https://sites.google.com/view/pdhlii/halaman-muka",
  },
  {
    number: "03",
    name: "Muhammad Ridwan",
    roleBadgeId: "PENGUSAHA",
    roleBadgeEn: "ENTREPRENEUR",
    roleType: "entrepreneur",
    portfolioUrl: "https://sites.google.com/view/mridwan-portofolio/kewirausahaan",
  },
  {
    number: "04",
    name: "Safira Dwi Febriyanti",
    roleBadgeId: "PEGAWAI",
    roleBadgeEn: "EMPLOYEE",
    roleType: "employee",
    portfolioUrl: "https://sites.google.com/view/safira-dwi-febriyanti/Beranda",
  },
  {
    number: "05",
    name: "Rasyadah Wa Syafiq",
    roleBadgeId: "PENGUSAHA",
    roleBadgeEn: "ENTREPRENEUR",
    roleType: "entrepreneur",
    portfolioUrl: "https://sites.google.com/view/rasyadahwasyafiq/halaman-muka",
  },
];
