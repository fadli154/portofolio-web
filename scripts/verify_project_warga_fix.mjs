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
  await page.waitForTimeout(1000);

  // Click Studi Kasus tab
  await page.locator('nav, header').locator('button:has-text("Studi Kasus")').first().click();
  await page.waitForTimeout(1000);

  const file54 = path.join(ARTIFACT_DIR, '54_admin_projects_warga_kopmas_fixed.png');
  await page.screenshot({ path: file54, fullPage: false });
  console.log('Saved:', file54);

  await browser.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
