module.paths.push('c:/laragon/www/ppdny/server/node_modules');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'c:/laragon/www/ppdny/server/.env' });
const prisma = require('c:/laragon/www/ppdny/server/src/config/prisma');
const { cloudinary } = require('c:/laragon/www/ppdny/server/src/config/cloudinary');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';

const pimpinanScreens = [
  { name: 'dashboard_utama',   modul: 'dashboard',  bagian: 'utama' },
  { name: 'santri_daftar',     modul: 'santri',     bagian: 'daftar' },
  { name: 'ustadz_daftar',     modul: 'ustadz',     bagian: 'daftar' },
  { name: 'staf_daftar',       modul: 'staf',       bagian: 'daftar' },
  { name: 'orangtua_daftar',   modul: 'orangtua',   bagian: 'daftar' },
  { name: 'kelas_kamar',       modul: 'kelas',      bagian: 'kamar' },
  { name: 'kegiatan_daftar',   modul: 'kegiatan',   bagian: 'daftar' },
  { name: 'layanan_riwayat',   modul: 'layanan',    bagian: 'riwayat' },
  { name: 'pengaduan_daftar',  modul: 'pengaduan',  bagian: 'daftar' },
  { name: 'keuangan_laporan',  modul: 'keuangan',   bagian: 'laporan' },
  { name: 'feedback_evaluasi', modul: 'feedback',   bagian: 'evaluasi' },
  { name: 'ppdb_rekapitulasi', modul: 'ppdb',       bagian: 'rekapitulasi' },
  { name: 'ppdb_pendaftar',    modul: 'ppdb',       bagian: 'pendaftar' },
  { name: 'absensi_daftar',    modul: 'absensi',    bagian: 'daftar' },
  { name: 'screening_daftar',  modul: 'screening',  bagian: 'daftar' },
  { name: 'observasi_daftar',  modul: 'observasi',  bagian: 'daftar' },
  { name: 'profil_utama',      modul: 'profil',     bagian: 'utama' },
];

async function syncAll() {
  console.log('=== Step 1: Copying Pimpinan Mobile Screens ===');
  const pimDir = path.resolve('c:/laragon/www/ppdny/client/public/assets/guidebook/pimpinan');
  for (const s of pimpinanScreens) {
    const src = path.resolve(`c:/laragon/www/ppdny/scratch/test_pim_mob_${s.name}.webp`);
    const dst = path.join(pimDir, `${s.name}_mobile.webp`);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dst);
      console.log(`Copied ${s.name}_mobile.webp (${fs.statSync(dst).size} bytes)`);
    } else {
      console.error(`Source not found: ${src}`);
    }
  }

  console.log('\n=== Step 2: Capturing Timkes Absensi Form (Desktop & Mobile) ===');
  const timkesDir = path.resolve('c:/laragon/www/ppdny/client/public/assets/guidebook/timkesehatan');
  const timkesUser = await prisma.users.findFirst({
    where: { user_role: { some: { role: { role: 'timkesehatan' } } } }
  });
  const timkesToken = jwt.sign(
    { id: timkesUser.id, email: timkesUser.email, role: 'timkesehatan', nama: timkesUser.nama, nip: timkesUser.nip },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  // Desktop
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(({ t, u }) => {
      localStorage.setItem('token', t);
      localStorage.setItem('user', JSON.stringify(u));
    }, { t: timkesToken, u: timkesUser });

    await page.goto(`${BASE_URL}/timkesehatan/daftarAbsensiKamar/1/create`, { waitUntil: 'networkidle2' });
    await page.waitForFunction(() => !document.body.innerText.includes('Memverifikasi Sesi') && document.querySelectorAll('.animate-spin').length === 0, { timeout: 15000 });
    await new Promise(r => setTimeout(r, 1500));
    const targetDesk = path.join(timkesDir, 'absensi_form_desktop.webp');
    await page.screenshot({ path: targetDesk, type: 'webp', quality: 90 });
    console.log(`[TIMKES SAVED] absensi_form_desktop.webp (${fs.statSync(targetDesk).size} bytes)`);
    await page.close();
  }

  // Mobile
  {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(({ t, u }) => {
      localStorage.setItem('token', t);
      localStorage.setItem('user', JSON.stringify(u));
    }, { t: timkesToken, u: timkesUser });

    await page.goto(`${BASE_URL}/timkesehatan/daftarAbsensiKamar/1/create`, { waitUntil: 'networkidle2' });
    await page.waitForFunction(() => !document.body.innerText.includes('Memverifikasi Sesi') && document.querySelectorAll('.animate-spin').length === 0, { timeout: 15000 });
    await new Promise(r => setTimeout(r, 1500));
    await page.evaluate(() => {
      const overlay = document.querySelector('.fixed.inset-0.bg-black\\/50') || document.querySelector('[class*="bg-black"]');
      if (overlay) overlay.click();
    }).catch(() => {});
    await new Promise(r => setTimeout(r, 300));

    const targetMob = path.join(timkesDir, 'absensi_form_mobile.webp');
    await page.screenshot({ path: targetMob, type: 'webp', quality: 90 });
    console.log(`[TIMKES SAVED] absensi_form_mobile.webp (${fs.statSync(targetMob).size} bytes)`);
    await page.close();
  }

  await browser.close();

  console.log('\n=== Step 3: Uploading Pimpinan Mobile Screens to Cloudinary & Upserting DB ===');
  for (const s of pimpinanScreens) {
    const filename = `${s.name}_mobile.webp`;
    const filepath = path.join(pimDir, filename);
    const publicId = `guidebook/pimpinan/${s.name}_mobile`;

    try {
      const uploadRes = await cloudinary.uploader.upload(filepath, {
        folder: 'guidebook/pimpinan',
        public_id: `${s.name}_mobile`,
        overwrite: true,
        resource_type: 'image'
      });
      const secureUrl = uploadRes.secure_url;
      console.log(`[CLOUDINARY] Uploaded: ${publicId} -> ${secureUrl}`);

      await prisma.guidebook_screenshot.upsert({
        where: {
          role_modul_bagian_device: {
            role: 'pimpinan',
            modul: s.modul,
            bagian: s.bagian,
            device: 'mobile'
          }
        },
        update: {
          url: secureUrl,
          updatedAt: new Date()
        },
        create: {
          role: 'pimpinan',
          modul: s.modul,
          bagian: s.bagian,
          device: 'mobile',
          url: secureUrl
        }
      });
    } catch (e) {
      console.error(`[ERROR] uploading ${publicId}:`, e.message);
    }
  }

  console.log('\n=== Step 4: Uploading Timkes Absensi Form (Desktop & Mobile) to Cloudinary & Upserting DB ===');
  for (const device of ['desktop', 'mobile']) {
    const filename = `absensi_form_${device}.webp`;
    const filepath = path.join(timkesDir, filename);
    const publicId = `guidebook/timkesehatan/absensi_form_${device}`;

    try {
      const uploadRes = await cloudinary.uploader.upload(filepath, {
        folder: 'guidebook/timkesehatan',
        public_id: `absensi_form_${device}`,
        overwrite: true,
        resource_type: 'image'
      });
      const secureUrl = uploadRes.secure_url;
      console.log(`[CLOUDINARY] Uploaded: ${publicId} -> ${secureUrl}`);

      await prisma.guidebook_screenshot.upsert({
        where: {
          role_modul_bagian_device: {
            role: 'timkesehatan',
            modul: 'absensi',
            bagian: 'form',
            device: device
          }
        },
        update: {
          url: secureUrl,
          updatedAt: new Date()
        },
        create: {
          role: 'timkesehatan',
          modul: 'absensi',
          bagian: 'form',
          device: device,
          url: secureUrl
        }
      });
    } catch (e) {
      console.error(`[ERROR] uploading ${publicId}:`, e.message);
    }
  }

  console.log('\n🎉 ALL PIMPINAN MOBILE AND TIMKES ABSENSI FORM SCREENSHOTS SYNCED SUCCESSFULLY!');
  await prisma.$disconnect();
}

syncAll().catch(e => {
  console.error("FATAL ERROR:", e);
  process.exit(1);
});
