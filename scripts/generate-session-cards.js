const fs = require('fs');
const path = require('path');

const sessions = [
  {
    num: 1,
    code: 'PERTEMUAN 01',
    title: 'Pengantar & Kontrak Perkuliahan Kewirausahaan',
    desc: 'Dokumentasi kehadiran perdana, pembentukan kelompok K-1, dan pengenalan visi kewirausahaan teknologi.',
    date: 'Minggu 1 · 2026'
  },
  {
    num: 2,
    code: 'PERTEMUAN 02',
    title: 'Eksplorasi Peluang & Ideasi Bisnis',
    desc: 'Dokumentasi kehadiran pertemuan ke-2 mengenai identifikasi masalah pasar dan validasi ide solusi.',
    date: 'Minggu 2 · 2026'
  },
  {
    num: 3,
    code: 'PERTEMUAN 03',
    title: 'Analisis SWOT & Karakteristik Wirausaha',
    desc: 'Dokumentasi kehadiran pertemuan ke-3 membahas pemetaan kekuatan, kelemahan, dan profil anggota tim.',
    date: 'Minggu 3 · 2026'
  },
  {
    num: 4,
    code: 'PERTEMUAN 04',
    title: 'Perancangan Model Bisnis & Strategi Produk',
    desc: 'Dokumentasi kehadiran pertemuan ke-4 dalam menyusun proposisi nilai dan struktur layanan digital.',
    date: 'Minggu 4 · 2026'
  },
  {
    num: 5,
    code: 'PERTEMUAN 05',
    title: 'Pengembangan Prototipe & Ekosistem Web',
    desc: 'Dokumentasi kehadiran pertemuan ke-5 mengenai integrasi portofolio web kelompok dan kesiapan produk.',
    date: 'Minggu 5 · 2026'
  },
  {
    num: 6,
    code: 'PERTEMUAN 06',
    title: 'Evaluasi Kemajuan & Presentasi Proyek K-1',
    desc: 'Dokumentasi kehadiran pertemuan ke-6 sebagai evaluasi berkala atas pencapaian tugas kolaboratif.',
    date: 'Minggu 6 · 2026'
  }
];

function wrapText(text, maxChars) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const w of words) {
    if ((current + ' ' + w).trim().length > maxChars) {
      lines.push(current.trim());
      current = w;
    } else {
      current += ' ' + w;
    }
  }
  if (current.trim()) lines.push(current.trim());
  return lines;
}

const outDir = path.join(process.cwd(), 'public', 'coursework');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

sessions.forEach(s => {
  const titleLines = wrapText(s.title, 26);
  const descLines = wrapText(s.desc, 40).slice(0, 3);
  if (descLines.length === 3 && !descLines[2].endsWith('...')) descLines[2] += '...';

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="560" viewBox="0 0 400 560">
  <defs>
    <filter id="shadow" x="-5%" y="-3%" width="110%" height="108%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="rgba(0,0,0,0.06)"/>
    </filter>
  </defs>

  <!-- Card Background -->
  <rect x="10" y="10" width="380" height="540" rx="26" fill="#ffffff" stroke="#e5e7eb" stroke-width="1.5" filter="url(#shadow)"/>

  <!-- Top Pills Row -->
  <g transform="translate(30, 36)">
    <!-- Code Pill -->
    <rect x="0" y="0" width="116" height="28" rx="14" fill="#111213"/>
    <text x="58" y="18" font-family="monospace" font-size="11" font-weight="bold" fill="#f5f5f2" text-anchor="middle">${s.code}</text>

    <!-- Attendance Status Pill -->
    <rect x="230" y="0" width="110" height="28" rx="14" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="1"/>
    <circle cx="246" cy="14" r="4" fill="#10b981"/>
    <text x="288" y="18" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#047857" text-anchor="middle">Absen: Hadir</text>
  </g>

  <!-- Title -->
  <g transform="translate(30, 96)">
    ${titleLines.map((line, i) => `<text x="0" y="${i * 26}" font-family="system-ui, -apple-system, sans-serif" font-size="19" font-weight="700" fill="#111827" letter-spacing="-0.02em">${line}</text>`).join('\n    ')}
  </g>

  <!-- Subtitle / Description -->
  <g transform="translate(30, ${100 + titleLines.length * 26})">
    ${descLines.map((line, i) => `<text x="0" y="${i * 18}" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#6b7280" letter-spacing="-0.01em">${line}</text>`).join('\n    ')}
  </g>

  <!-- Center Verification Frame Box -->
  <g transform="translate(30, 260)">
    <rect x="0" y="0" width="340" height="180" rx="18" fill="#f3f4f6" stroke="#e5e7eb" stroke-width="1"/>
    <!-- Camera Icon -->
    <g transform="translate(156, 46)" stroke="#9ca3af" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </g>
    <text x="170" y="116" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#374151" text-anchor="middle">Kehadiran Tercatat di Sistem</text>
    <text x="170" y="136" font-family="monospace" font-size="11" fill="#9ca3af" text-anchor="middle">${s.date}</text>
  </g>

  <!-- Footer Meta Row -->
  <g transform="translate(30, 480)">
    <!-- Date -->
    <text x="0" y="18" font-family="monospace" font-size="12" fill="#6b7280">🗓 ${s.date}</text>
    <!-- Task Status Pill -->
    <rect x="236" y="0" width="104" height="26" rx="13" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="1"/>
    <text x="288" y="17" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#047857" text-anchor="middle">Tugas: Selesai</text>
  </g>
</svg>`;

  const filePath = path.join(outDir, `session-${s.num}.svg`);
  fs.writeFileSync(filePath, svg);
  console.log(`Generated ${filePath}`);
});

