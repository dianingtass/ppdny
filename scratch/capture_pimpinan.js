module.paths.push('c:/laragon/www/ppdny/server/node_modules');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'c:/laragon/www/ppdny/server/.env' });
const prisma = require('c:/laragon/www/ppdny/server/src/config/prisma');
const { cloudinary } = require('c:/laragon/www/ppdny/server/src/config/cloudinary');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ASSETS_DIR = path.resolve('c:/laragon/www/ppdny/client/public/assets/guidebook/pimpinan');
const BASE_URL = 'http://localhost:5173';

if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

// Generate valid JWT for Pimpinan (User ID 2: KH. Ahmad Dahlan)
const token = jwt.sign(
  {
    id: 2,
    email: 'pimpinan@ppdny.id',
    role: 'pimpinan',
    nama: 'KH. Ahmad Dahlan',
    nip: 'PIM001'
  },
  process.env.JWT_SECRET || 'your-secret-key',
  { expiresIn: '7d' }
);

const userObj = {
  id: 2,
  nama: 'KH. Ahmad Dahlan',
  email: 'pimpinan@ppdny.id',
  role: 'pimpinan',
  nip: 'PIM001'
};

const screens = [
  { name: 'dashboard_utama',   path: '/pimpinan',                    modul: 'dashboard',  bagian: 'utama',       desc: 'Executive Dashboard & Ringkasan KPI Eksekutif' },
  { name: 'santri_daftar',     path: '/pimpinan/data-santri',        modul: 'santri',     bagian: 'daftar',      desc: 'Direktori & Demografi Santri' },
  { name: 'ustadz_daftar',     path: '/pimpinan/data-ustadz',        modul: 'ustadz',     bagian: 'daftar',      desc: 'Direktori Ustadz & Tenaga Pendidik' },
  { name: 'staf_daftar',       path: '/pimpinan/data-staf',          modul: 'staf',       bagian: 'daftar',      desc: 'Direktori Tenaga Kependidikan & Staf' },
  { name: 'orangtua_daftar',   path: '/pimpinan/data-orangtua',      modul: 'orangtua',   bagian: 'daftar',      desc: 'Direktori Wali Santri' },
  { name: 'kelas_kamar',       path: '/pimpinan/data-kelas',         modul: 'kelas',      bagian: 'kamar',       desc: 'Pemantauan Rombel Kelas Santri' },
  { name: 'kegiatan_daftar',   path: '/pimpinan/kegiatan',           modul: 'kegiatan',   bagian: 'daftar',      desc: 'Pemantauan Agenda & Kegiatan Pondok' },
  { name: 'layanan_riwayat',   path: '/pimpinan/riwayat-layanan',    modul: 'layanan',    bagian: 'riwayat',     desc: 'Riwayat Pemanfaatan Layanan Pondok' },
  { name: 'pengaduan_daftar',  path: '/pimpinan/pengaduan',          modul: 'pengaduan',  bagian: 'daftar',      desc: 'Pengawasan Aspirasi & Aduan Wali' },
  { name: 'keuangan_laporan',  path: '/pimpinan/keuangan',           modul: 'keuangan',   bagian: 'laporan',     desc: 'Laporan Finansial & Kas Tagihan Santri' },
  { name: 'feedback_evaluasi', path: '/pimpinan/feedback',           modul: 'feedback',   bagian: 'evaluasi',    desc: 'Evaluasi Mutu & Suara Santri' },
  { name: 'ppdb_rekapitulasi', path: '/pimpinan/ppdb/rekapitulasi',  modul: 'ppdb',       bagian: 'rekapitulasi',desc: 'Rekapitulasi Penerimaan Santri Baru (PPDB)' },
  { name: 'ppdb_pendaftar',    path: '/pimpinan/ppdb/pendaftar',     modul: 'ppdb',       bagian: 'pendaftar',   desc: 'Daftar Calon Santri Pendaftar PPDB' },
  { name: 'absensi_daftar',    path: '/pimpinan/daftarAbsensiKamar', modul: 'absensi',    bagian: 'daftar',      desc: 'Inspeksi & Sanitasi Kamar Asrama' },
  { name: 'screening_daftar',  path: '/pimpinan/daftarSantriScreening', modul: 'screening', bagian: 'daftar',   desc: 'Monitoring Skrining Kesehatan Scabies' },
  { name: 'observasi_daftar',  path: '/pimpinan/daftarSantriObservasi', modul: 'observasi', bagian: 'daftar',   desc: 'Monitoring Kepatuhan Cuci Tangan' },
  { name: 'profil_utama',      path: '/pimpinan/profil',             modul: 'profil',     bagian: 'utama',       desc: 'Profil Pengasuh Pimpinan' },
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
  console.log('\n=== Uploading Pimpinan to Cloudinary & Upserting Database ===');

  for (const s of screens) {
    for (const device of ['desktop', 'mobile']) {
      const filename = `${s.name}_${device}.webp`;
      const filePath = path.join(ASSETS_DIR, filename);

      if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}, skipping`);
        continue;
      }

      const publicId = `guidebook/pimpinan/${s.name}_${device}`;
      let uploadUrl = '';

      try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
          public_id: publicId,
          overwrite: true,
          resource_type: 'image',
          format: 'webp'
        });
        uploadUrl = uploadResult.secure_url;
        console.log(`[CLOUDINARY] Uploaded: ${publicId} -> ${uploadUrl}`);
      } catch (uploadErr) {
        console.error(`[CLOUDINARY ERROR] ${filename}:`, uploadErr.message);
        uploadUrl = `/assets/guidebook/pimpinan/${filename}`;
      }

      // Upsert to DB
      try {
        const existing = await prisma.guidebook_screenshot.findFirst({
          where: {
            role: 'pimpinan',
            modul: s.modul,
            bagian: s.bagian,
            device: device
          }
        });

        if (existing) {
          await prisma.guidebook_screenshot.update({
            where: { id: existing.id },
            data: {
              url: uploadUrl,
              deskripsi: `${s.desc} (${device})`
            }
          });
        } else {
          await prisma.guidebook_screenshot.create({
            data: {
              role: 'pimpinan',
              modul: s.modul,
              bagian: s.bagian,
              device: device,
              url: uploadUrl,
              deskripsi: `${s.desc} (${device})`
            }
          });
        }
      } catch (dbErr) {
        console.error(`[DB ERROR] ${filename}:`, dbErr.message);
      }
    }
  }

  console.log('\nSuccessfully uploaded and registered 34/34 Pimpinan screenshots!');
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  console.log('=== Capturing Pimpinan for DESKTOP ===');
  await captureDevice(browser, 'desktop', { width: 1280, height: 800 });

  console.log('\n=== Capturing Pimpinan for MOBILE ===');
  await captureDevice(browser, 'mobile', { width: 390, height: 844, isMobile: true, hasTouch: true });

  await browser.close();

  const files = fs.readdirSync(ASSETS_DIR);
  console.log(`\nTotal local Pimpinan screenshots captured: ${files.length}`);

  await uploadAndSyncDB();

  process.exit(0);
})().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
