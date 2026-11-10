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
      headlineEn: "Building practical web, mobile, and computer vision applications.",
      headlineId: "Membangun solusi aplikasi web, mobile, dan computer vision yang aplikatif.",
      leadEn:
        "I am Fadli Hifziansyah. I use this portfolio to document my learning process, university academic works, and software projects across Laravel, Next.js, Flutter, and Computer Vision AI.",
      leadId:
        "Saya Fadli Hifziansyah. Portofolio ini saya gunakan untuk mendokumentasikan proses belajar, karya akademik perkuliahan, serta proyek perangkat lunak di bidang Laravel, Next.js, Flutter, dan Computer Vision AI.",
    },
    recruiter: {
      kickerEn: "PROFESSIONAL SUMMARY · INTERNSHIP, GOVTECH & AI PROJECTS",
      kickerId: "RINGKASAN PROFESIONAL · MAGANG KOMINFO, GOVTECH & INOVASI AI",
      headlineEn: "Full-Stack Web, Mobile & AI Developer with public-sector experience.",
      headlineId: "Pengembang Full-Stack Web, Mobile & AI dengan pengalaman instansi publik.",
      leadEn:
        "Experienced as a Web Developer Intern at Dinas Kominfo (SIMDUK Laravel + MySQL), Freelance GovTech Developer, and AI/Computer Vision Engineer for the Smart Hajj Inclusive Accessibility System.",
      leadId:
        "Berpengalaman sebagai Web Developer Intern di Dinas Kominfo (SIMDUK Laravel + MySQL), Freelance Developer di sektor publik, serta perancang sistem AI/Computer Vision Smart Hajj untuk aksesibilitas jemaah haji.",
    },
  },
  telemetryMetrics: [
    {
      code: "EXP-01",
      labelEn: "Official Internship",
      labelId: "Magang Resmi Instansi",
      value: "Kominfo",
      detailEn: "SIMDUK Population Web App (Laravel & MySQL)",
      detailId: "Aplikasi Web SIMDUK (Laravel & MySQL)",
    },
    {
      code: "EXP-02",
      labelEn: "Public Sector Projects",
      labelId: "Proyek Sektor Publik",
      value: "GovTech",
      detailEn: "Freelance Digital Reporting & Verification Portals",
      detailId: "Sistem Pelaporan & Verifikasi Instansi",
    },
    {
      code: "AI-03",
      labelEn: "Flagship AI Innovation",
      labelId: "Inovasi AI Unggulan",
      value: "Smart Hajj",
      detailEn: "Riyal (SAR) CV Detector & 2-Way Sign Language AI",
      detailId: "Deteksi Riyal (SAR) & Bahasa Isyarat 2 Arah",
    },
    {
      code: "ACA-04",
      labelEn: "Academic Team Hub",
      labelId: "Tim Akademik Informatika",
      value: "Kelompok K-1",
      detailEn: "6 Entrepreneurship Sessions & SWOT Analysis",
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
    slug: "smart-hajj-vision-ai",
    title: "Smart Hajj: Sistem Aksesibilitas Inklusif Berbasis AI & Computer Vision",
    category: "AI & Computer Vision · Mobile Accessibility",
    year: "2025 - 2026",
    clientOrContext: "Inovasi AI Unggulan · Aksesibilitas Jemaah Haji",
    roleEn: "AI & Computer Vision Engineer",
    roleId: "Insinyur AI & Computer Vision",
    featured: true,
    status: "published",
    summaryEn:
      "Inclusive AI and computer vision platform assisting Hajj pilgrims (especially deaf and speech-impaired pilgrims) to worship and transact independently in the Holy Land via real-time Saudi Riyal (SAR) banknote detection and two-way sign language translation.",
    summaryId:
      "Platform kecerdasan buatan dan visi komputer inklusif untuk mendampingi jemaah haji (khususnya penyandang disabilitas rungu & wicara) beribadah dan bertransaksi secara mandiri di tanah suci melalui deteksi uang Riyal (SAR) dan penerjemah bahasa isyarat dua arah.",
    recruiterExecSummaryEn:
      "Combined real-time mobile camera object detection (Saudi Riyal SAR banknotes with instant audio TTS verification) and 21-point MediaPipe hand landmark tracking for bidirectional sign-language communication.",
    recruiterExecSummaryId:
      "Menggabungkan deteksi objek kamera ponsel secara real-time (pecahan uang kertas Riyal Arab Saudi dengan verifikasi suara TTS instan) serta pelacakan 21 titik kerangka tangan MediaPipe untuk komunikasi bahasa isyarat dua arah.",
    problemEn:
      "Elderly and deaf or speech-impaired Hajj pilgrims frequently face communication barriers with officers and difficulty identifying unfamiliar Saudi Riyal (SAR) banknote denominations during daily transactions in Mecca and Medina.",
    problemId:
      "Jemaah haji lansia maupun penyandang disabilitas rungu dan wicara sering menghadapi kendala komunikasi dengan petugas serta kesulitan mengenali pecahan mata uang Riyal Arab Saudi (SAR) saat bertransaksi mandiri di tanah suci.",
    architectureEn:
      "Engineered three integrated AI modules inside a unified mobile workflow: (1) Computer Vision Riyal Banknote Detector trained on SAR denominations with automatic Text-to-Speech nominal readout, (2) Sign Language to Text & Speech using MediaPipe 21 hand-landmark coordinates classified in real time, and (3) Officer Speech/Text to interactive Sign Language visualization.",
    architectureId:
      "Merancang tiga modul AI terintegrasi dalam satu alur aplikasi mobile: (1) Pendeteksi Mata Uang Riyal berbasis Computer Vision dengan keluaran suara nominal otomatis (TTS), (2) Konversi Bahasa Isyarat ke Teks & Suara menggunakan 21 titik koordinat tangan MediaPipe, serta (3) Penerjemah Suara/Teks Petugas ke visualisasi gerakan bahasa isyarat.",
    tradeoffs: [
      {
        decision: "Hand Tracking & Gesture Pipeline",
        chosen: "MediaPipe 21 Hand Landmarks + Lightweight Classifier",
        alternative: "Heavy Raw-Frame 3D CNN Video Model",
        rationaleEn:
          "Extracting 21 skeletal hand keypoints reduces input dimensionality dramatically, enabling smooth real-time inference on mid-range smartphones without overheating.",
        rationaleId:
          "Mengekstrak 21 titik koordinat kerangka tangan memangkas beban komputasi secara signifikan sehingga inferensi berjalan real-time dan ringan di ponsel kelas menengah.",
      },
      {
        decision: "Currency Verification Feedback",
        chosen: "Visual Bounding Box + Instant Audio Speech Synthesis (TTS)",
        alternative: "Text-Only Screen Label",
        rationaleEn:
          "Combining high-contrast visual bounding boxes with immediate spoken nominal verification assists both visually impaired/elderly pilgrims and merchants during fast transactions.",
        rationaleId:
          "Memadukan kotak deteksi visual kontras tinggi dengan pembacaan suara nominal instan membantu jemaah lansia maupun pedagang memastikan nilai transaksi secara cepat.",
      },
    ],
    metrics: [
      {
        labelEn: "Core AI Modules",
        labelId: "Modul Inti AI",
        value: "3 Modul",
        delta: "CV + Sign STT/TTS",
      },
      {
        labelEn: "Hand Keypoints Tracked",
        labelId: "Titik Kerangka Tangan",
        value: "21 Titik",
        delta: "Real-Time MediaPipe",
      },
      {
        labelEn: "Communication Direction",
        labelId: "Arah Komunikasi",
        value: "2 Arah",
        delta: "Jemaah ↔ Petugas",
      },
    ],
    stack: ["Python", "OpenCV", "MediaPipe", "Deep Learning", "Flutter", "STT & TTS"],
    liveUrl: "https://github.com/fadli154",
    repoUrl: "https://github.com/fadli154",
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
    metricsBadge: "SIMDUK · Laravel & MySQL",
    summaryEn:
      "Contributed directly to public administration digitization by designing and developing a web-based population data management application (SIMDUK) using Laravel and MySQL for local government bureaucratic efficiency.",
    summaryId:
      "Berkontribusi langsung dalam digitalisasi administrasi publik dengan merancang dan mengembangkan aplikasi web pendataan kependudukan (SIMDUK) berbasis Laravel dan MySQL untuk efisiensi birokrasi pemerintahan daerah.",
    highlightsEn: [
      "Citizen Data Application: Built CRUD architecture, NIK/Family Card (KK) validation, and dynamic demographic filters for accurate population management.",
      "Database Management & Recapitulation: Optimized MySQL relational queries to accelerate census data aggregation, RT/RW recaps, and official report exports.",
      "Security & Access Control (RBAC): Implemented multi-level authentication separating sub-district staff, verifiers, and system administrators.",
    ],
    highlightsId: [
      "Aplikasi Pendataan Warga: Membangun arsitektur CRUD, validasi NIK/Kartu Keluarga, serta filter dinamis untuk manajemen demografi kependudukan yang presisi.",
      "Manajemen Database & Rekapitulasi: Mengoptimasi relasi database MySQL guna mempercepat agregasi data sensus, rekap RT/RW, dan ekspor dokumen laporan resmi.",
      "Keamanan & Hak Akses (RBAC): Mengimplementasikan otentikasi multi-level untuk staf kelurahan, verifikator, dan administrator sistem.",
    ],
    stack: ["Laravel", "PHP", "MySQL", "Bootstrap", "REST API"],
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
