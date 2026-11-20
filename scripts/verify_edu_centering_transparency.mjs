import { chromium } from 'playwright';

async function verifyEducation() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' })
    .catch(() => chromium.launch({ headless: true, channel: 'msedge' }));

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000/#education ...');
  await page.goto('http://localhost:3000/#education', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // 1. Check at arrival / initial state (scrollProgress = 0)
  const initialMetrics = await page.evaluate(() => {
    const section = document.getElementById('education');
    const header = section?.querySelector('h2');
    const ditherCanvas = section?.querySelector('.dither-veil canvas');
    const ditherContainer = section?.querySelector('.dither-veil');
    const cards = section?.querySelector('.card-swap-container') || section?.querySelector('[class*="CardSwap"]');

    if (!header || !ditherCanvas) return null;

    const hRect = header.getBoundingClientRect();
    const dRect = ditherCanvas.getBoundingClientRect();
    const hCenter = hRect.left + hRect.width / 2;
    const dCenter = dRect.left + dRect.width / 2;

    return {
      hCenter,
      dCenter,
      diff: Math.abs(hCenter - dCenter),
      windowWidth: window.innerWidth,
    };
  });

  console.log('Initial Alignment Metrics:', initialMetrics);

  const initialShot = 'C:/Users/Fadli/.gemini/antigravity/brain/50f5e0f8-9630-460d-89f0-e2faae1ceb86/nav_audit/29_edu_dither_centered_start.png';
  await page.screenshot({ path: initialShot });
  console.log('Saved initial shot:', initialShot);

  // 2. Scroll into the section slightly (e.g. 500px) so shiftProgress moves Dither to left and reveals cards
  console.log('Scrolling down 600px into education section...');
  await page.evaluate(() => {
    window.scrollBy(0, 600);
  });
  await page.waitForTimeout(1000);

  const scrolledShot = 'C:/Users/Fadli/.gemini/antigravity/brain/50f5e0f8-9630-460d-89f0-e2faae1ceb86/nav_audit/30_edu_dither_shifted_cards_active.png';
  await page.screenshot({ path: scrolledShot });
  console.log('Saved scrolled shot:', scrolledShot);

  // 3. Scroll to coursework to verify carousel bottom is not clipped
  console.log('Scrolling to coursework section...');
  await page.evaluate(() => {
    const el = document.getElementById('coursework');
    if (el) el.scrollIntoView({ block: 'center' });
  });
  await page.waitForTimeout(1500);

  const courseworkShot = 'C:/Users/Fadli/.gemini/antigravity/brain/50f5e0f8-9630-460d-89f0-e2faae1ceb86/nav_audit/31_coursework_unclipped.png';
  await page.screenshot({ path: courseworkShot });
  console.log('Saved coursework shot:', courseworkShot);

  await browser.close();
  console.log('All verification captures completed successfully!');
}

verifyEducation().catch(console.error);
