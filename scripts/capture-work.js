const { chromium } = require('playwright');
const path = require('path');

async function main() {
  const browser = await chromium.launch({ 
    headless: true,
    channel: 'msedge'
  }).catch(() => chromium.launch({ headless: true, channel: 'chrome' }));
  
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5,
    colorScheme: 'dark',
  });
  const page = await context.newPage();
  
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Set theme to dark
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.add('dark');
  });
  await page.waitForTimeout(1000);

  console.log('Capturing #work in dark mode...');
  const workSec = page.locator('section#work');
  await workSec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);
  
  const screenshotPath = path.join(__dirname, '../public/qa-work-dark.png');
  await workSec.screenshot({ path: screenshotPath });
  console.log('Work screenshot saved to', screenshotPath);

  // Set theme to light
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.remove('dark');
  });
  await page.waitForTimeout(1000);

  const screenshotLightPath = path.join(__dirname, '../public/qa-work-light.png');
  await workSec.screenshot({ path: screenshotLightPath });
  console.log('Work light screenshot saved to', screenshotLightPath);

  console.log('Capturing #coursework in light mode...');
  const cwSec = page.locator('section#coursework');
  await cwSec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);
  const cwPath = path.join(__dirname, '../public/qa-coursework-clean.png');
  await cwSec.screenshot({ path: cwPath });
  console.log('Coursework screenshot saved to', cwPath);

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
