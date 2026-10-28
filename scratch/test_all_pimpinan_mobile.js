module.paths.push('c:/laragon/www/ppdny/server/node_modules');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'c:/laragon/www/ppdny/server/.env' });
const prisma = require('c:/laragon/www/ppdny/server/src/config/prisma');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';

const screens = [
  { name: 'dashboard_utama',   path: '/pimpinan' },
  { name: 'santri_daftar',     path: '/pimpinan/data-santri' },
  { name: 'ustadz_daftar',     path: '/pimpinan/data-ustadz' },
  { name: 'staf_daftar',       path: '/pimpinan/data-staf' },
  { name: 'orangtua_daftar',   path: '/pimpinan/data-orangtua' },
  { name: 'kelas_kamar',       path: '/pimpinan/data-kelas' },
  { name: 'kegiatan_daftar',   path: '/pimpinan/kegiatan' },
  { name: 'layanan_riwayat',   path: '/pimpinan/riwayat-layanan' },
  { name: 'pengaduan_daftar',  path: '/pimpinan/pengaduan' },
  { name: 'keuangan_laporan',  path: '/pimpinan/keuangan' },
  { name: 'feedback_evaluasi', path: '/pimpinan/feedback' },
  { name: 'ppdb_rekapitulasi', path: '/pimpinan/ppdb/rekapitulasi' },
  { name: 'ppdb_pendaftar',    path: '/pimpinan/ppdb/pendaftar' },
  { name: 'absensi_daftar',    path: '/pimpinan/daftarAbsensiKamar' },
  { name: 'screening_daftar',  path: '/pimpinan/daftarSantriScreening' },
  { name: 'observasi_daftar',  path: '/pimpinan/daftarSantriObservasi' },
  { name: 'profil_utama',      path: '/pimpinan/profil' },
];

(async () => {
  const user = await prisma.users.findFirst({
    where: { user_role: { some: { role: { role: 'pimpinan' } } } }
  });

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

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(({ t, u }) => {
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
  }, { t: token, u: user });

  const hashes = {};
  let dups = 0;

  for (const s of screens) {
    await page.goto(`${BASE_URL}${s.path}`, { waitUntil: 'networkidle2' });
    await page.waitForFunction(() => {
      const isVerifying = document.body.innerText.includes('Memverifikasi Sesi');
      const hasSpinners = document.querySelectorAll('.animate-spin').length > 0;
      return !isVerifying && !hasSpinners;
    }, { timeout: 10000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 1000));

    // Ensure mobile sidebar is closed
    await page.evaluate(() => {
      const overlay = document.querySelector('.fixed.inset-0.bg-black\\/50') || document.querySelector('[class*="bg-black"]');
      if (overlay) overlay.click();
    }).catch(() => {});
    await new Promise(r => setTimeout(r, 300));

    const filepath = `c:/laragon/www/ppdny/scratch/test_pim_mob_${s.name}.webp`;
    await page.screenshot({ path: filepath, type: 'webp', quality: 90 });
    const buf = fs.readFileSync(filepath);
    const h = crypto.createHash('md5').update(buf).digest('hex');

    if (hashes[h]) {
      console.log(`❌ DUPLICATE: ${s.name} matches ${hashes[h]} (${buf.length} bytes)`);
      dups++;
    } else {
      hashes[h] = s.name;
      console.log(`✅ UNIQUE: ${s.name.padEnd(20)} -> ${buf.length} bytes | hash: ${h.slice(0, 8)}`);
    }
  }

  console.log(`\nResult: ${dups === 0 ? 'ALL 17 SCREENS UNIQUE!' : `${dups} DUPLICATES FOUND!`}`);
  await browser.close();
  await prisma.$disconnect();
})();
