module.paths.push('c:/laragon/www/ppdny/server/node_modules');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
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

const screens = [
  { name: 'dashboard_utama',   path: '/pimpinan',                    modul: 'dashboard',  bagian: 'utama' },
  { name: 'santri_daftar',     path: '/pimpinan/data-santri',        modul: 'santri',     bagian: 'daftar' },
  { name: 'ustadz_daftar',     path: '/pimpinan/data-ustadz',        modul: 'ustadz',     bagian: 'daftar' },
  { name: 'staf_daftar',       path: '/pimpinan/data-staf',          modul: 'staf',       bagian: 'daftar' },
  { name: 'orangtua_daftar',   path: '/pimpinan/data-orangtua',      modul: 'orangtua',   bagian: 'daftar' },
  { name: 'kelas_kamar',       path: '/pimpinan/data-kelas',         modul: 'kelas',      bagian: 'kamar' },
  { name: 'kegiatan_daftar',   path: '/pimpinan/kegiatan',           modul: 'kegiatan',   bagian: 'daftar' },
  { name: 'layanan_riwayat',   path: '/pimpinan/riwayat-layanan',    modul: 'layanan',    bagian: 'riwayat' },
  { name: 'pengaduan_daftar',  path: '/pimpinan/pengaduan',          modul: 'pengaduan',  bagian: 'daftar' },
  { name: 'keuangan_laporan',  path: '/pimpinan/keuangan',           modul: 'keuangan',   bagian: 'laporan' },
  { name: 'feedback_evaluasi', path: '/pimpinan/feedback',           modul: 'feedback',   bagian: 'evaluasi' },
  { name: 'ppdb_rekapitulasi', path: '/pimpinan/ppdb/rekapitulasi',  modul: 'ppdb',       bagian: 'rekapitulasi' },
  { name: 'ppdb_pendaftar',    path: '/pimpinan/ppdb/pendaftar',     modul: 'ppdb',       bagian: 'pendaftar' },
  { name: 'absensi_daftar',    path: '/pimpinan/daftarAbsensiKamar', modul: 'absensi',    bagian: 'daftar' },
  { name: 'screening_daftar',  path: '/pimpinan/daftarSantriScreening', modul: 'screening', bagian: 'daftar' },
  { name: 'observasi_daftar',  path: '/pimpinan/daftarSantriObservasi', modul: 'observasi', bagian: 'daftar' },
  { name: 'profil_utama',      path: '/pimpinan/profil',             modul: 'profil',     bagian: 'utama' },
];

async function run() {
  const user = await prisma.users.findFirst({
    where: { user_role: { some: { role: { role: 'pimpinan' } } } }
  });
  if (!user) throw new Error("Pimpinan user not found");

  const token = jwt.sign(
    { id: user.id, email: user.email, role: 'pimpinan', nama: user.nama, nip: user.nip },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const devices = [
    { name: 'desktop', width: 1280, height: 800, isMobile: false, hasTouch: false },
    { name: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true }
  ];

  const captured = [];

  for (const dev of devices) {
    console.log(`\n=== Capturing Pimpinan for ${dev.name.toUpperCase()} ===`);
    const page = await browser.newPage();
    await page.setViewport({
      width: dev.width,
      height: dev.height,
      isMobile: dev.isMobile,
      hasTouch: dev.hasTouch
    });

    // Set auth on landing page
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(({ t, u }) => {
      localStorage.setItem('token', t);
      localStorage.setItem('user', JSON.stringify(u));
    }, { t: token, u: user });

    for (const s of screens) {
      const filename = `${s.name}_${dev.name}.webp`;
      const targetFile = path.join(ASSETS_DIR, filename);

      try {
        await page.goto(`${BASE_URL}${s.path}`, { waitUntil: 'domcontentloaded', timeout: 20000 });

        // Wait for real content: auth check done, all spinners gone, main mounted, and NOT bounced to login
        await page.waitForFunction(() => {
          const isVerifying = document.body.innerText.includes('Memverifikasi Sesi');
          const hasSpinners = document.querySelectorAll('.animate-spin').length > 0;
          const isLogin = window.location.pathname === '/login';
          const hasMain = document.querySelector('main') !== null || document.querySelector('form') !== null;
          return !isVerifying && !hasSpinners && hasMain && !isLogin;
        }, { timeout: 15000 }).catch(() => {});

        await new Promise(r => setTimeout(r, 1200));

        // Close mobile drawer overlay if open
        if (dev.isMobile) {
          await page.evaluate(() => {
            const overlay = document.querySelector('.fixed.inset-0.bg-black\\/50') || document.querySelector('[class*="bg-black"]');
            if (overlay) overlay.click();
          }).catch(() => {});
          await new Promise(r => setTimeout(r, 400));
        }

        await page.screenshot({ path: targetFile, type: 'webp', quality: 90 });
        const sz = fs.statSync(targetFile).size;
        console.log(`[SAVED] ${filename} (${sz} bytes)`);
        captured.push({ ...s, device: dev.name, filename, targetFile, size: sz });
      } catch (err) {
        console.error(`[ERROR] capturing ${filename}:`, err.message);
      }
    }

    await page.close();
  }

  await browser.close();

  // Audit local uniqueness
  console.log('\n=== Checking local file uniqueness for Pimpinan ===');
  const hashes = {};
  let dups = 0;
  for (const item of captured) {
    const buf = fs.readFileSync(item.targetFile);
    const h = crypto.createHash('md5').update(buf).digest('hex');
    if (hashes[h]) {
      console.error(`❌ DUPLICATE DETECTED: ${item.filename} matches ${hashes[h]}!`);
      dups++;
    } else {
      hashes[h] = item.filename;
    }
  }

  if (dups > 0) {
    throw new Error(`Audit failed: ${dups} duplicate files detected in Pimpinan! Aborting sync.`);
  }
  console.log(`🎉 100% PERFECT! ZERO duplicate hashes in Pimpinan! All ${captured.length} screenshots are unique!`);

  // Upload to Cloudinary & Upsert DB
  console.log('\n=== Uploading to Cloudinary & Upserting DB for Pimpinan ===');
  let syncCount = 0;
  for (const item of captured) {
    const publicId = `guidebook/pimpinan/${item.name}_${item.device}`;
    try {
      const uploadRes = await cloudinary.uploader.upload(item.targetFile, {
        folder: 'guidebook/pimpinan',
        public_id: `${item.name}_${item.device}`,
        overwrite: true,
        resource_type: 'image'
      });
      const secureUrl = uploadRes.secure_url;
      console.log(`[CLOUDINARY] Uploaded: ${publicId} -> ${secureUrl}`);

      await prisma.guidebook_screenshot.upsert({
        where: {
          role_modul_bagian_device: {
            role: 'pimpinan',
            modul: item.modul,
            bagian: item.bagian,
            device: item.device
          }
        },
        update: {
          url: secureUrl,
          updatedAt: new Date()
        },
        create: {
          role: 'pimpinan',
          modul: item.modul,
          bagian: item.bagian,
          device: item.device,
          url: secureUrl
        }
      });
      syncCount++;
    } catch (err) {
      console.error(`[ERROR] uploading/upserting ${publicId}:`, err.message);
    }
  }

  console.log(`\nSuccessfully uploaded and registered ${syncCount}/${captured.length} Pimpinan screenshots!`);
  await prisma.$disconnect();
}

run().catch(e => {
  console.error("FATAL ERROR in fix_pimpinan_all:", e);
  process.exit(1);
});
