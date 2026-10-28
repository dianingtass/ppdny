module.paths.push('c:/laragon/www/ppdny/server/node_modules');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'c:/laragon/www/ppdny/server/.env' });
const prisma = require('c:/laragon/www/ppdny/server/src/config/prisma');
const { cloudinary } = require('c:/laragon/www/ppdny/server/src/config/cloudinary');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ASSETS_DIR = path.resolve('c:/laragon/www/ppdny/client/public/assets/guidebook/orangtua');
const BASE_URL = 'http://localhost:5173';

if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

// Generate valid JWT for Orang Tua (User ID 15: Joko Susilo)
const token = jwt.sign(
  {
    id: 15,
    email: 'ayah@gmail.com',
    role: 'orangtua',
    nama: 'Joko Susilo'
  },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

const userObj = {
  id: 15,
  nama: 'Joko Susilo',
  email: 'ayah@gmail.com',
  role: 'orangtua'
};

async function captureAll() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const targets = [];

  const devices = [
    { name: 'desktop', width: 1280, height: 800, isMobile: false, hasTouch: false },
    { name: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true }
  ];

  for (const dev of devices) {
    console.log(`\n=== Capturing Orang Tua for ${dev.name.toUpperCase()} ===`);
    const page = await browser.newPage();
    await page.setViewport({
      width: dev.width,
      height: dev.height,
      isMobile: dev.isMobile,
      hasTouch: dev.hasTouch
    });

    const snap = async (modul, bagian) => {
      const filename = `${modul}_${bagian}_${dev.name}.webp`;
      const filepath = path.join(ASSETS_DIR, filename);
      await new Promise(r => setTimeout(r, 600)); // settling time
      await page.screenshot({ path: filepath, type: 'webp', quality: 90 });
      console.log(`[SAVED] ${filename}`);
      targets.push({ modul, bagian, device: dev.name, filename, filepath });
    };

    // 1. Auth Login (Fresh session)
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle2' });
    await page.waitForSelector('input[name="identifier"], input[placeholder*="Email"], input[type="text"]', { timeout: 5000 });
    await page.type('input[name="identifier"], input[placeholder*="Email"], input[type="text"]', 'ayah@gmail.com');
    await snap('auth', 'login');

    // 2. Auth Lupa Password
    const lupaBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.innerText.includes('Lupa Kata Sandi') || b.innerText.includes('Lupa'));
    });
    if (lupaBtn) {
      await lupaBtn.click();
      await new Promise(r => setTimeout(r, 700));
      await snap('auth', 'lupa_password');
    }

    // Set Session on landing page
    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(({ tok, usr }) => {
      localStorage.setItem('token', tok);
      localStorage.setItem('user', JSON.stringify(usr));
      localStorage.setItem('active_santri_id', '45');
    }, { tok: token, usr: userObj });

    // 3. Dashboard Utama
    await page.goto(`${BASE_URL}/orangtua`, { waitUntil: 'networkidle2' });
    await page.waitForFunction(() => document.body.innerText.includes('Ahmad Fauzi') || document.body.innerText.includes('Dashboard'), { timeout: 10000 });
    await snap('dashboard', 'utama');

    // 4. Dashboard Switch Anak
    const selectElem = await page.$('select');
    if (selectElem) {
      await selectElem.focus();
    }
    await snap('dashboard', 'switch_anak');

    // 5. Dashboard Notifikasi
    await page.evaluate(() => {
      const bell = document.querySelector('button[aria-label="Notifikasi"], .lucide-bell')?.closest('button');
      if (bell) bell.click();
      else {
        const btns = Array.from(document.querySelectorAll('button'));
        const nBtn = btns.find(b => b.innerHTML.includes('lucide-bell') || b.innerHTML.includes('Bell'));
        if (nBtn) nBtn.click();
      }
    });
    await new Promise(r => setTimeout(r, 600));
    await snap('dashboard', 'notifikasi');

    // 6. Keuangan Daftar
    await page.goto(`${BASE_URL}/orangtua/keuangan`, { waitUntil: 'networkidle2' });
    await page.waitForFunction(() => document.body.innerText.includes('Daftar Tagihan') || document.body.innerText.includes('Tagihan Aktif'), { timeout: 10000 });
    await snap('keuangan', 'daftar');

    // 7. Keuangan Detail Modal
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const detailBtn = btns.find(b => b.innerText.includes('Lihat Detail'));
      if (detailBtn) detailBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await snap('keuangan', 'detail');

    // 8. Keuangan Bayar Modal (Klik 'Tambah Data Pembayaran' di dalam TagihanModal)
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const bayarBtn = btns.find(b => b.innerText.includes('Tambah Data Pembayaran') || b.innerText.includes('Bayar'));
      if (bayarBtn) bayarBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await snap('keuangan', 'bayar');

    // 9. Kesehatan Dashboard
    await page.goto(`${BASE_URL}/orangtua/kesehatan`, { waitUntil: 'networkidle2' });
    await page.waitForFunction(() => document.body.innerText.includes('Analitik Monitoring') || document.body.innerText.includes('Monitoring Scabies'), { timeout: 10000 });
    await snap('kesehatan', 'dashboard');

    // 10. Kesehatan Screening Portal
    await page.goto(`${BASE_URL}/orangtua/daftarSantriScreening/45`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1200));
    await snap('kesehatan', 'screening_portal');

    // 11. Kesehatan Observasi Portal
    await page.goto(`${BASE_URL}/orangtua/daftarSantriObservasi/45`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1200));
    await snap('kesehatan', 'observasi_portal');

    // 12. Kegiatan Daftar
    await page.goto(`${BASE_URL}/orangtua/kegiatan`, { waitUntil: 'networkidle2' });
    await page.waitForFunction(() => document.body.innerText.includes('Kegiatan Anak'), { timeout: 10000 });
    await snap('kegiatan', 'daftar');

    // 13. Kegiatan Detail Modal (Klik tombol 'Lihat Rincian')
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const detailBtn = btns.find(b => b.innerText.includes('Lihat Rincian') || b.innerText.includes('Rincian'));
      if (detailBtn) detailBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await snap('kegiatan', 'detail');

    // 14. Pengaduan Daftar
    await page.goto(`${BASE_URL}/orangtua/pengaduan`, { waitUntil: 'networkidle2' });
    await page.waitForFunction(() => document.body.innerText.includes('Laporan Pengaduan Anak'), { timeout: 10000 });
    await snap('pengaduan', 'daftar');

    // 15. Pengaduan Buat Modal (Handle desktop & mobile button)
    await page.evaluate(() => {
      const createBtn = document.querySelector('button.bg-orange-500, button.bg-orange-600') ||
        Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Buat Laporan') || b.querySelector('svg.lucide-plus'));
      if (createBtn) createBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await snap('pengaduan', 'buat');

    // Close create modal
    await page.evaluate(() => {
      const closeBtns = Array.from(document.querySelectorAll('button'));
      const xBtn = closeBtns.find(b => b.querySelector('svg.lucide-x') || b.innerText === 'Batal' || b.innerText === 'Tutup');
      if (xBtn) xBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // 16. Pengaduan Detail Modal
    await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('div[class*="cursor-pointer"], .bg-white.rounded-2xl'));
      const pengaduanItem = items.find(el => el.innerText.includes('Lemari') || el.innerText.includes('Selesai') || el.innerText.includes('Menunggu') || el.innerText.includes('Aduan'));
      if (pengaduanItem) pengaduanItem.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await snap('pengaduan', 'detail');

    // 17. Profil Utama
    await page.goto(`${BASE_URL}/orangtua/profil`, { waitUntil: 'networkidle2' });
    await page.waitForFunction(() => document.body.innerText.includes('Informasi Pribadi') || document.body.innerText.includes('Joko Susilo'), { timeout: 10000 });
    await snap('profil', 'utama');

    // 18. Profil Modal Password (Klik 'Ganti Sandi')
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const passBtn = btns.find(b => b.innerText.includes('Ganti Sandi') || b.innerText.includes('Ganti Kata Sandi') || b.innerText.includes('Kata Sandi'));
      if (passBtn) passBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await snap('profil', 'password');

    await page.close();
  }

  await browser.close();
  console.log(`\nTotal local Orang Tua screenshots captured: ${targets.length}`);

  // Upload to Cloudinary & Database Upsert
  console.log(`\n=== Uploading to Cloudinary & Upserting Database ===`);
  let uploadedCount = 0;

  for (const item of targets) {
    const publicId = `guidebook/orangtua/${item.modul}_${item.bagian}_${item.device}`;
    try {
      const uploadRes = await cloudinary.uploader.upload(item.filepath, {
        folder: 'guidebook/orangtua',
        public_id: `${item.modul}_${item.bagian}_${item.device}`,
        overwrite: true,
        resource_type: 'image'
      });
      const secureUrl = uploadRes.secure_url;
      console.log(`[CLOUDINARY] Uploaded: ${publicId} -> ${secureUrl}`);

      await prisma.$executeRaw`
        INSERT INTO guidebook_screenshot (role, modul, bagian, device, url, createdAt, updatedAt)
        VALUES ('orangtua', ${item.modul}, ${item.bagian}, ${item.device}, ${secureUrl}, NOW(), NOW())
        ON DUPLICATE KEY UPDATE 
          url = ${secureUrl},
          updatedAt = NOW()
      `;
      uploadedCount++;
    } catch (err) {
      console.error(`[ERROR] Failed to upload/upsert ${publicId}:`, err.message);
    }
  }

  console.log(`\nSuccessfully uploaded and registered ${uploadedCount}/${targets.length} Orang Tua screenshots!`);
  await prisma.$disconnect();
}

captureAll().catch(err => {
  console.error("FATAL ERROR in captureAll:", err);
  process.exit(1);
});
