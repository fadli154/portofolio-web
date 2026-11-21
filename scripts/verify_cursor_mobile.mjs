import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Fadli/.gemini/antigravity/brain/50f5e0f8-9630-460d-89f0-e2faae1ceb86/nav_audit';

async function testMobile() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
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
  let port = 3001;
  try {
    await page.goto('http://localhost:3001/admin', { waitUntil: 'networkidle', timeout: 5000 });
  } catch {
    port = 3000;
    await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });
  }

  await page.waitForTimeout(1000);

  const collabCard = page.locator('.magic-bento__collab');
  await collabCard.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  const file61 = path.join(ARTIFACT_DIR, '61_cursor_mobile_idle_motion.png');
  await collabCard.screenshot({ path: file61 });
  console.log('Saved 61 (Mobile Collab Visual):', file61);

  await browser.close();
}

testMobile().catch(console.error);
