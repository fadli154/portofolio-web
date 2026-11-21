import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Fadli/.gemini/antigravity/brain/50f5e0f8-9630-460d-89f0-e2faae1ceb86/nav_audit';
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function run() {
  const browser = await chromium.launch({ channel: 'chrome' });

  // 1. Desktop Viewport (1440x960)
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
  await page.waitForTimeout(1500);

  // Desktop screenshot showing BranchedMenu sidebar with Title, Modules, Website, Logout, and no Supabase pill
  const file55 = path.join(ARTIFACT_DIR, '55_admin_branched_menu_desktop.png');
  await page.screenshot({ path: file55, fullPage: false });
  console.log('Saved 55:', file55);

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

  // Click hamburger button to open drawer
  const hamburger = mobilePage.locator('button[aria-label*="Menu"]');
  if (await hamburger.isVisible()) {
    await hamburger.click();
    await mobilePage.waitForTimeout(800);
  }

  const file56 = path.join(ARTIFACT_DIR, '56_admin_branched_menu_mobile_drawer.png');
  await mobilePage.screenshot({ path: file56, fullPage: false });
  console.log('Saved 56:', file56);

  await browser.close();
  console.log('Verification script completed successfully.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
