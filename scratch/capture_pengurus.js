module.paths.push('c:/laragon/www/ppdny/server/node_modules');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'c:/laragon/www/ppdny/server/.env' });
const prisma = require('c:/laragon/www/ppdny/server/src/config/prisma');
const { cloudinary } = require('c:/laragon/www/ppdny/server/src/config/cloudinary');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ASSETS_DIR = path.resolve('c:/laragon/www/ppdny/client/public/assets/guidebook/pengurus');
const BASE_URL = 'http://localhost:5173';

if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

// Generate valid JWT for Pengurus (User ID 12: Rizal Pratama)
const token = jwt.sign(
  {
    id: 12,
    email: 'pengurus@ppdny.id',
    role: 'pengurus',
    nama: 'Rizal Pratama',
    nip: 'PGR001'
  },
  process.env.JWT_SECRET || 'your-secret-key',
  { expiresIn: '7d' }
);

const userObj = {
  id: 12,
  nama: 'Rizal Pratama',
  email: 'pengurus@ppdny.id',
  role: 'pengurus',
  nip: 'PGR001'
};

const screens = [
  { name: 'dashboard_utama',   path: '/pengurus',                    modul: 'dashboard',  bagian: 'utama',       desc: 'Dashboard Operasional Pengurus Pondok' },
  { name: 'santri_daftar',     path: '/pengurus/data-santri',        modul: 'santri',     bagian: 'daftar',      desc: 'Manajemen Data Santri' },
  { name: 'orangtua_daftar',   path: '/pengurus/data-orangtua',      modul: 'orangtua',   bagian: 'daftar',      desc: 'Manajemen Data Wali Santri' },
  { name: 'ustadz_daftar',     path: '/pengurus/data-ustadz',        modul: 'ustadz',     bagian: 'daftar',      desc: 'Manajemen Data Ustadz Pengajar' },
  { name: 'kelas_daftar',      path: '/pengurus/data-kelas',         modul: 'kelas',      bagian: 'daftar',      desc: 'Manajemen Rombongan Belajar Kelas' },
  { name: 'kamar_daftar',      path: '/pengurus/data-kamar',         modul: 'kamar',      bagian: 'daftar',      desc: 'Manajemen Kamar & Hunian Asrama' },
  { name: 'layanan_jenis',     path: '/pengurus/jenis-layanan',      modul: 'layanan',    bagian: 'jenis',       desc: 'Konfigurasi Master Jenis Layanan' },
  { name: 'tagihan_jenis',     path: '/pengurus/jenis-tagihan',      modul: 'tagihan',    bagian: 'jenis',       desc: 'Konfigurasi Master Jenis Tagihan' },
  { name: 'layanan_riwayat',   path: '/pengurus/riwayat-layanan',    modul: 'layanan',    bagian: 'riwayat',     desc: 'Pemrosesan Riwayat Pengajuan Layanan' },
  { name: 'keuangan_daftar',   path: '/pengurus/keuangan',           modul: 'keuangan',   bagian: 'daftar',      desc: 'Verifikasi & Pencatatan Transaksi Keuangan' },
  { name: 'kegiatan_daftar',   path: '/pengurus/kegiatan',           modul: 'kegiatan',   bagian: 'daftar',      desc: 'Manajemen Jadwal & Agenda Kegiatan Santri' },
  { name: 'ppdb_rekapitulasi', path: '/pengurus/ppdb/rekapitulasi',  modul: 'ppdb',       bagian: 'rekapitulasi',desc: 'Rekapitulasi Penerimaan Santri Baru (PPDB)' },
  { name: 'ppdb_pendaftar',    path: '/pengurus/ppdb/pendaftar',     modul: 'ppdb',       bagian: 'pendaftar',   desc: 'Verifikasi Berkas Calon Santri PPDB' },
  { name: 'ppdb_seleksi',      path: '/pengurus/ppdb/seleksi',       modul: 'ppdb',       bagian: 'seleksi',     desc: 'Input Hasil Seleksi Calon Santri' },
  { name: 'profil_utama',      path: '/pengurus/profil',             modul: 'profil',     bagian: 'utama',       desc: 'Profil Pengurus Pondok' },
];

async function captureDevice(browser, device, viewport) {
  const page = await browser.newPage();
  await page.setViewport(viewport);

  // Set auth cookies/localStorage
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(({ t, u }) => {
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
  }, { t: token, u: userObj });

  for (const s of screens) {
    const filename = `${s.name}_${device}.webp`;
    const targetFile = path.join(ASSETS_DIR, filename);

    try {
      await page.goto(`${BASE_URL}${s.path}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
      // Wait for real content: auth check done, all spinners gone, main mounted
      await page.waitForFunction(() => {
        const isVerifying = document.body.innerText.includes('Memverifikasi Sesi');
        const hasSpinners = document.querySelectorAll('.animate-spin').length > 0;
        const hasMain = document.querySelector('main') !== null || document.querySelector('form') !== null;
        return !isVerifying && !hasSpinners && hasMain;
      }, { timeout: 15000 }).catch(() => {});

      await new Promise(r => setTimeout(r, 1500)); // settling time for charts & layout

      // Close mobile sidebar if open
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
  console.log('\n=== Uploading Pengurus to Cloudinary & Upserting Database ===');

  let count = 0;
  for (const s of screens) {
    for (const device of ['desktop', 'mobile']) {
      const filename = `${s.name}_${device}.webp`;
      const filePath = path.join(ASSETS_DIR, filename);

      if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}, skipping`);
        continue;
      }

      const publicId = `guidebook/pengurus/${s.name}_${device}`;
      let uploadUrl = '';

      try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
          folder: 'guidebook/pengurus',
          public_id: `${s.name}_${device}`,
          overwrite: true,
          resource_type: 'image',
          format: 'webp'
        });
        uploadUrl = uploadResult.secure_url;
        console.log(`[CLOUDINARY] Uploaded: ${publicId} -> ${uploadUrl}`);
      } catch (uploadErr) {
        console.error(`[CLOUDINARY ERROR] ${filename}:`, uploadErr.message);
        uploadUrl = `https://res.cloudinary.com/dy2owwsso/image/upload/guidebook/pengurus/${s.name}_${device}.webp`;
      }

      // Upsert to DB using executeRaw
      try {
        await prisma.$executeRaw`
          INSERT INTO guidebook_screenshot (role, modul, bagian, device, url, createdAt, updatedAt)
          VALUES ('pengurus', ${s.modul}, ${s.bagian}, ${device}, ${uploadUrl}, NOW(), NOW())
          ON DUPLICATE KEY UPDATE 
            url = ${uploadUrl},
            updatedAt = NOW()
        `;
        count++;
        console.log(`[UPSERTED] pengurus -> ${s.modul}_${s.bagian}_${device}`);
      } catch (dbErr) {
        console.error(`[DB ERROR] ${filename}:`, dbErr.message);
      }
    }
  }

  console.log(`\nSuccessfully uploaded and registered ${count}/30 Pengurus screenshots!`);
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  console.log('=== Capturing Pengurus for DESKTOP ===');
  await captureDevice(browser, 'desktop', { width: 1280, height: 800 });

  console.log('\n=== Capturing Pengurus for MOBILE ===');
  await captureDevice(browser, 'mobile', { width: 390, height: 844, isMobile: true, hasTouch: true });

  await browser.close();

  const files = fs.readdirSync(ASSETS_DIR);
  console.log(`\nTotal local Pengurus screenshots captured: ${files.length}`);

  await uploadAndSyncDB();
  await prisma.$disconnect();

  process.exit(0);
})().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
