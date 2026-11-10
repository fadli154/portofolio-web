const { chromium } = require('playwright');
const path = require('path');

async function main() {
  const browser = await chromium.launch({ 
    headless: true,
    channel: 'msedge'
  }).catch(() => chromium.launch({ headless: true, channel: 'chrome' }));
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  // 1. Capture #certificates
  console.log('Capturing #certificates...');
  const certSec = page.locator('section#certificates');
  await certSec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  const certScreenshot = path.join(__dirname, '../public/qa-certificates.png');
  await certSec.screenshot({ path: certScreenshot });
  console.log('Certificates screenshot saved to', certScreenshot);

  // 2. Capture #coursework
  console.log('Capturing #coursework...');
  const courseworkSec = page.locator('section#coursework');
  await courseworkSec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);
  const courseworkScreenshot = path.join(__dirname, '../public/qa-coursework.png');
  await courseworkSec.screenshot({ path: courseworkScreenshot });
  console.log('Coursework screenshot saved to', courseworkScreenshot);

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
