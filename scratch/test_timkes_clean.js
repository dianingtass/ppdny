module.paths.push('c:/laragon/www/ppdny/server/node_modules');
const puppeteer = require('puppeteer');
const jwt = require('jsonwebtoken');
const fs = require('fs');
require('dotenv').config({ path: 'c:/laragon/www/ppdny/server/.env' });

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';

const token = jwt.sign(
  { id: 10, email: 'timkes@ppdny.id', role: 'timkesehatan', nama: 'Ns. Kartika', nip: 'TKS002' },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

const userObj = {
  id: 10,
  nama: 'Ns. Kartika',
  email: 'timkes@ppdny.id',
  role: 'timkesehatan',
  nip: 'TKS002'
};

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const device of ['desktop', 'mobile']) {
    console.log(`\n=== Testing ${device.toUpperCase()} ===`);
    const page = await browser.newPage();
    if (device === 'mobile') {
      await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    } else {
      await page.setViewport({ width: 1280, height: 800 });
    }

    // Set auth on landing page (avoiding /login cleanup)
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(({ t, u }) => {
      localStorage.setItem('token', t);
      localStorage.setItem('user', JSON.stringify(u));
    }, { t: token, u: userObj });

    const testRoutes = [
      '/timkesehatan',
      '/timkesehatan/daftarSantriScreening',
      '/timkesehatan/daftarAbsensiKamar/1/laporan',
      '/timkesehatan/konsultasi',
      '/timkesehatan/manageMateri',
      '/timkesehatan/profil'
    ];

    for (const r of testRoutes) {
      await page.goto(`${BASE_URL}${r}`, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => {
        const isVerifying = document.body.innerText.includes('Memverifikasi Sesi');
        const hasSpinners = document.querySelectorAll('.animate-spin').length > 0;
        const isLogin = window.location.pathname === '/login';
        const hasMain = document.querySelector('main') !== null || document.querySelector('form') !== null;
        return !isVerifying && !hasSpinners && hasMain && !isLogin;
      }, { timeout: 15000 }).catch(() => {});

      await new Promise(res => setTimeout(res, 1200));

      if (device === 'mobile') {
        await page.evaluate(() => {
          const overlay = document.querySelector('.fixed.inset-0.bg-black\\/50') || document.querySelector('[class*="bg-black"]');
          if (overlay) overlay.click();
        }).catch(() => {});
        await new Promise(res => setTimeout(res, 400));
      }

      const curUrl = page.url();
      const text = await page.evaluate(() => document.body.innerText.substring(0, 100));
      console.log(`Route ${r} -> URL: ${curUrl} | Text: ${text.replace(/\n/g, ' ')}`);
    }

    await page.close();
  }

  await browser.close();
  process.exit(0);
})().catch(e => {
  console.error(e);
  process.exit(1);
});
