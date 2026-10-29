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

const rolesConfig = [
  {
    role: 'admin',
    title: 'Buku Panduan Administrator Sistem',
    route: '/admin/guidebook',
    filename: 'Panduan_SIM-Tren_Admin.pdf'
  },
  {
    role: 'pengurus',
    title: 'Buku Panduan Pengurus Pesantren',
    route: '/pengurus/guidebook',
    filename: 'Panduan_SIM-Tren_Pengurus.pdf'
  },
  {
    role: 'pimpinan',
    title: 'Buku Panduan Pengasuh / Pimpinan',
    route: '/pimpinan/guidebook',
    filename: 'Panduan_SIM-Tren_Pimpinan.pdf'
  },
  {
    role: 'santri',
    title: 'Buku Panduan Portal Santri',
    route: '/santri/guidebook',
    filename: 'Panduan_SIM-Tren_Santri.pdf'
  },
  {
    role: 'timkesehatan',
    title: 'Buku Panduan Tim Medis & Kesehatan',
    route: '/timkesehatan/guidebook',
    filename: 'Panduan_SIM-Tren_Tim_Kesehatan.pdf'
  },
  {
    role: 'orangtua',
    title: 'Buku Panduan Portal Orang Tua / Wali',
    route: '/orangtua/guidebook',
    filename: 'Panduan_SIM-Tren_Orang_Tua.pdf'
  },
  {
    role: 'ustadz',
    title: 'Buku Panduan Tenaga Pendidik / Ustadz',
    route: '/ustadz/guidebook',
    filename: 'Panduan_SIM-Tren_Ustadz.pdf'
  },
  {
    role: 'ppdb',
    title: 'Buku Panduan Calon Santri & Wali (PPDB Online)',
    route: '/ppdb/guidebook',
    filename: 'Panduan_SIM-Tren_PPDB.pdf',
    isPublic: true
  }
];

async function generateAll() {
  console.log('================================================================');
  console.log('       GENERATING 8 OFFICIAL PDF GUIDEBOOKS FOR SIM-TREN        ');
  console.log('================================================================\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const results = [];

  for (const cfg of rolesConfig) {
    console.log(`\n>>> Generating PDF for ${cfg.role.toUpperCase()} (${cfg.filename}) ...`);
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    if (!cfg.isPublic) {
      const user = await prisma.users.findFirst({
        where: { user_role: { some: { role: { role: cfg.role } } } }
      });
      if (!user) {
        console.error(`User for role ${cfg.role} not found, skipping`);
        await page.close();
        continue;
      }

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

    await page.goto(`${BASE_URL}${cfg.route}`, { waitUntil: 'networkidle2' });

    // Wait for content
    await page.waitForSelector('main section, main', { timeout: 15000 });

    // Wait for all images inside main to finish loading
    await page.waitForFunction(() => {
      const imgs = Array.from(document.querySelectorAll('main img'));
      return imgs.length > 0 && imgs.every(img => img.complete && img.naturalWidth > 0);
    }, { timeout: 25000 }).catch(e => console.warn(`[WARN] Some images taking time in ${cfg.role}:`, e.message));

    await new Promise(r => setTimeout(r, 1500));

    // Inject print layout CSS overrides
    await page.addStyleTag({
      content: `
        @media print {
          html, body, #root, div, main {
            overflow: visible !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
          }
          header, aside, .print\\:hidden, button[aria-label="Daftar Isi"] {
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
          .flex-row {
            display: flex !important;
            flex-direction: row !important;
          }
        }
      `
    });

    await page.emulateMediaType('print');

    const pdfPath = path.join(DOCS_DIR, cfg.filename);

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
          <span style="font-weight: bold; color: #166534;">SIM-TREN PPDNY — ${cfg.title}</span>
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
    const pdfBuf = fs.readFileSync(pdfPath);
    const str = pdfBuf.toString('latin1');
    const pageCount = (str.match(/\/Type\s*\/Page\b/g) || []).length;

    console.log(`✅ [SUCCESS] ${cfg.filename} generated: ${pageCount} halaman, ${(stats.size / 1024 / 1024).toFixed(2)} MB (${stats.size} bytes)`);
    results.push({ role: cfg.role, filename: cfg.filename, pageCount, sizeBytes: stats.size, sizeMB: (stats.size / 1024 / 1024).toFixed(2) });

    await page.close();
  }

  await browser.close();
  await prisma.$disconnect();

  console.log('\n================================================================');
  console.log('                   REKAPITULASI DOKUMEN PDF                     ');
  console.log('================================================================');
  for (const r of results) {
    console.log(`• ${r.filename.padEnd(32)}: ${r.pageCount.toString().padStart(2)} Halaman | ${r.sizeMB} MB`);
  }
  console.log(`\nTotal Dokumen PDF Berhasil Dibuat: ${results.length}/8`);
}

generateAll().catch(err => {
  console.error("FATAL ERROR in generateAll:", err);
  process.exit(1);
});
