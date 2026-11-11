const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const outDir = path.join(process.cwd(), 'public', 'experience-folders');
const svgFiles = [
  'simduk-kominfo.svg',
  'smart-hajj-ai.svg',
  'oase-award.svg',
  'kelompok-k1.svg',
  'govtech-reporting.svg',
  'vision-gesture-engine.svg',
];

async function main() {
  console.log('--- Step 1: Cleaning folder-drop-shadow from SVGs ---');
  for (const file of svgFiles) {
    const filePath = path.join(outDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove folder-drop-shadow filter definition
    content = content.replace(
      /\s*<filter id="folder-drop-shadow"[\s\S]*?<\/filter>/gi,
      ''
    );

    // Replace <g filter="url(#folder-drop-shadow)"> with <g id="folder-back">
    content = content.replace(
      /<g filter="url\(#folder-drop-shadow\)">/gi,
      '<g id="folder-back">'
    );

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Cleaned drop shadow from ${file}`);
  }

  console.log('\n--- Step 2: Rendering crisp 2x transparent PNGs via Playwright (msedge) ---');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({
    viewport: { width: 560, height: 390 },
    deviceScaleFactor: 2,
  });

  for (const file of svgFiles) {
    const filePath = path.join(outDir, file);
    const pngName = file.replace('.svg', '.png');
    const pngPath = path.join(outDir, pngName);

    const svgContent = fs.readFileSync(filePath, 'utf8');
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 560px;
      height: 390px;
      background: transparent !important;
      overflow: hidden;
    }
    svg {
      width: 560px;
      height: 390px;
      display: block;
    }
  </style>
</head>
<body>
  ${svgContent}
</body>
</html>`;

    await page.setContent(html, { waitUntil: 'networkidle' });
    // Small delay to ensure any fonts/subpixel rendering settle
    await page.waitForTimeout(100);

    await page.screenshot({
      path: pngPath,
      omitBackground: true,
      type: 'png',
    });

    const stat = fs.statSync(pngPath);
    console.log(`Rendered ${pngName} (${stat.size} bytes)`);
  }

  await browser.close();
  console.log('\nAll landscape 560x390 folders rendered successfully with zero outer drop shadow!');
}

main().catch((err) => {
  console.error('Error rendering folders:', err);
  process.exit(1);
});
