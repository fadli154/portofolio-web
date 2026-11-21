import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Fadli/.gemini/antigravity/brain/50f5e0f8-9630-460d-89f0-e2faae1ceb86/nav_audit';

async function testCursor() {
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
  // Using port 3001 or 3000 depending on whichever is listening
  let port = 3001;
  try {
    await page.goto('http://localhost:3001/admin', { waitUntil: 'networkidle', timeout: 5000 });
  } catch {
    port = 3000;
    await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' });
  }

  await page.waitForTimeout(1000);

  // Locate the collaboration well in the Inbox card
  const collabCard = page.locator('.magic-bento__collab');
  await collabCard.scrollIntoViewIfNeeded();

  // Snapshot 1: Idle frame A (without hovering)
  const file58 = path.join(ARTIFACT_DIR, '58_cursor_idle_frame_a.png');
  await collabCard.screenshot({ path: file58 });
  console.log('Saved 58 (Idle Frame A):', file58);

  // Wait 1.8 seconds for cursors to wander along their paths
  await page.waitForTimeout(1800);

  // Snapshot 2: Idle frame B (without hovering - cursors have wandered to new positions & clicked)
  const file59 = path.join(ARTIFACT_DIR, '59_cursor_idle_frame_b.png');
  await collabCard.screenshot({ path: file59 });
  console.log('Saved 59 (Idle Frame B):', file59);

  // Snapshot 3: Click inside the collab area to verify interactive ripple & click
  await collabCard.click({ position: { x: 120, y: 70 } });
  await page.waitForTimeout(180);

  const file60 = path.join(ARTIFACT_DIR, '60_cursor_interactive_click_ripple.png');
  await collabCard.screenshot({ path: file60 });
  console.log('Saved 60 (User Click Ripple):', file60);

  await browser.close();
}

testCursor().catch((err) => {
  console.error(err);
  process.exit(1);
});
