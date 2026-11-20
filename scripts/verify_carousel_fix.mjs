import { chromium } from 'playwright';

async function verifyCarousel() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' })
    .catch(() => chromium.launch({ headless: true, channel: 'msedge' }));

  const viewports = [
    { name: 'desktop_1440', width: 1440, height: 900 },
    { name: 'mobile_390', width: 390, height: 844 },
  ];

  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();

    console.log(`[${vp.name}] Navigating to http://localhost:3000/#coursework ...`);
    await page.goto('http://localhost:3000/#coursework', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Scroll to carousel
    await page.evaluate(() => {
      const carousel = document.querySelector('.flex-carousel');
      if (carousel) carousel.scrollIntoView({ block: 'center' });
    });
    await page.waitForTimeout(1500);

    const outPath = `C:/Users/Fadli/.gemini/antigravity/brain/50f5e0f8-9630-460d-89f0-e2faae1ceb86/nav_audit/28_carousel_${vp.name}.png`;
    console.log(`[${vp.name}] Capturing screenshot to ${outPath} ...`);
    await page.screenshot({ path: outPath });

    await context.close();
  }

  await browser.close();
  console.log('Verification completed!');
}

verifyCarousel().catch(console.error);
