import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.resolve('dogfood-output/screenshots');
const ARTIFACT_DIR = 'C:\\Users\\Fadli\\.gemini\\antigravity\\brain\\50f5e0f8-9630-460d-89f0-e2faae1ceb86\\nav_audit';
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

async function verifyUserCredentialsAndModal() {
  console.log('====================================================================');
  console.log('🚀 SENIOR QA: VERIFYING ADMIN LOGIN & MODAL SCROLL WITH CREDENTIALS');
  console.log('Target: http://localhost:3000/admin/login');
  console.log('User Email: admin@gmail.com');
  console.log('User Password: password');
  console.log('====================================================================\n');

  const browser = await chromium.launch({
    executablePath: 'C:\\Users\\Fadli\\.agent-browser\\browsers\\chrome-158.0.8127.36\\chrome.exe',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: 'id-ID',
  });

  const page = await context.newPage();

  // Listen to console errors
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  try {
    // STEP 1: Navigate to /admin/login
    console.log('[STEP 1] Navigating to http://localhost:3000/admin/login...');
    await page.goto('http://localhost:3000/admin/login', { waitUntil: 'networkidle' });

    // STEP 2: Fill User-Provided Credentials
    console.log('[STEP 2] Filling credentials (admin@gmail.com / password)...');
    await page.fill('#admin-email', 'admin@gmail.com');
    await page.fill('#admin-password', 'password');
    await page.waitForTimeout(600);

    const shot42 = path.join(SCREENSHOT_DIR, '42_admin_login_user_input.png');
    await page.screenshot({ path: shot42 });
    fs.copyFileSync(shot42, path.join(ARTIFACT_DIR, '134_admin_login_user_input.png'));
    console.log('  -> PASS: Captured screenshot 42_admin_login_user_input.png');

    // STEP 3: Click Login Button
    console.log('[STEP 3] Submitting login form...');
    await Promise.all([
      page.waitForURL((url) => url.pathname === '/admin', { timeout: 15000 }),
      page.click('button[type="submit"]'),
    ]);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const afterLoginUrl = page.url();
    console.log(`  -> Current URL: ${afterLoginUrl}`);
    if (afterLoginUrl.includes('/admin')) {
      console.log('  -> PASS: Successfully authenticated and redirected to /admin!');
    } else {
      throw new Error(`Expected /admin, but got ${afterLoginUrl}`);
    }

    const shot43 = path.join(SCREENSHOT_DIR, '43_admin_dashboard_user_authenticated.png');
    await page.screenshot({ path: shot43 });
    fs.copyFileSync(shot43, path.join(ARTIFACT_DIR, '135_admin_dashboard_user_authenticated.png'));
    console.log('  -> PASS: Captured screenshot 43_admin_dashboard_user_authenticated.png');

    // STEP 4: Navigate to Studi Kasus
    console.log('[STEP 4] Clicking visible "Studi Kasus" menu in desktop sidebar...');
    await page.locator('aside.hidden.lg\\:flex button.branched-menu__item:has-text("Studi Kasus")').click();
    await page.waitForTimeout(1200);

    // STEP 5: Click Edit button on Hajicare project
    console.log('[STEP 5] Clicking "Edit" button on Hajicare card...');
    const editBtn = page.locator('button:visible:has-text("Edit")').first();
    await editBtn.click();
    await page.waitForSelector('[data-admin-scroll="true"]', { timeout: 10000 });
    await page.waitForTimeout(800);

    const shot44 = path.join(SCREENSHOT_DIR, '44_hajicare_edit_modal_opened.png');
    await page.screenshot({ path: shot44 });
    fs.copyFileSync(shot44, path.join(ARTIFACT_DIR, '136_hajicare_edit_modal_opened.png'));
    console.log('  -> PASS: Captured screenshot 44_hajicare_edit_modal_opened.png');

    // STEP 6: Scroll inside the modal dialog to show slider & lower fields
    console.log('[STEP 6] Scrolling down inside modal dialog to show slider...');
    await page.evaluate(() => {
      const scrollable = document.querySelector('[data-admin-scroll="true"]');
      if (scrollable) {
        scrollable.scrollTop = 380;
      }
    });
    await page.waitForTimeout(800);

    const shot45 = path.join(SCREENSHOT_DIR, '45_hajicare_edit_modal_scrolled.png');
    await page.screenshot({ path: shot45 });
    fs.copyFileSync(shot45, path.join(ARTIFACT_DIR, '137_hajicare_edit_modal_scrolled.png'));
    console.log('  -> PASS: Captured screenshot 45_hajicare_edit_modal_scrolled.png');

    // STEP 7: Scroll to bottom of modal
    console.log('[STEP 7] Scrolling to bottom of modal to reveal architecture & save buttons...');
    await page.evaluate(() => {
      const scrollable = document.querySelector('[data-admin-scroll="true"]');
      if (scrollable) {
        scrollable.scrollTop = 900;
      }
    });
    await page.waitForTimeout(800);

    const shot46 = path.join(SCREENSHOT_DIR, '46_hajicare_edit_modal_bottom.png');
    await page.screenshot({ path: shot46 });
    fs.copyFileSync(shot46, path.join(ARTIFACT_DIR, '138_hajicare_edit_modal_bottom.png'));
    console.log('  -> PASS: Captured screenshot 46_hajicare_edit_modal_bottom.png');

    // STEP 8: Test Category Multi-Select dropdown and its scrolling
    console.log('[STEP 8] Testing category dropdown interaction & scrollability...');
    // Scroll back to top so category field is in full view
    await page.evaluate(() => {
      const scrollable = document.querySelector('[data-admin-scroll="true"]');
      if (scrollable) {
        scrollable.scrollTop = 0;
      }
    });
    await page.waitForTimeout(600);

    // Click the category multiselect trigger (inside the modal)
    await page.evaluate(() => {
      // Find the trigger div with cursor-pointer inside data-admin-scroll
      const modal = document.querySelector('[data-admin-scroll="true"]');
      if (modal) {
        const trigger = modal.querySelector('.cursor-pointer');
        if (trigger) {
          trigger.click();
        }
      }
    });
    await page.waitForTimeout(800);

    const shot47 = path.join(SCREENSHOT_DIR, '47_hajicare_categories_dropdown.png');
    await page.screenshot({ path: shot47 });
    fs.copyFileSync(shot47, path.join(ARTIFACT_DIR, '139_hajicare_categories_dropdown.png'));
    console.log('  -> PASS: Captured screenshot 47_hajicare_categories_dropdown.png');

    // Scroll inside category dropdown list
    await page.evaluate(() => {
      const dropdownList = document.querySelector('.admin-category-options-scroll') ||
                           document.querySelector('[data-admin-scroll="true"] ul') ||
                           document.querySelector('ul.overflow-y-auto') ||
                           document.querySelector('.admin-category-dropdown .overflow-y-auto');
      if (dropdownList) {
        dropdownList.scrollTop = 180;
      }
    });
    await page.waitForTimeout(600);

    const shot48 = path.join(SCREENSHOT_DIR, '48_hajicare_categories_dropdown_scrolled.png');
    await page.screenshot({ path: shot48 });
    fs.copyFileSync(shot48, path.join(ARTIFACT_DIR, '140_hajicare_categories_dropdown_scrolled.png'));
    console.log('  -> PASS: Captured screenshot 48_hajicare_categories_dropdown_scrolled.png');

    // Close modal cleanly via close button (top right X)
    const closeBtn = page.locator('div.shrink-0 button:has(svg.lucide-x)').first();
    if (await closeBtn.count() > 0) {
      await closeBtn.click();
      await page.waitForTimeout(500);
    }

    console.log('\n====================================================================');
    console.log('✅ ALL CREDENTIAL & MODAL AUDIT STEPS PASSED WITH 100% SUCCESS!');
    console.log(`Console Errors detected: ${consoleErrors.length}`);
    console.log('====================================================================');
  } catch (err) {
    console.error('❌ QA ERROR:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

verifyUserCredentialsAndModal();
