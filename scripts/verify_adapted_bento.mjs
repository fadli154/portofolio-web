import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Fadli/.gemini/antigravity/brain/50f5e0f8-9630-460d-89f0-e2faae1ceb86/nav_audit';
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function run() {
  const browser = await chromium.launch({ channel: 'chrome' });

  // Desktop Viewport
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
  await page.waitForTimeout(1200);

  // 1. Overview screenshot showing the adapted cards
  const file51 = path.join(ARTIFACT_DIR, '51_admin_adapted_overview_fadli_kopmas_education.png');
  await page.screenshot({ path: file51, fullPage: false });
  console.log('Saved:', file51);

  // 2. Mobile Viewport (390x844)
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
  await mobilePage.waitForTimeout(1200);

  const file52 = path.join(ARTIFACT_DIR, '52_admin_adapted_mobile_overview.png');
  await mobilePage.screenshot({ path: file52, fullPage: false });
  console.log('Saved:', file52);

  await browser.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
