import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Fadli/.gemini/antigravity/brain/50f5e0f8-9630-460d-89f0-e2faae1ceb86/nav_audit';
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function run() {
  const browser = await chromium.launch({ channel: 'chrome' });

  // Desktop
  const context = await browser.newContext({
    viewport: { width: 1440, height: 960 },
  });
  await context.addCookies([
    {
      name: 'fadli_admin_auth',
      value: 'authenticated',
      domain: 'localhost',
      path: '/',
    },
  ]);

  const page = await context.newPage();
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Take full overview screenshot
  const file39 = path.join(ARTIFACT_DIR, '39_magic_bento_mint_desktop.png');
  await page.screenshot({ path: file39, fullPage: false });
  console.log('Saved:', file39);

  // Hover over the first card to activate mint spotlight and particle stars
  const card = await page.$('.magic-bento__card');
  if (card) {
    const box = await card.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(600);
    }
  }

  const file40 = path.join(ARTIFACT_DIR, '40_magic_bento_mint_hover.png');
  await page.screenshot({ path: file40, fullPage: false });
  console.log('Saved:', file40);

  // Mobile
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
  });
  await mobileContext.addCookies([
    {
      name: 'fadli_admin_auth',
      value: 'authenticated',
      domain: 'localhost',
      path: '/',
    },
  ]);
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);

  const file41 = path.join(ARTIFACT_DIR, '41_magic_bento_mint_mobile.png');
  await mobilePage.screenshot({ path: file41, fullPage: false });
  console.log('Saved:', file41);

  await browser.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
