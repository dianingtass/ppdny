module.paths.push('c:/laragon/www/ppdny/server/node_modules');
const puppeteer = require('puppeteer');
const jwt = require('jsonwebtoken');
const fs = require('fs');
require('dotenv').config({ path: 'c:/laragon/www/ppdny/server/.env' });

const token = jwt.sign(
  { id: 10, email: 'timkes@ppdny.id', role: 'timkesehatan', nama: 'Ns. Kartika', nip: 'TKS002' },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:5173/login', { waitUntil: 'domcontentloaded' });
  await page.evaluate((tok) => {
    localStorage.setItem('token', tok);
    localStorage.setItem('user', JSON.stringify({ id: 10, role: 'timkesehatan', nama: 'Ns. Kartika', nip: 'TKS002' }));
  }, token);

  await page.goto('http://localhost:5173/timkesehatan/daftarAbsensiKamar', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    const overlay = document.querySelector('.fixed.inset-0.bg-black\\/50') || document.querySelector('[class*="bg-black"]');
    if (overlay) overlay.click();
  }).catch(() => {});
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: 'c:/laragon/www/ppdny/scratch/test_mobile_absensi.webp', type: 'webp', quality: 90 });
  const buf = fs.readFileSync('c:/laragon/www/ppdny/scratch/test_mobile_absensi.webp');
  console.log('Mobile absensi size:', buf.length);
  const text = await page.evaluate(() => document.body.innerText.substring(0, 200));
  console.log('Mobile text snippet:', text.replace(/\n/g, ' '));
  await browser.close();
  process.exit(0);
})().catch(e => {
  console.error(e);
  process.exit(1);
});
