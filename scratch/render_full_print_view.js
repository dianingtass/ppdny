module.paths.push('c:/laragon/www/ppdny/server/node_modules');
const puppeteer = require('puppeteer');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'c:/laragon/www/ppdny/server/.env' });
const prisma = require('c:/laragon/www/ppdny/server/src/config/prisma');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1000, height: 1200 });

  const user = await prisma.users.findFirst({
    where: { user_role: { some: { role: { role: 'admin' } } } }
  });
  const token = jwt.sign(
    { id: user.id, email: user.email, role: 'admin', nama: user.nama, nip: user.nip },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(({ t, u }) => {
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
  }, { t: token, u: user });

  await page.goto(`${BASE_URL}/admin/guidebook`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('main section', { timeout: 15000 });
  await page.waitForFunction(() => {
    const imgs = Array.from(document.querySelectorAll('main img'));
    return imgs.length > 0 && imgs.every(img => img.complete && img.naturalWidth > 0);
  }, { timeout: 25000 });

  await page.addStyleTag({
    content: `
      @media print {
        html, body, #root, div, main {
          overflow: visible !important;
          height: auto !important;
        }
        header, aside, .print\\:hidden {
          display: none !important;
        }
        main {
          padding: 0 !important;
          margin: 0 !important;
          border: none !important;
          box-shadow: none !important;
        }
      }
    `
  });

  await page.emulateMediaType('print');

  // Take screenshot of section 2 (Dashboard & Pusat Kendali)
  const sec2 = await page.$('section#dashboard');
  if (sec2) {
    await sec2.screenshot({ path: 'scratch/print_sec2_dashboard.webp', type: 'webp', quality: 90 });
    console.log('Saved print_sec2_dashboard.webp');
  }

  // Take screenshot of section 3 (Manajemen Staf)
  const sec3 = await page.$('section#staf');
  if (sec3) {
    await sec3.screenshot({ path: 'scratch/print_sec3_staf.webp', type: 'webp', quality: 90 });
    console.log('Saved print_sec3_staf.webp');
  }

  await browser.close();
  await prisma.$disconnect();
})();
