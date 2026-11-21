import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Fadli/.gemini/antigravity/brain/50f5e0f8-9630-460d-89f0-e2faae1ceb86/nav_audit';
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function run() {
  const browser = await chromium.launch({ channel: 'chrome' });

  // Desktop (1440x960)
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

  // 1. Overview Tab (Clean Spacing & Simplified Typography)
  const file49 = path.join(ARTIFACT_DIR, '49_admin_bento_overview_clean_spacing.png');
  await page.screenshot({ path: file49, fullPage: false });
  console.log('Saved:', file49);

  // 2. Click Certificates Tab (Direct Image Preview)
  await page.locator('nav, header').locator('button:has-text("Sertifikat")').first().click();
  await page.waitForTimeout(1000);
  const file46 = path.join(ARTIFACT_DIR, '46_admin_bento_certificates_with_photos.png');
  await page.screenshot({ path: file46, fullPage: false });
  console.log('Saved:', file46);

  // 3. Click Coursework Tab (Direct Attendance Proof Photos)
  await page.locator('nav, header').locator('button:has-text("Coursework K-1")').first().click();
  await page.waitForTimeout(1000);
  const file47 = path.join(ARTIFACT_DIR, '47_admin_bento_coursework_with_proof_photos.png');
  await page.screenshot({ path: file47, fullPage: false });
  console.log('Saved:', file47);

  // 4. Click Projects Tab (Direct Project Screenshots)
  await page.locator('nav, header').locator('button:has-text("Studi Kasus")').first().click();
  await page.waitForTimeout(1000);
  const file48 = path.join(ARTIFACT_DIR, '48_admin_bento_projects_with_screenshots.png');
  await page.screenshot({ path: file48, fullPage: false });
  console.log('Saved:', file48);

  // 5. Mobile Viewport (390x844)
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

  // Open mobile drawer and click certificates
  const menuBtn = await mobilePage.locator('button[aria-label*="Menu"]').first();
  if (menuBtn) {
    await menuBtn.click();
    await mobilePage.waitForTimeout(500);
    const certDrawerBtn = await mobilePage.locator('button:has-text("Sertifikat & Prestasi")').first();
    if (certDrawerBtn) {
      await certDrawerBtn.click();
      await mobilePage.waitForTimeout(1000);
    }
  }

  const file50 = path.join(ARTIFACT_DIR, '50_admin_bento_mobile_photos.png');
  await mobilePage.screenshot({ path: file50, fullPage: false });
  console.log('Saved:', file50);

  await browser.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
