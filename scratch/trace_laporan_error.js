module.paths.push('c:/laragon/www/ppdny/server/node_modules');
const puppeteer = require('puppeteer');
const jwt = require('jsonwebtoken');
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

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  page.on('response', res => {
    if (res.status() >= 400) {
      console.log(`[HTTP ERROR] ${res.status()} ${res.request().method()} ${res.url()}`);
    }
  });

  page.on('console', msg => {
    if (msg.text().includes('Token') || msg.text().includes('Login') || msg.type() === 'error') {
      console.log(`[CONSOLE] ${msg.text()}`);
    }
  });

  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(({ t, u }) => {
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
  }, { t: token, u: userObj });

  console.log('Visiting /timkesehatan/daftarAbsensiKamar/1/create');
  await page.goto(`${BASE_URL}/timkesehatan/daftarAbsensiKamar/1/create`, { waitUntil: 'networkidle2' });
  console.log('Current URL after create:', page.url());

  console.log('Visiting /timkesehatan/daftarAbsensiKamar/1/laporan');
  await page.goto(`${BASE_URL}/timkesehatan/daftarAbsensiKamar/1/laporan`, { waitUntil: 'networkidle2' });
  console.log('Current URL after laporan:', page.url());

  await browser.close();
  process.exit(0);
})().catch(e => {
  console.error(e);
  process.exit(1);
});
