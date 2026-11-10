const fs = require('fs');
const path = require('path');

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
    color: '#18191c',
    tabColor: '#222327',
    accentColor: '#c4e22e',
    textColor: '#ffffff',
    summary: 'Digitalisasi administrasi kependudukan daerah via SIMDUK berbasis Laravel & MySQL.',
    papers: [
      { code: 'DOC-01', title: 'Ringkasan Eksekutif & Demografi', desc: 'Arsitektur CRUD kependudukan & validasi NIK/KK' },
      { code: 'DOC-02', title: 'Optimasi Database & Rekapitulasi Sensus', desc: 'Query relasional terindeks & ekspor resmi RT/RW' },
      { code: 'DOC-03', title: 'RBAC Multi-Level Kelurahan', desc: 'Otentikasi bertingkat staf, verifikator & admin' }
    ],
    stack: ['Laravel', 'PHP', 'MySQL', 'Bootstrap', 'REST API']
  },
  {
    id: 'exp-02',
    slug: 'smart-hajj-ai',
    tab: 'AI-01 · SMART HAJJ',
    title: 'Smart Hajj: Vision AI',
    subtitle: 'Sistem Aksesibilitas Inklusif',
    badge: 'AI & COMPUTER VISION',
    year: '2025 - 2026',
    color: '#3b1c85',
    tabColor: '#4c28a8',
    accentColor: '#c4e22e',
    textColor: '#ffffff',
    summary: 'Platform Computer Vision deteksi pecahan uang SAR & isyarat dua arah jemaah disabilitas.',
    papers: [
      { code: 'DOC-01', title: 'Pipeline 4-Tahap Deteksi Kamera', desc: 'Kamera ponsel -> OpenCV -> Klasifikasi SAR -> TTS' },
      { code: 'DOC-02', title: '21-Titik MediaPipe Hand Landmarks', desc: 'Ekstraksi koordinat 3D sendi tangan real-time 60fps' },
      { code: 'DOC-03', title: 'Penerjemah Bahasa Isyarat 2 Arah', desc: 'Komunikasi mandiri jemaah haji & petugas Arab Saudi' }
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
    color: '#064e3b',
    tabColor: '#065f46',
    accentColor: '#6ee7b7',
    textColor: '#ffffff',
    summary: 'Penghargaan resmi Juara II Nasional Karya Literasi & Inovasi Teknologi OASE III PTKI se-Indonesia.',
    papers: [
      { code: 'DOC-01', title: 'Sertifikat Kejuaraan Nasional Resmi', desc: 'Validasi Kementerian Agama Republik Indonesia' },
      { code: 'DOC-02', title: 'Studi Kelayakan & Pengujian Juri', desc: 'Pengujian prototipe teknologi literasi di hadapan juri' },
      { code: 'DOC-03', title: 'Arsitektur Sistem Inklusif', desc: 'Dampak nyata teknologi pada aksesibilitas publik' }
    ],
    stack: ['AI Prototype', 'Computer Vision', 'GovTech', 'Python']
  },
  {
    id: 'exp-04',
    slug: 'kelompok-k1',
    tab: 'ACADEMIC · TIM K-1',
    title: 'Portal Kewirausahaan K-1',
    subtitle: 'Ekosistem Kolaboratif Informatika',
    badge: 'TIM AKADEMIK',
    year: '2026',
    color: '#0f172a',
    tabColor: '#1e293b',
    accentColor: '#38bdf8',
    textColor: '#ffffff',
    summary: 'Rancang bangun portal perkuliahan 6 pertemuan, pelacakan tugas, absensi, & sinkronisasi Supabase.',
    papers: [
      { code: 'DOC-01', title: 'Kontrak Perkuliahan & Tim K-1', desc: 'Struktur kepengurusan tim, repositori GitHub, & linimasa' },
      { code: 'DOC-02', title: 'Analisis SWOT & Ide Bisnis', desc: 'Pemetaan peluang pasar web modern & proposisi nilai' },
      { code: 'DOC-03', title: 'Integrasi Supabase & Headless CMS', desc: 'State real-time sinkron dengan database PostgreSQL cloud' }
    ],
    stack: ['Next.js 15', 'TypeScript', 'Tailwind', 'Supabase']
  },
  {
    id: 'exp-05',
    slug: 'govtech-reporting',
    tab: 'DATA · KOMINFO',
    title: 'Dashboard Pelaporan Publik',
    subtitle: 'GovTech Sensus & Ekspor',
    badge: 'DATABASE GOVTECH',
    year: '2025',
    color: '#281c1c',
    tabColor: '#3a2727',
    accentColor: '#fca5a5',
    textColor: '#ffffff',
    summary: 'Agregasi demografi kelurahan, rekap RT/RW, dan otomasi pelaporan kependudukan tingkat daerah.',
    papers: [
      { code: 'DOC-01', title: 'Skema Relasional Normalisasi 3NF', desc: 'Struktur tabel terisolasi untuk data sensus & demografi' },
      { code: 'DOC-02', title: 'Ekspor Dokumen Laporan Kependudukan', desc: 'Otomasi generate PDF/Excel terverifikasi tanda tangan' },
      { code: 'DOC-03', title: 'Filter Dinamis & Query Indexing', desc: 'Pencarian NIK dalam hitungan milidetik pada puluhan ribu row' }
    ],
    stack: ['Laravel', 'MySQL', 'REST API', 'GovTech']
  },
  {
    id: 'exp-06',
    slug: 'vision-gesture-engine',
    tab: 'VISION · 21-PTS',
    title: 'Vision AI Gesture Engine',
    subtitle: 'Pelacakan Isyarat 21-Titik',
    badge: 'RESEARCH & APPLIED CV',
    year: '2025',
    color: '#1e1b4b',
    tabColor: '#2e276b',
    accentColor: '#a5b4fc',
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

folders.forEach((folder, idx) => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="440" height="600" viewBox="0 0 440 600">
  <defs>
    <filter id="folder-shadow" x="-8%" y="-4%" width="116%" height="112%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="rgba(0,0,0,0.22)"/>
    </filter>
    <filter id="paper-shadow" x="-5%" y="-5%" width="110%" height="114%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="rgba(0,0,0,0.14)"/>
    </filter>
    <linearGradient id="folder-grad-${idx}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${folder.color}" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="${folder.color}" stop-opacity="1"/>
    </linearGradient>
    <linearGradient id="flap-light-${idx}" x1="0" y1="0" x2="1" y2="0.6">
      <stop offset="0%" stop-color="rgba(255,255,255,0.12)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.02)"/>
    </linearGradient>
  </defs>

  <!-- Folder Back Cover with Tab (Physical Manila / Studio Keffi Folder Silhouette) -->
  <g filter="url(#folder-shadow)">
    <!-- Back Tab Shape: Left aligned tab -->
    <path d="M 30,76 
             L 190,76 
             Q 206,76 216,92 
             L 224,106 
             Q 232,118 248,118 
             L 410,118 
             Q 424,118 424,132 
             L 424,564 
             Q 424,578 410,578 
             L 30,578 
             Q 16,578 16,564 
             L 16,90 
             Q 16,76 30,76 Z" 
          fill="${folder.tabColor}" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />
    
    <!-- Tab Text Label -->
    <text x="36" y="102" font-family="monospace" font-size="11" font-weight="bold" fill="${folder.accentColor}" letter-spacing="0.08em">
      ${escapeXml(folder.tab)}
    </text>
  </g>

  <!-- Peeking Paper Sheets (Physical Papers inside folder) -->
  <!-- Sheet 3 (Deepest) -->
  <g filter="url(#paper-shadow)" transform="rotate(3, 220, 200)">
    <rect x="52" y="100" width="336" height="300" rx="12" fill="#eef0f3" stroke="#d5d9df" stroke-width="1.2"/>
    <rect x="74" y="118" width="120" height="8" rx="4" fill="#cbd5e1"/>
    <rect x="74" y="134" width="260" height="6" rx="3" fill="#e2e8f0"/>
  </g>

  <!-- Sheet 2 (Middle) -->
  <g filter="url(#paper-shadow)" transform="rotate(-1.8, 220, 200)">
    <rect x="42" y="112" width="356" height="300" rx="12" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.2"/>
    <rect x="66" y="130" width="160" height="10" rx="5" fill="#94a3b8"/>
    <rect x="66" y="150" width="280" height="6" rx="3" fill="#cbd5e1"/>
    <rect x="66" y="164" width="240" height="6" rx="3" fill="#e2e8f0"/>
  </g>

  <!-- Sheet 1 (Top Paper / Document Preview) -->
  <g filter="url(#paper-shadow)">
    <rect x="36" y="126" width="368" height="300" rx="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.2"/>
    
    <!-- Document Header -->
    <g transform="translate(60, 150)">
      <rect x="0" y="0" width="60" height="18" rx="9" fill="#111827"/>
      <text x="30" y="12" font-family="monospace" font-size="9" font-weight="bold" fill="#f8fafc" text-anchor="middle">
        ${escapeXml(folder.papers[0].code)}
      </text>

      <text x="72" y="13" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#0f172a">
        ${escapeXml(folder.papers[0].title.slice(0, 32))}
      </text>
      
      <rect x="0" y="28" width="320" height="1" fill="#f1f5f9"/>

      <text x="0" y="44" font-family="system-ui, sans-serif" font-size="10.5" fill="#64748b">
        ${escapeXml(folder.papers[0].desc.slice(0, 48))}
      </text>
    </g>
  </g>

  <!-- Folder Front Pocket / Flap (Overlaps the bottom 65% of the folder) -->
  <g filter="url(#folder-shadow)">
    <path d="M 16,230 
             Q 16,218 28,218 
             L 412,218 
             Q 424,218 424,230 
             L 424,566 
             Q 424,578 412,578 
             L 28,578 
             Q 16,578 16,566 Z" 
          fill="url(#folder-grad-${idx})" 
          stroke="rgba(255,255,255,0.16)" 
          stroke-width="1.5" />
    
    <!-- Subtle Light Wash on Flap -->
    <path d="M 16,230 Q 16,218 28,218 L 412,218 Q 424,218 424,230 L 424,566 Q 424,578 412,578 L 28,578 Q 16,578 16,566 Z" 
          fill="url(#flap-light-${idx})" />
    
    <!-- Top Flap Lip / Stitch Accent -->
    <line x1="28" y1="228" x2="412" y2="228" stroke="rgba(255,255,255,0.22)" stroke-width="1" stroke-dasharray="4 4"/>
  </g>

  <!-- Folder Content Typography & Badges on the Front Pocket -->
  <g transform="translate(42, 252)">
    <!-- Badge and Year -->
    <rect x="0" y="0" width="${folder.badge.length * 8.2 + 20}" height="24" rx="12" fill="${folder.accentColor}"/>
    <text x="${(folder.badge.length * 8.2 + 20) / 2}" y="15" font-family="monospace" font-size="10" font-weight="bold" fill="#111827" text-anchor="middle">
      ${escapeXml(folder.badge)}
    </text>

    <text x="356" y="16" font-family="monospace" font-size="11" font-weight="bold" fill="rgba(255,255,255,0.7)" text-anchor="end">
      ${escapeXml(folder.year)}
    </text>

    <!-- Main Title -->
    <text x="0" y="58" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="700" fill="#ffffff" letter-spacing="-0.02em">
      ${escapeXml(folder.title)}
    </text>

    <!-- Subtitle / Organization -->
    <text x="0" y="82" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="500" fill="rgba(255,255,255,0.78)">
      ${escapeXml(folder.subtitle)}
    </text>

    <!-- Summary Paragraph -->
    <g transform="translate(0, 114)">
      <rect x="0" y="0" width="356" height="58" rx="10" fill="rgba(0,0,0,0.24)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <text x="14" y="24" font-family="system-ui, sans-serif" font-size="11.5" fill="rgba(255,255,255,0.9)" letter-spacing="-0.01em">
        ${escapeXml(folder.summary.slice(0, 48))}
      </text>
      <text x="14" y="42" font-family="system-ui, sans-serif" font-size="11.5" fill="rgba(255,255,255,0.9)" letter-spacing="-0.01em">
        ${escapeXml(folder.summary.slice(48, 96))}...
      </text>
    </g>

    <!-- Tech Stack Row -->
    <g transform="translate(0, 192)">
      <text x="0" y="0" font-family="monospace" font-size="9.5" font-weight="bold" fill="${folder.accentColor}" letter-spacing="0.08em" text-transform="uppercase">
        ENGINEERING STACK:
      </text>
      <g transform="translate(0, 10)">
        ${folder.stack.slice(0, 4).map((tech, tIdx) => {
          const xOffset = tIdx * 88;
          return `
          <g transform="translate(${xOffset}, 0)">
            <rect x="0" y="0" width="80" height="22" rx="11" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
            <text x="40" y="14" font-family="monospace" font-size="10" font-weight="600" fill="#ffffff" text-anchor="middle">
              ${escapeXml(tech)}
            </text>
          </g>`;
        }).join('')}
      </g>
    </g>

    <!-- Bottom Action Pill: Buka Berkas -->
    <g transform="translate(0, 260)">
      <rect x="0" y="0" width="356" height="34" rx="17" fill="rgba(255,255,255,0.09)" stroke="${folder.accentColor}" stroke-width="1"/>
      <text x="178" y="21" font-family="monospace" font-size="11" font-weight="bold" fill="${folder.accentColor}" text-anchor="middle">
        📂 KLIK UNTUK BUKA FOLDER 3D →
      </text>
    </g>
  </g>
</svg>`;

  fs.writeFileSync(path.join(outDir, `${folder.slug}.svg`), svg, 'utf8');
  console.log(`Generated public/experience-folders/${folder.slug}.svg`);
});

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
      image: `/experience-folders/${f.slug}.svg`
    })),
    null,
    2
  )};
`,
  'utf8'
);
console.log('Saved src/data/experience-folders.ts');

