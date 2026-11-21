import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Fadli/.gemini/antigravity/brain/50f5e0f8-9630-460d-89f0-e2faae1ceb86/nav_audit';

async function verifyClientProjects() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  await context.addCookies([
    {
      name: 'fadli_admin_auth',
      value: 'authenticated',
      domain: 'localhost',
      path: '/',
    },
  ]);

  const page = await context.newPage();
  let port = 3001;
  try {
    await page.goto('http://localhost:3001/admin', { waitUntil: 'networkidle', timeout: 5000 });
  } catch {
    port = 3000;
    await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });
  }

  await page.waitForTimeout(1000);

  // Navigate to Studi Kasus
  const studiKasusBtn = page.locator('button.branched-menu__item:has-text("Studi Kasus")');
  await studiKasusBtn.click();
  await page.waitForTimeout(1200);

  const file62 = path.join(ARTIFACT_DIR, '62_admin_projects_client_labels.png');
  await page.screenshot({ path: file62, fullPage: false });
  console.log('Saved 62:', file62);

  // Also check public project page for one of them (e.g. sign2speech)
  await page.goto(`http://localhost:${port}/projects/sign2speech`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const file63 = path.join(ARTIFACT_DIR, '63_public_sign2speech_client_context.png');
  await page.screenshot({ path: file63, fullPage: false });
  console.log('Saved 63:', file63);

  await browser.close();
}

verifyClientProjects().catch(console.error);
