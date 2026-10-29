module.paths.push('c:/laragon/www/ppdny/server/node_modules');
const puppeteer = require('puppeteer');
const http = require('http');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'c:/laragon/www/ppdny/server/.env' });
const prisma = require('c:/laragon/www/ppdny/server/src/config/prisma');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';

const rolesConfig = [
  { role: 'admin', route: '/admin/guidebook', filename: 'Panduan_SIM-Tren_Admin.pdf' },
  { role: 'pengurus', route: '/pengurus/guidebook', filename: 'Panduan_SIM-Tren_Pengurus.pdf' },
  { role: 'pimpinan', route: '/pimpinan/guidebook', filename: 'Panduan_SIM-Tren_Pimpinan.pdf' },
  { role: 'santri', route: '/santri/guidebook', filename: 'Panduan_SIM-Tren_Santri.pdf' },
  { role: 'timkesehatan', route: '/timkesehatan/guidebook', filename: 'Panduan_SIM-Tren_Tim_Kesehatan.pdf' },
  { role: 'orangtua', route: '/orangtua/guidebook', filename: 'Panduan_SIM-Tren_Orang_Tua.pdf' },
  { role: 'ustadz', route: '/ustadz/guidebook', filename: 'Panduan_SIM-Tren_Ustadz.pdf' },
  { role: 'ppdb', route: '/ppdb/guidebook', filename: 'Panduan_SIM-Tren_PPDB.pdf', isPublic: true }
];

function checkPdfUrl(filename) {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}/docs/${filename}`, (res) => {
      resolve({
        statusCode: res.statusCode,
        contentType: res.headers['content-type'],
        contentLength: res.headers['content-length']
      });
    }).on('error', reject);
  });
}

async function runVerification() {
  console.log('=== VERIFYING GUIDEBOOKS, PDF DOWNLOADS & NAVIGATION ===\n');

  // Step 1: Check HTTP static serving of all 8 PDFs
  console.log('--- Checking HTTP 200 for all 8 PDFs in /docs/... ---');
  for (const cfg of rolesConfig) {
    const res = await checkPdfUrl(cfg.filename);
    console.log(`  [PDF HTTP] ${cfg.filename} => Status: ${res.statusCode} | Type: ${res.contentType} | Size: ${res.contentLength} bytes`);
    if (res.statusCode !== 200) {
      console.error(`  ❌ ERROR: ${cfg.filename} returned status ${res.statusCode}!`);
    }
  }

  // Step 2: Browser test for each guidebook UI
  console.log('\n--- Checking UI DOM, Unduh PDF Button, & Back Navigation in Browser ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  for (const cfg of rolesConfig) {
    if (!cfg.isPublic) {
      const user = await prisma.users.findFirst({
        where: { user_role: { some: { role: { role: cfg.role } } } }
      });
      const token = jwt.sign(
        { id: user.id, email: user.email, role: cfg.role, nama: user.nama, nip: user.nip },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
      await page.evaluate(({ t, u }) => {
        localStorage.setItem('token', t);
        localStorage.setItem('user', JSON.stringify(u));
      }, { t: token, u: user });
    }

    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    await page.goto(`${BASE_URL}${cfg.route}`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 600));

    const check = await page.evaluate((expectedFilename) => {
      const downloadBtn = document.querySelector(`a[href*="${expectedFilename}"]`);
      const printBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Cetak'));
      const backBtn = document.querySelector('header button[title*="Kembali"]') || document.querySelector('header button');

      return {
        hasDownloadBtn: !!downloadBtn,
        downloadHref: downloadBtn ? downloadBtn.getAttribute('href') : null,
        hasPrintBtn: !!printBtn,
        hasBackBtn: !!backBtn,
        title: document.title,
        heading: document.querySelector('header h1')?.innerText
      };
    }, cfg.filename);

    console.log(`\n  Role: ${cfg.role.toUpperCase()}`);
    console.log(`    Header Title: "${check.heading}"`);
    console.log(`    Has 'Unduh PDF' button: ${check.hasDownloadBtn ? '✅ YES (' + check.downloadHref + ')' : '❌ NO'}`);
    console.log(`    Has 'Cetak' button: ${check.hasPrintBtn ? '✅ YES' : '❌ NO'}`);
    console.log(`    Has 'Kembali' button: ${check.hasBackBtn ? '✅ YES' : '❌ NO'}`);

    if (errors.length > 0) {
      console.error(`    ❌ JS Errors:`, errors);
    }

    // Special test: Click back button on timkesehatan to confirm it doesn't 404
    if (cfg.role === 'timkesehatan') {
      console.log('    Testing Timkes back button navigation...');
      await page.click('header button[title*="Kembali"]');
      await new Promise(r => setTimeout(r, 1000));
      const currentUrl = page.url();
      const notFound = await page.evaluate(() => document.body.innerText.includes('404') || document.body.innerText.includes('Halaman Tidak Ditemukan'));
      console.log(`    After click back => URL: ${currentUrl} | 404 Page: ${notFound ? '❌ YES (FAILED)' : '✅ NO (PASSED)'}`);
    }
  }

  await browser.close();
  await prisma.$disconnect();
  console.log('\n=== ALL VERIFICATIONS FINISHED ===');
}

runVerification().catch(err => {
  console.error('Fatal Verification Error:', err);
  process.exit(1);
});
