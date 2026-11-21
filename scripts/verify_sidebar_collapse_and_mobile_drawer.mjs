import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Fadli/.gemini/antigravity/brain/50f5e0f8-9630-460d-89f0-e2faae1ceb86/nav_audit';

async function verifySidebar() {
  const browser = await chromium.launch({ channel: 'chrome' });

  // 1. Desktop Test (1440x960)
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

  // Click collapse toggle button in header
  const collapseBtn = page.locator('button[aria-label="Persempit Sidebar"]');
  if (await collapseBtn.isVisible()) {
    await collapseBtn.click();
    await page.waitForTimeout(600);
  }

  // Hover over the Studi Kasus icon to test floating tooltip
  const iconBtn = page.locator('button:has(svg.lucide-folder-git-2)');
  if (await iconBtn.isVisible()) {
    await iconBtn.hover();
    await page.waitForTimeout(400);
  }

  const file64 = path.join(ARTIFACT_DIR, '64_admin_desktop_sidebar_collapsed_icon_rail.png');
  await page.screenshot({ path: file64, fullPage: false });
  console.log('Saved 64:', file64);

  // 2. Mobile Test (390x844) with smooth drawer animation
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
  await mobilePage.goto(`http://localhost:${port}/admin`, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);

  // Click hamburger toggle to slide drawer from left
  const hamburger = mobilePage.locator('button[aria-label="Buka Menu Admin"]');
  await hamburger.click();
  // Wait mid-transition or open
  await mobilePage.waitForTimeout(500);

  const file65 = path.join(ARTIFACT_DIR, '65_admin_mobile_smooth_drawer_sliding.png');
  await mobilePage.screenshot({ path: file65, fullPage: false });
  console.log('Saved 65:', file65);

  await browser.close();
}

verifySidebar().catch(console.error);
