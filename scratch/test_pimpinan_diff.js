module.paths.push('c:/laragon/www/ppdny/server/node_modules');
const puppeteer = require('puppeteer');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const crypto = require('crypto');
require('dotenv').config({ path: 'c:/laragon/www/ppdny/server/.env' });
const prisma = require('c:/laragon/www/ppdny/server/src/config/prisma');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  
  const user = await prisma.users.findFirst({
    where: { user_role: { some: { role: { role: 'pimpinan' } } } }
  });
  const token = jwt.sign({ id: user.id, nama: user.nama, role: 'pimpinan' }, process.env.JWT_SECRET);

  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.evaluate((t, u) => {
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
  }, token, user);

  // Screen 1: Dashboard
  await page.goto('http://localhost:5173/pimpinan', { waitUntil: 'networkidle2' });
  await page.waitForFunction(() => !document.body.innerText.includes('Memverifikasi Sesi') && document.querySelectorAll('.animate-spin').length === 0, { timeout: 10000 });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'scratch/pimpinan_dash_mobile.webp', type: 'webp', quality: 90 });

  // Screen 2: Data Santri
  await page.goto('http://localhost:5173/pimpinan/data-santri', { waitUntil: 'networkidle2' });
  await page.waitForFunction(() => !document.body.innerText.includes('Memverifikasi Sesi') && document.querySelectorAll('.animate-spin').length === 0, { timeout: 10000 });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'scratch/pimpinan_santri_mobile.webp', type: 'webp', quality: 90 });

  const buf1 = fs.readFileSync('scratch/pimpinan_dash_mobile.webp');
  const buf2 = fs.readFileSync('scratch/pimpinan_santri_mobile.webp');
  const h1 = crypto.createHash('md5').update(buf1).digest('hex');
  const h2 = crypto.createHash('md5').update(buf2).digest('hex');

  console.log('Dashboard size:', buf1.length, 'hash:', h1);
  console.log('Santri size:', buf2.length, 'hash:', h2);
  console.log('Are they different?', h1 !== h2 ? 'YES! DISTINCT!' : 'NO, DUPLICATE!');

  await browser.close();
  await prisma.$disconnect();
})();
