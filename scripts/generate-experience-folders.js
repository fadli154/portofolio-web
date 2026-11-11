const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

function escapeXml(unsafe) {
  return String(unsafe).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

const folders = [
  {
    id: 'exp-01',
    slug: 'simduk-kominfo',
    tab: 'EXP-01 · SIMDUK',
    title: 'Web Developer Intern',
    subtitle: 'Dinas Komunikasi & Informatika',
    badge: 'MAGANG RESMI',
    year: '2025',
    color: '#2563eb',
    tabColor: '#1d4ed8',
    accentColor: '#93c5fd',
    textColor: '#ffffff',
    summary: 'Digitalisasi administrasi kependudukan daerah via SIMDUK berbasis Laravel & MySQL.',
    papers: [
      { code: 'DOC-01', title: 'Ringkasan Eksekutif & Demografi', desc: 'Arsitektur CRUD kependudukan & validasi NIK/KK' },
      { code: 'DOC-02', title: 'Optimasi Database & Sensus', desc: 'Query relasional terindeks & ekspor resmi RT/RW' },
      { code: 'DOC-03', title: 'RBAC Multi-Level Kelurahan', desc: 'Otentikasi bertingkat staf, verifikator & admin' }
    ],
    stack: ['Laravel', 'PHP', 'MySQL', 'Bootstrap', 'REST API']
  },
  {
    id: 'exp-02',
    slug: 'smart-hajj-ai',
    tab: 'AI-01 · SMART HAJJ',
    title: 'Smart Hajj: Vision AI',
    subtitle: 'Inovasi AI Aksesibilitas',
    badge: 'VISION AI & CV',
    year: '2025-2026',
    color: '#6366f1',
    tabColor: '#4f46e5',
    accentColor: '#c7d2fe',
    textColor: '#ffffff',
    summary: 'Platform Computer Vision deteksi pecahan uang SAR & isyarat dua arah jemaah disabilitas.',
    papers: [
      { code: 'DOC-01', title: 'Pipeline Deteksi Kamera ...', desc: 'Kamera ponsel -> OpenCV -> Klasifikasi SAR -> TTS' },
      { code: 'DOC-02', title: '21-Titik Landmark Medi...', desc: 'Pelacakan sendi tangan 60fps tanpa sensor khusus' },
      { code: 'DOC-03', title: 'Penerjemah Bahasa Isyara...', desc: 'Komunikasi mandiri jemaah haji & petugas Arab Saudi' }
    ],
    stack: ['Python', 'OpenCV', 'MediaPipe', 'Deep Learning', 'Flutter']
  },
  {
    id: 'exp-03',
    slug: 'oase-award',
    tab: 'AWARD · OASE III',
    title: 'Juara II Inovasi Teknologi',
    subtitle: 'Kementerian Agama RI (Nasional)',
    badge: 'PRESTASI NASIONAL',
    year: '2024',
    color: '#059669',
    tabColor: '#047857',
    accentColor: '#6ee7b7',
    textColor: '#ffffff',
    summary: 'Penghargaan resmi Juara II Nasional Karya Literasi & Inovasi Teknologi OASE III PTKI se-Indonesia.',
    papers: [
      { code: 'DOC-01', title: 'Sertifikat Kejuaraan Nasional', desc: 'Validasi Kementerian Agama Republik Indonesia' },
      { code: 'DOC-02', title: 'Studi Kelayakan & Pengujian Juri', desc: 'Pengujian prototipe teknologi literasi di hadapan juri' },
      { code: 'DOC-03', title: 'Arsitektur Inklusif', desc: 'Dampak nyata teknologi pada aksesibilitas publik' }
    ],
    stack: ['AI Prototype', 'Computer Vision', 'GovTech', 'Python']
  },
  {
    id: 'exp-04',
    slug: 'kelompok-k1',
    tab: 'ACAD · TIM K-1',
    title: 'Portal Perkuliahan K-1',
    subtitle: 'Mata Kuliah Kewirausahaan',
    badge: 'PORTAL TIM AKADEMIK',
    year: '2026',
    color: '#0284c7',
    tabColor: '#0369a1',
    accentColor: '#7dd3fc',
    textColor: '#ffffff',
    summary: 'Rancang bangun portal perkuliahan 6 pertemuan, pelacakan tugas, absensi, & sinkronisasi Supabase.',
    papers: [
      { code: 'DOC-01', title: 'Struktur Organisasi Tim K-1', desc: 'Struktur kepengurusan tim, repositori GitHub, & linimasa' },
      { code: 'DOC-02', title: 'Log Absensi 6 Pertemuan...', desc: 'Sinkronisasi riwayat kehadiran perkuliahan ke Supabase' },
      { code: 'DOC-03', title: 'Deliverables & Presentasi', desc: 'Dokumentasi produk dan artefak inovasi perkuliahan' }
    ],
    stack: ['Next.js 15', 'TypeScript', 'Tailwind', 'Supabase']
  },
  {
    id: 'exp-05',
    slug: 'govtech-reporting',
    tab: 'DATA · KOMINFO',
    title: 'Dashboard Pelaporan Publik',
    subtitle: 'Dinas Komunikasi & Informatika',
    badge: 'DATABASE & ARCHITECTURE',
    year: '2025',
    color: '#d97706',
    tabColor: '#b45309',
    accentColor: '#fde68a',
    textColor: '#ffffff',
    summary: 'Agregasi demografi kelurahan, rekap RT/RW, dan otomasi pelaporan kependudukan tingkat daerah.',
    papers: [
      { code: 'DOC-01', title: 'Skema Relasional Normalisasi 3NF', desc: 'Struktur tabel terisolasi untuk data sensus & demografi' },
      { code: 'DOC-02', title: 'Validasi NIK/KK & Proteksi SQL', desc: 'Mencegah injeksi & verifikasi integritas data sipil' },
      { code: 'DOC-03', title: 'Automated Export & Logging', desc: 'Penerbitan rekapitulasi data periodik ke PDF & Excel' }
    ],
    stack: ['Laravel', 'MySQL', 'REST API', 'GovTech']
  },
  {
    id: 'exp-06',
    slug: 'vision-gesture-engine',
    tab: 'AI · MEDIAPIPE',
    title: 'Vision AI Gesture Engine',
    subtitle: 'Pelacakan Isyarat 21-Titik',
    badge: 'RESEARCH & APPLIED CV',
    year: '2025',
    color: '#8b5cf6',
    tabColor: '#7c3aed',
    accentColor: '#ddd6fe',
    textColor: '#ffffff',
    summary: 'Engine visi komputer pelacakan sendi tangan real-time dengan toleransi rotasi tinggi untuk mobile.',
    papers: [
      { code: 'DOC-01', title: 'Topologi 21 Sendi Tangan MediaPipe', desc: 'Pemetaan koordinat 3D pergelangan, jempol, hingga kelingking' },
      { code: 'DOC-02', title: 'Inferensi 60 FPS pada Mobile', desc: 'Optimasi model TFLite untuk kamera Android/iOS' },
      { code: 'DOC-03', title: 'Integrasi Suara TTS Dua Arah', desc: 'Penerjemahan teks ke suara instan bahasa Arab & Indonesia' }
    ],
    stack: ['MediaPipe', 'OpenCV', 'TensorFlow Lite', 'Python']
  }
];

const outDir = path.join(process.cwd(), 'public', 'experience-folders');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Also write exportable data json for React components
fs.writeFileSync(
  path.join(process.cwd(), 'src', 'data', 'experience-folders.ts'),
  `export interface ExperienceFolderPaper {
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

export const EXPERIENCE_FOLDERS: ExperienceFolderData[] = ${JSON.stringify(
    folders.map(f => ({
      ...f,
      image: `/experience-folders/${f.slug}.png`
    })),
    null,
    2
  )};
`,
  'utf8'
);
console.log('Saved src/data/experience-folders.ts');
