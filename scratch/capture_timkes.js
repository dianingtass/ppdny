module.paths.push('c:/laragon/www/ppdny/server/node_modules');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'c:/laragon/www/ppdny/server/.env' });
const prisma = require('c:/laragon/www/ppdny/server/src/config/prisma');
const { cloudinary } = require('c:/laragon/www/ppdny/server/src/config/cloudinary');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ASSETS_DIR = path.resolve('c:/laragon/www/ppdny/client/public/assets/guidebook/timkesehatan');
const BASE_URL = 'http://localhost:5173';

if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

// Generate valid JWT for Tim Kesehatan (User ID 10: Ns. Kartika)
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

const userObj = {
  id: 10,
  nama: 'Ns. Kartika',
  email: 'timkes@ppdny.id',
  role: 'timkesehatan',
  nip: 'TKS002'
};

const screens = [
  { name: 'dashboard_utama',   path: '/timkesehatan',                                    modul: 'dashboard',  bagian: 'utama' },
  { name: 'screening_daftar',  path: '/timkesehatan/daftarSantriScreening',               modul: 'screening',  bagian: 'daftar' },
  { name: 'screening_portal',  path: '/timkesehatan/daftarSantriScreening/45',            modul: 'screening',  bagian: 'portal' },
  { name: 'screening_form',    path: '/timkesehatan/daftarSantriScreening/45/create',     modul: 'screening',  bagian: 'form' },
  { name: 'screening_view',    path: '/timkesehatan/daftarSantriScreening/45/view/1',    modul: 'screening',  bagian: 'view' },
  { name: 'observasi_daftar',  path: '/timkesehatan/daftarSantriObservasi',              modul: 'observasi',  bagian: 'daftar' },
  { name: 'observasi_portal',  path: '/timkesehatan/daftarSantriObservasi/45',           modul: 'observasi',  bagian: 'portal' },
  { name: 'observasi_form',    path: '/timkesehatan/daftarSantriObservasi/45/create',    modul: 'observasi',  bagian: 'form' },
  { name: 'observasi_view',    path: '/timkesehatan/daftarSantriObservasi/45/view/1',   modul: 'observasi',  bagian: 'view' },
  { name: 'absensi_daftar',    path: '/timkesehatan/daftarAbsensiKamar',                 modul: 'absensi',    bagian: 'daftar' },
  { name: 'absensi_portal',    path: '/timkesehatan/daftarAbsensiKamar/1',                modul: 'absensi',    bagian: 'portal' },
  { name: 'absensi_form',      path: '/timkesehatan/daftarAbsensiKamar/1/create',         modul: 'absensi',    bagian: 'form' },
  { name: 'absensi_laporan',   path: '/timkesehatan/daftarAbsensiKamar/1/laporan',        modul: 'absensi',    bagian: 'laporan' },
  { name: 'konsultasi_daftar', path: '/timkesehatan/konsultasi',                          modul: 'konsultasi', bagian: 'daftar' },
  { name: 'konsultasi_riwayat',path: '/timkesehatan/konsultasi/riwayat',                  modul: 'konsultasi', bagian: 'riwayat' },
  { name: 'materi_daftar',     path: '/timkesehatan/manageMateri',                       modul: 'materi',     bagian: 'daftar' },
  { name: 'profil_utama',      path: '/timkesehatan/profil',                             modul: 'profil',     bagian: 'utama' },
];

async function captureDevice(browser, device, viewport) {
  const page = await browser.newPage();
  await page.setViewport(viewport);

  // Set auth on landing page (avoiding /login cleanup)
  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(({ t, u }) => {
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
  }, { t: token, u: userObj });

  for (const s of screens) {
    const filename = `${s.name}_${device}.webp`;
    const targetFile = path.join(ASSETS_DIR, filename);

    try {
      await page.goto(`${BASE_URL}${s.path}`, { waitUntil: 'domcontentloaded', timeout: 20000 });

      // Robust wait: no verifying session, no spinners, main/form present, and NOT at /login
      await page.waitForFunction(() => {
        const isVerifying = document.body.innerText.includes('Memverifikasi Sesi');
        const hasSpinners = document.querySelectorAll('.animate-spin').length > 0;
        const isLogin = window.location.pathname === '/login';
        const hasMain = document.querySelector('main') !== null || document.querySelector('form') !== null;
        return !isVerifying && !hasSpinners && hasMain && !isLogin;
      }, { timeout: 15000 }).catch(() => {});

      await new Promise(r => setTimeout(r, 1500)); // settling time

      if (device === 'mobile') {
        await page.evaluate(() => {
          const overlay = document.querySelector('.fixed.inset-0.bg-black\\/50') || document.querySelector('[class*="bg-black"]');
          if (overlay) overlay.click();
        }).catch(() => {});
        await new Promise(r => setTimeout(r, 400));
      }

      await page.screenshot({ path: targetFile, type: 'webp', quality: 90 });
      console.log(`[SAVED] ${filename}`);
    } catch (err) {
      console.error(`[ERROR] capturing ${filename}:`, err.message);
    }
  }

  await page.close();
}

async function uploadAndSyncDB() {
  console.log('\n=== Uploading Tim Kesehatan to Cloudinary & Upserting Database ===');

  let count = 0;
  for (const s of screens) {
    for (const device of ['desktop', 'mobile']) {
      const filename = `${s.name}_${device}.webp`;
      const filePath = path.join(ASSETS_DIR, filename);

      if (!fs.existsSync(filePath)) {
        console.warn(`[SKIP] File not found: ${filePath}`);
        continue;
      }

      const publicId = `guidebook/timkesehatan/${s.modul}_${s.bagian}_${device}`;
      try {
        const uploadRes = await cloudinary.uploader.upload(filePath, {
          folder: 'guidebook/timkesehatan',
          public_id: `${s.modul}_${s.bagian}_${device}`,
          overwrite: true,
          resource_type: 'image'
        });
        const secureUrl = uploadRes.secure_url;
        console.log(`[CLOUDINARY] Uploaded: ${publicId} -> ${secureUrl}`);

        await prisma.$executeRaw`
          INSERT INTO guidebook_screenshot (role, modul, bagian, device, url, createdAt, updatedAt)
          VALUES ('timkesehatan', ${s.modul}, ${s.bagian}, ${device}, ${secureUrl}, NOW(), NOW())
          ON DUPLICATE KEY UPDATE 
            url = ${secureUrl},
            updatedAt = NOW()
        `;
        count++;
      } catch (err) {
        console.error(`[ERROR] Failed to upload/upsert ${publicId}:`, err.message);
      }
    }
  }

  console.log(`\nSuccessfully uploaded & synced ${count}/34 Tim Kesehatan screenshots!`);
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  console.log('--- CAPTURING TIM KESEHATAN DESKTOP ---');
  await captureDevice(browser, 'desktop', { width: 1280, height: 800, isMobile: false, hasTouch: false });

  console.log('\n--- CAPTURING TIM KESEHATAN MOBILE ---');
  await captureDevice(browser, 'mobile', { width: 390, height: 844, isMobile: true, hasTouch: true });

  await browser.close();

  await uploadAndSyncDB();
  await prisma.$disconnect();
}

main().catch(err => {
  console.error("FATAL ERROR in main:", err);
  process.exit(1);
});
