module.paths.push('c:/laragon/www/ppdny/server/node_modules');
const puppeteer = require('puppeteer');
const jwt = require('jsonwebtoken');
require('c:/laragon/www/ppdny/server/src/config/prisma');
const secret = process.env.JWT_SECRET || 'your-secret-key';

const token = jwt.sign(
  { id: 1, email: 'admin@ppdny.id', role: 'admin', nama: 'Bagus Santoso', nip: 'ADM001' },
  secret,
  { expiresIn: '7d' }
);
const userObj = { id: 1, nama: 'Bagus Santoso', email: 'admin@ppdny.id', role: 'admin', nip: 'ADM001' };

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new'
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  await page.goto('http://localhost:5173/login', { waitUntil: 'domcontentloaded' });
  await page.evaluate(({ t, u }) => {
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
  }, { t: token, u: userObj });

  console.log('Navigating to /admin...');
  await page.goto('http://localhost:5173/admin', { waitUntil: 'domcontentloaded' });

  console.log('Waiting for real content...');
  await page.waitForFunction(() => {
    const isVerifying = document.body.innerText.includes('Memverifikasi Sesi');
    const hasSpinners = document.querySelectorAll('.animate-spin').length > 0;
    const hasMain = document.querySelector('main') !== null;
    return !isVerifying && !hasSpinners && hasMain;
  }, { timeout: 15000 });

  await new Promise(r => setTimeout(r, 1200));

  await page.evaluate(() => {
    const overlay = document.querySelector('.fixed.inset-0.bg-black\\/50') || document.querySelector('[class*="bg-black"]');
    if (overlay) overlay.click();
  }).catch(() => {});
  await new Promise(r => setTimeout(r, 400));

  console.log('Taking screenshot...');
  await page.screenshot({ path: 'scratch/test_fixed_mobile_admin.webp', type: 'webp', quality: 90 });
  console.log('Saved scratch/test_fixed_mobile_admin.webp');

  await browser.close();
  process.exit(0);
})().catch(e => {
  console.error(e);
  process.exit(1);
});
