const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1280, height: 800 },
  { name: 'desktop', width: 1920, height: 1080 },
];

const SECTIONS = ['hero', 'about', 'work', 'stack', 'certificates', 'coursework', 'contact'];

async function main() {
  const outDir = path.join(__dirname, '../public/qa-responsive');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    channel: 'msedge'
  }).catch(() => chromium.launch({ headless: true, channel: 'chrome' }));

  const report = {};

  for (const vp of VIEWPORTS) {
    console.log(`\n--- Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    // 1. Check Horizontal Overflow
    const overflowInfo = await page.evaluate(() => {
      const docW = document.documentElement.scrollWidth;
      const winW = window.innerWidth;
      const hasOverflow = docW > winW;
      
      const overflowingElements = [];
      if (hasOverflow) {
        const all = document.querySelectorAll('*');
        for (const el of all) {
          const rect = el.getBoundingClientRect();
          if (rect.right > winW + 1 || rect.left < -1) {
            overflowingElements.push({
              tag: el.tagName,
              id: el.id,
              className: (el.className || '').toString().slice(0, 80),
              right: rect.right,
              left: rect.left,
              width: rect.width
            });
          }
        }
      }
      return { hasOverflow, docW, winW, overflowingCount: overflowingElements.length, samples: overflowingElements.slice(0, 8) };
    });

    report[vp.name] = overflowInfo;
    console.log(`Overflow check: ${overflowInfo.hasOverflow ? 'FAIL' : 'PASS'} (scrollWidth: ${overflowInfo.docW}, winWidth: ${overflowInfo.winW})`);
    if (overflowInfo.hasOverflow) {
      console.log('Sample overflowing elements:', overflowInfo.samples);
    }

    // 2. Capture Navbar / Header
    const hdrShot = path.join(outDir, `${vp.name}-navbar.png`);
    await page.screenshot({ path: hdrShot, clip: { x: 0, y: 0, width: vp.width, height: 160 } });

    if (vp.name === 'mobile') {
      const hamburger = page.locator('.hdr__hamburger');
      if (await hamburger.count() > 0) {
        await hamburger.click();
        await page.waitForTimeout(400);
        const drawerShot = path.join(outDir, 'mobile-navbar-drawer.png');
        await page.screenshot({ path: drawerShot, fullPage: false });
        // Close drawer via Escape key
        await page.keyboard.press('Escape');
        await page.waitForTimeout(400);
      }
    }

    // 3. Capture Sections
    for (const secId of SECTIONS) {
      const locator = page.locator(`section#${secId}`);
      if (await locator.count() > 0) {
        await page.evaluate((id) => {
          window.location.hash = `#${id}`;
        }, secId);
        await page.waitForTimeout(800);
        const secShot = path.join(outDir, `${vp.name}-${secId}.png`);
        await locator.screenshot({ path: secShot }).catch(err => console.log(`Failed screenshot #${secId}:`, err.message));
      }
    }

    await context.close();
  }

  await browser.close();

  fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2), 'utf8');
  console.log('\nResponsive Audit Finished! Report saved to public/qa-responsive/report.json');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
