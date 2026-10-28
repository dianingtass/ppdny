module.paths.push('c:/laragon/www/ppdny/server/node_modules');
const puppeteer = require('puppeteer');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'c:/laragon/www/ppdny/server/.env' });

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';

const token = jwt.sign(
  {
    id: 10,
    email: 'timkes@ppdny.id',
    role: 'timkesehatan',
    nama: 'Ns. Kartika',
    nip: 'TKS002'
  },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded' });
  await page.evaluate((tok) => {
    localStorage.setItem('token', tok);
    localStorage.setItem('user', JSON.stringify({ id: 10, role: 'timkesehatan', nama: 'Ns. Kartika', nip: 'TKS002' }));
  }, token);

  const testUrls = [
    '/timkesehatan',
    '/timkesehatan/profil',
    '/timkesehatan/konsultasi',
    '/timkesehatan/daftarAbsensiKamar/1/laporan'
  ];

  for (const u of testUrls) {
    await page.goto(`${BASE_URL}${u}`, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2000));
    const currentUrl = page.url();
    const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 100));
    console.log(`Requested: ${u} -> Actual URL: ${currentUrl} | Snippet: ${bodyText.replace(/\n/g, ' ')}`);
  }

  await browser.close();
  process.exit(0);
})().catch(e => {
  console.error(e);
  process.exit(1);
});
