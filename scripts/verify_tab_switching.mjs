import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Fadli/.gemini/antigravity/brain/50f5e0f8-9630-460d-89f0-e2faae1ceb86/nav_audit';

async function testTabs() {
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
  await page.goto('http://localhost:3001/admin', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Click Studi Kasus in BranchedMenu
  const studiKasusBtn = page.locator('button.branched-menu__item:has-text("Studi Kasus")');
  await studiKasusBtn.click();
  await page.waitForTimeout(1200);

  const file57 = path.join(ARTIFACT_DIR, '57_admin_branched_menu_projects_active.png');
  await page.screenshot({ path: file57, fullPage: false });
  console.log('Saved 57:', file57);

  await browser.close();
}

testTabs().catch(console.error);
