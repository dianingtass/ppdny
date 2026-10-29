module.paths.push('c:/laragon/www/ppdny/server/node_modules');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'c:/laragon/www/ppdny/server/.env' });
const prisma = require('c:/laragon/www/ppdny/server/src/config/prisma');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';
const DOCS_DIR = path.resolve('c:/laragon/www/ppdny/client/public/docs');

if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
}

(async () => {
  console.log('Testing PDF generation for Admin Guidebook...');

  const user = await prisma.users.findFirst({
    where: { user_role: { some: { role: { role: 'admin' } } } }
  });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: 'admin', nama: user.nama, nip: user.nip },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // Set auth on landing page
  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(({ t, u }) => {
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
  }, { t: token, u: user });

  // Navigate to admin guidebook
  console.log('Navigating to /admin/guidebook ...');
  await page.goto(`${BASE_URL}/admin/guidebook`, { waitUntil: 'networkidle2' });

  // Wait for markdown to load and parse
  await page.waitForSelector('main section', { timeout: 15000 });
  console.log('Main content loaded. Waiting for all images to complete loading...');

  await page.waitForFunction(() => {
    const imgs = Array.from(document.querySelectorAll('main img'));
    return imgs.length > 0 && imgs.every(img => img.complete && img.naturalWidth > 0);
  }, { timeout: 30000 }).catch(e => console.warn('Some images still loading or fallback:', e.message));

  await new Promise(r => setTimeout(r, 2000));

  // Inject print styles so that Layout's overflow-hidden and h-screen don't clip printing
  await page.addStyleTag({
    content: `
      @media print {
        html, body, #root, div, main {
          overflow: visible !important;
          height: auto !important;
          min-height: 0 !important;
          max-height: none !important;
        }
        header, aside, .print\\:hidden {
          display: none !important;
        }
        main {
          padding: 0 !important;
          margin: 0 !important;
          border: none !important;
          box-shadow: none !important;
          width: 100% !important;
          max-width: 100% !important;
        }
        section {
          break-inside: avoid;
          page-break-inside: avoid;
          margin-bottom: 24px !important;
        }
      }
    `
  });

  // Emulate print media
  await page.emulateMediaType('print');

  const pdfPath = path.join(DOCS_DIR, 'Panduan_SIM-Tren_Admin.pdf');
  console.log('Generating PDF to:', pdfPath);

  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '22mm',
      bottom: '20mm',
      left: '15mm',
      right: '15mm'
    },
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="font-size: 8px; color: #4b5563; width: 100%; border-bottom: 1px solid #d1d5db; padding: 0 15mm 4px 15mm; display: flex; justify-content: space-between; font-family: sans-serif;">
        <span style="font-weight: bold; color: #166534;">SIM-TREN PPDNY — Buku Panduan Administrator Sistem</span>
        <span>Pondok Pesantren Darun-Na'im Yapia</span>
      </div>
    `,
    footerTemplate: `
      <div style="font-size: 8px; color: #6b7280; width: 100%; border-top: 1px solid #e5e7eb; padding: 4px 15mm 0 15mm; display: flex; justify-content: space-between; font-family: sans-serif;">
        <span>Dokumen Panduan Resmi SIM-Tren</span>
        <span>Halaman <span class="pageNumber"></span> dari <span class="totalPages"></span></span>
      </div>
    `
  });

  const stats = fs.statSync(pdfPath);
  console.log(`🎉 PDF generated successfully! Size: ${stats.size} bytes (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

  await browser.close();
  await prisma.$disconnect();
})();
