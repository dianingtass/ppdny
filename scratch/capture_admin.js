module.paths.push('c:/laragon/www/ppdny/server/node_modules');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'c:/laragon/www/ppdny/server/.env' });
const prisma = require('c:/laragon/www/ppdny/server/src/config/prisma');
const { cloudinary } = require('c:/laragon/www/ppdny/server/src/config/cloudinary');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ASSETS_DIR = path.resolve('c:/laragon/www/ppdny/client/public/assets/guidebook/admin');
const BASE_URL = 'http://localhost:5173';

if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

// Generate valid JWT for Admin (User ID 1: Bagus Santoso)
const token = jwt.sign(
  {
    id: 1,
    email: 'admin@ppdny.id',
    role: 'admin',
    nama: 'Bagus Santoso',
    nip: 'ADM001'
  },
  process.env.JWT_SECRET || 'your-secret-key',
  { expiresIn: '7d' }
);

const userObj = {
  id: 1,
  nama: 'Bagus Santoso',
  email: 'admin@ppdny.id',
  role: 'admin',
  nip: 'ADM001'
};

const screens = [
  { name: 'dashboard_utama',   path: '/admin',                    modul: 'dashboard',  bagian: 'utama',       desc: 'Dashboard Pusat Kendali Sistem Administrator' },
  { name: 'staf_manajemen',    path: '/admin/data-staf',          modul: 'staf',       bagian: 'manajemen',   desc: 'Manajemen Staf & Hak Akses Pengguna' },
  { name: 'santri_daftar',     path: '/admin/data-santri',        modul: 'santri',     bagian: 'daftar',      desc: 'Master Data Santri' },
  { name: 'orangtua_daftar',   path: '/admin/data-orangtua',      modul: 'orangtua',   bagian: 'daftar',      desc: 'Master Data Wali Santri' },
  { name: 'ustadz_daftar',     path: '/admin/data-ustadz',        modul: 'ustadz',     bagian: 'daftar',      desc: 'Master Data Ustadz Pengajar' },
  { name: 'kelas_daftar',      path: '/admin/data-kelas',         modul: 'kelas',      bagian: 'daftar',      desc: 'Master Rombel Kelas Belajar' },
  { name: 'kamar_daftar',      path: '/admin/data-kamar',         modul: 'kamar',      bagian: 'daftar',      desc: 'Master Kamar Asrama Pondok' },
  { name: 'layanan_jenis',     path: '/admin/jenis-layanan',      modul: 'layanan',    bagian: 'jenis',       desc: 'Konfigurasi Master Jenis Layanan' },
  { name: 'tagihan_jenis',     path: '/admin/jenis-tagihan',      modul: 'tagihan',    bagian: 'jenis',       desc: 'Konfigurasi Master Jenis Tagihan' },
  { name: 'pengaduan_daftar',  path: '/admin/pengaduan',          modul: 'pengaduan',  bagian: 'daftar',      desc: 'Manajemen & Monitoring Pengaduan' },
  { name: 'kegiatan_daftar',   path: '/admin/kegiatan',           modul: 'kegiatan',   bagian: 'daftar',      desc: 'Manajemen Master Agenda Kegiatan' },
  { name: 'layanan_riwayat',   path: '/admin/riwayat-layanan',    modul: 'layanan',    bagian: 'riwayat',     desc: 'Audit Riwayat Layanan Santri' },
  { name: 'keuangan_daftar',   path: '/admin/keuangan',           modul: 'keuangan',   bagian: 'daftar',      desc: 'Audit Transaksi Kas Masuk & SPP' },
  { name: 'feedback_evaluasi', path: '/admin/feedback',           modul: 'feedback',   bagian: 'evaluasi',    desc: 'Evaluasi Kepuasan & Mutu Layanan' },
  { name: 'log_aktivitas',     path: '/admin/log',                modul: 'log',        bagian: 'aktivitas',   desc: 'Audit Trail & Log Aktivitas Sistem' },
  { name: 'materi_kelola',     path: '/admin/manageMateri',       modul: 'materi',     bagian: 'kelola',      desc: 'Manajemen Modul Materi Kesehatan' },
  { name: 'ppdb_rekapitulasi', path: '/admin/ppdb/rekapitulasi',  modul: 'ppdb',       bagian: 'rekapitulasi',desc: 'Pusat Kendali Sistem PPDB' },
  { name: 'profil_utama',      path: '/admin/profil',             modul: 'profil',     bagian: 'utama',       desc: 'Profil Administrator Sistem' },
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
  console.log('\n=== Uploading Admin to Cloudinary & Upserting Database ===');

  let count = 0;
  for (const s of screens) {
    for (const device of ['desktop', 'mobile']) {
      const filename = `${s.name}_${device}.webp`;
      const filePath = path.join(ASSETS_DIR, filename);

      if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}, skipping`);
        continue;
      }

      const publicId = `guidebook/admin/${s.name}_${device}`;
      let uploadUrl = '';

      try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
          folder: 'guidebook/admin',
          public_id: `${s.name}_${device}`,
          overwrite: true,
          resource_type: 'image',
          format: 'webp'
        });
        uploadUrl = uploadResult.secure_url;
        console.log(`[CLOUDINARY] Uploaded: ${publicId} -> ${uploadUrl}`);
      } catch (uploadErr) {
        console.error(`[CLOUDINARY ERROR] ${filename}:`, uploadErr.message);
        uploadUrl = `https://res.cloudinary.com/dy2owwsso/image/upload/guidebook/admin/${s.name}_${device}.webp`;
      }

      // Upsert to DB using executeRaw
      try {
        await prisma.$executeRaw`
          INSERT INTO guidebook_screenshot (role, modul, bagian, device, url, createdAt, updatedAt)
          VALUES ('admin', ${s.modul}, ${s.bagian}, ${device}, ${uploadUrl}, NOW(), NOW())
          ON DUPLICATE KEY UPDATE 
            url = ${uploadUrl},
            updatedAt = NOW()
        `;
        count++;
        console.log(`[UPSERTED] admin -> ${s.modul}_${s.bagian}_${device}`);
      } catch (dbErr) {
        console.error(`[DB ERROR] ${filename}:`, dbErr.message);
      }
    }
  }

  console.log(`\nSuccessfully uploaded and registered ${count}/36 Admin screenshots!`);
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  console.log('=== Capturing Admin for DESKTOP ===');
  await captureDevice(browser, 'desktop', { width: 1280, height: 800 });

  console.log('\n=== Capturing Admin for MOBILE ===');
  await captureDevice(browser, 'mobile', { width: 390, height: 844, isMobile: true, hasTouch: true });

  await browser.close();

  const files = fs.readdirSync(ASSETS_DIR);
  console.log(`\nTotal local Admin screenshots captured: ${files.length}`);

  await uploadAndSyncDB();
  await prisma.$disconnect();

  process.exit(0);
})().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
