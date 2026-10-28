module.paths.push('c:/laragon/www/ppdny/server/node_modules');
const puppeteer = require('puppeteer');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: 'c:/laragon/www/ppdny/server/.env' });
const prisma = require('c:/laragon/www/ppdny/server/src/config/prisma');
const { cloudinary } = require('c:/laragon/www/ppdny/server/src/config/cloudinary');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ASSETS_DIR = path.resolve('c:/laragon/www/ppdny/client/public/assets/guidebook/timkesehatan');
const BASE_URL = 'http://localhost:5173';

const token = jwt.sign(
  { id: 10, email: 'timkes@ppdny.id', role: 'timkesehatan', nama: 'Ns. Kartika', nip: 'TKS002' },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
const userObj = { id: 10, nama: 'Ns. Kartika', email: 'timkes@ppdny.id', role: 'timkesehatan', nip: 'TKS002' };

const screens = [
  { name: 'absensi_laporan',   path: '/timkesehatan/daftarAbsensiKamar/1/laporan', modul: 'absensi', bagian: 'laporan' },
  { name: 'konsultasi_daftar', path: '/timkesehatan/konsultasi',                   modul: 'konsultasi', bagian: 'daftar' },
  { name: 'konsultasi_riwayat',path: '/timkesehatan/konsultasi/riwayat',           modul: 'konsultasi', bagian: 'riwayat' },
  { name: 'materi_daftar',     path: '/timkesehatan/manageMateri',                modul: 'materi', bagian: 'daftar' },
  { name: 'profil_utama',      path: '/timkesehatan/profil',                      modul: 'profil', bagian: 'utama' },
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const targets = [];

  for (const device of ['desktop', 'mobile']) {
    console.log(`\n=== FIXING TIM KESEHATAN ${device.toUpperCase()} ===`);
    const page = await browser.newPage();
    if (device === 'mobile') {
      await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    } else {
      await page.setViewport({ width: 1280, height: 800 });
    }

    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });

    for (const s of screens) {
      // Ensure token is always intact
      await page.evaluate(({ t, u }) => {
        localStorage.setItem('token', t);
        localStorage.setItem('user', JSON.stringify(u));
      }, { t: token, u: userObj });

      await page.goto(`${BASE_URL}${s.path}`, { waitUntil: 'domcontentloaded' });
      if (page.url().includes('/login')) {
        await page.evaluate(({ t, u }) => {
          localStorage.setItem('token', t);
          localStorage.setItem('user', JSON.stringify(u));
        }, { t: token, u: userObj });
        await page.goto(`${BASE_URL}${s.path}`, { waitUntil: 'domcontentloaded' });
      }

      await page.waitForFunction(() => {
        const isVerifying = document.body.innerText.includes('Memverifikasi Sesi');
        const hasSpinners = document.querySelectorAll('.animate-spin').length > 0;
        const isLogin = window.location.pathname === '/login';
        const hasMain = document.querySelector('main') !== null || document.querySelector('form') !== null;
        return !isVerifying && !hasSpinners && hasMain && !isLogin;
      }, { timeout: 15000 }).catch(() => {});

      await new Promise(r => setTimeout(r, 1500));

      if (device === 'mobile') {
        await page.evaluate(() => {
          const overlay = document.querySelector('.fixed.inset-0.bg-black\\/50') || document.querySelector('[class*="bg-black"]');
          if (overlay) overlay.click();
        }).catch(() => {});
        await new Promise(r => setTimeout(r, 400));
      }

      const outPath = path.join(ASSETS_DIR, `${s.name}_${device}.webp`);
      await page.screenshot({ path: outPath, type: 'webp', quality: 90 });
      const stat = fs.statSync(outPath);
      console.log(`[SAVED] ${s.name}_${device}.webp (${stat.size} bytes) -> URL: ${page.url()}`);
      targets.push({ ...s, device, filePath: outPath });
    }

    await page.close();
  }

  await browser.close();

  // Upload to Cloudinary & Upsert DB
  console.log('\n=== Uploading fixed screenshots to Cloudinary & DB ===');
  for (const t of targets) {
    const publicId = `guidebook/timkesehatan/${t.modul}_${t.bagian}_${t.device}`;
    const uploadRes = await cloudinary.uploader.upload(t.filePath, {
      folder: 'guidebook/timkesehatan',
      public_id: `${t.modul}_${t.bagian}_${t.device}`,
      overwrite: true,
      resource_type: 'image'
    });
    const secureUrl = uploadRes.secure_url;
    console.log(`[CLOUDINARY] Uploaded: ${publicId} -> ${secureUrl}`);

    await prisma.$executeRaw`
      INSERT INTO guidebook_screenshot (role, modul, bagian, device, url, createdAt, updatedAt)
      VALUES ('timkesehatan', ${t.modul}, ${t.bagian}, ${t.device}, ${secureUrl}, NOW(), NOW())
      ON DUPLICATE KEY UPDATE 
        url = ${secureUrl},
        updatedAt = NOW()
    `;
  }

  console.log('\nAll 10 remaining Timkes screenshots uploaded and registered successfully!');
  await prisma.$disconnect();
  process.exit(0);
})().catch(e => {
  console.error(e);
  process.exit(1);
});
