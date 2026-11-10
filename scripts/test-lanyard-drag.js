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
  await page.waitForTimeout(3000);

  // 1. Capture Hero at rest
  const heroSec = page.locator('section').first();
  const restScreenshot = path.join(__dirname, '../public/qa-lanyard-rest.png');
  await heroSec.screenshot({ path: restScreenshot });
  console.log('Saved resting hero screenshot to', restScreenshot);

  // 2. Simulate dragging the lanyard down towards terminal
  // The card is approximately around (1008, 420)
  console.log('Simulating drag on lanyard card...');
  await page.mouse.move(1010, 420);
  await page.waitForTimeout(300);
  await page.mouse.down();
  await page.waitForTimeout(100);
  // Drag down by 260px into the terminal region
  await page.mouse.move(1010, 680, { steps: 20 });
  await page.waitForTimeout(600);

  const dragScreenshot = path.join(__dirname, '../public/qa-lanyard-dragged.png');
  await heroSec.screenshot({ path: dragScreenshot });
  console.log('Saved dragged lanyard screenshot to', dragScreenshot);

  await page.mouse.up();
  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

