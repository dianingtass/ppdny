module.paths.push('c:/laragon/www/ppdny/server/node_modules');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: 'c:/laragon/www/ppdny/server/.env' });
const prisma = require('c:/laragon/www/ppdny/server/src/config/prisma');
const { cloudinary } = require('c:/laragon/www/ppdny/server/src/config/cloudinary');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ASSETS_DIR = path.resolve('c:/laragon/www/ppdny/client/public/assets/guidebook/ppdb');
const BASE_URL = 'http://localhost:5173';
const DUMMY_FILE = path.resolve('c:/laragon/www/ppdny/scratch/dummy.png');

if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

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
    console.log(`\n=== Capturing PPDB for ${dev.name.toUpperCase()} ===`);
    const page = await browser.newPage();
    await page.setViewport({
      width: dev.width,
      height: dev.height,
      isMobile: dev.isMobile,
      hasTouch: dev.hasTouch
    });

    const snap = async (bagian) => {
      const filename = `ppdb_${bagian}_${dev.name}.webp`;
      const filepath = path.join(ASSETS_DIR, filename);
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({ path: filepath, type: 'webp', quality: 90 });
      console.log(`[SAVED] ${filename} (${fs.statSync(filepath).size} bytes)`);
      targets.push({ modul: 'ppdb', bagian, device: dev.name, filename, filepath });
    };

    // 1. Landing Hero PPDB
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 800));
    await snap('landing_hero');

    // 2. Form Step 1 - Gelombang
    await page.goto(`${BASE_URL}/ppdb/daftar`, { waitUntil: 'networkidle2' });
    await page.waitForFunction(() => document.body.innerText.includes('Pilih Gelombang') || document.body.innerText.includes('Gelombang'), { timeout: 10000 });
    // Click gelombang button
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const gelombangBtn = btns.find(b => b.innerText.includes('Gelombang 1') || b.innerText.includes('Gelombang'));
      if (gelombangBtn) gelombangBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await snap('form_gelombang');

    // Advance to Step 2 - Data Diri
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const nextBtn = btns.find(b => b.innerText.includes('Lanjut'));
      if (nextBtn) nextBtn.click();
    });
    await page.waitForFunction(() => document.body.innerText.includes('Data Diri Calon Santri'), { timeout: 10000 });
    await new Promise(r => setTimeout(r, 500));

    // Fill sample Data Diri with React native prototype setters
    await page.evaluate(() => {
      const setVal = (selector, val) => {
        const el = document.querySelector(selector);
        if (el) {
          const proto = el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype :
                        el.tagName === 'SELECT' ? window.HTMLSelectElement.prototype :
                        window.HTMLInputElement.prototype;
          const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
          if (setter) {
            setter.call(el, val);
          } else {
            el.value = val;
          }
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }
      };
      setVal('input[name="nama_lengkap"]', 'Fauzan Adzim');
      setVal('input[name="nama_panggilan"]', 'Fauzan');
      setVal('select[name="jenis_kelamin"]', 'Laki_laki');
      setVal('input[name="tempat_lahir"]', 'Sleman');
      setVal('input[name="tanggal_lahir"]', '2010-05-14');
      setVal('input[name="anak_ke"]', '1');
      setVal('input[name="jumlah_saudara"]', '3');
      setVal('textarea[name="alamat"]', 'Jl. Kaliurang KM 12, Sleman, D.I. Yogyakarta');
      setVal('input[name="no_hp"]', '081234567890');
      setVal('input[name="asal_sekolah"]', 'SMP Negeri 1 Sleman');
      setVal('input[name="nilai_rata_rapor"]', '88.5');
      setVal('select[name="kemampuan_quran"]', 'Al_Quran');
    });
    await new Promise(r => setTimeout(r, 600));
    await snap('form_datadiri');

    // Advance to Step 3 - Data Wali
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const nextBtn = btns.find(b => b.innerText.includes('Lanjut'));
      if (nextBtn) nextBtn.click();
    });
    await page.waitForFunction(() => document.body.innerText.includes('Data Wali Santri'), { timeout: 10000 });
    await new Promise(r => setTimeout(r, 500));

    // Fill sample Data Wali
    await page.evaluate(() => {
      const setVal = (selector, val) => {
        const el = document.querySelector(selector);
        if (el) {
          const proto = el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype :
                        el.tagName === 'SELECT' ? window.HTMLSelectElement.prototype :
                        window.HTMLInputElement.prototype;
          const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
          if (setter) {
            setter.call(el, val);
          } else {
            el.value = val;
          }
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }
      };
      setVal('input[name="nama"]', 'Hartono Sudiro');
      setVal('input[name="no_hp"]', '081298765432');
      setVal('input[name="pekerjaan"]', 'Wiraswasta');
      setVal('input[placeholder*="3.000.000"]', '5000000');
    });
    await new Promise(r => setTimeout(r, 600));
    await snap('form_datawali');

    // Advance to Step 4 - Upload Dokumen & Pembayaran
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const saveBtn = btns.find(b => b.innerText.includes('Simpan & Lanjut'));
      if (saveBtn) saveBtn.click();
    });
    await page.waitForFunction(() => document.body.innerText.includes('Pendaftaran Tahap 1 Berhasil') || document.body.innerText.includes('Bukti Transfer'), { timeout: 15000 });
    await new Promise(r => setTimeout(r, 800));
    await snap('form_dokumen');

    // Upload dummy proof to enable finish button, then advance to Step 5 (Selesai)
    const fileInput = await page.$('input[type="file"]');
    if (fileInput && fs.existsSync(DUMMY_FILE)) {
      await fileInput.uploadFile(DUMMY_FILE);
      await new Promise(r => setTimeout(r, 1500));
    }
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const finishBtn = btns.find(b => b.innerText.includes('Selesai Berkas'));
      if (finishBtn) finishBtn.click();
    });
    await page.waitForFunction(() => document.body.innerText.includes('Selesai!') || document.body.innerText.includes('Cetak Bukti'), { timeout: 10000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 800));
    await snap('form_selesai');

    // 7. Cek Status - Form Pencarian awal
    await page.goto(`${BASE_URL}/ppdb/cek-status`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('input[placeholder*="Nomor Pendaftaran"], input[type="text"]', { timeout: 10000 });
    await page.type('input[placeholder*="Nomor Pendaftaran"], input[type="text"]', 'PPDB-2026-');
    await new Promise(r => setTimeout(r, 500));
    await snap('status_pencarian');

    // 8. Modal Lupa Nomor
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const forgotBtn = btns.find(b => b.innerText.includes('Lupa Nomor') || b.innerText.includes('Lupa'));
      if (forgotBtn) forgotBtn.click();
    });
    await new Promise(r => setTimeout(r, 700));
    await snap('status_modal_lupa');

    // Close modal
    await page.evaluate(() => {
      const closeBtn = document.querySelector('button[class*="lucide-x"], button svg.lucide-x')?.closest('button') || 
                       Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Tutup') || b.innerText.includes('Batal'));
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // 9. Cek Status - Verifikasi (PPDB-2026-G1-0005)
    await page.goto(`${BASE_URL}/ppdb/cek-status?no=PPDB-2026-G1-0005`, { waitUntil: 'networkidle2' });
    await page.waitForFunction(() => document.body.innerText.includes('Nabila Putri') || document.body.innerText.includes('Verifikasi'), { timeout: 10000 });
    await new Promise(r => setTimeout(r, 800));
    await snap('status_verifikasi');

    // 10. Cek Status - Seleksi (PPDB-2026-G1-0004)
    await page.goto(`${BASE_URL}/ppdb/cek-status?no=PPDB-2026-G1-0004`, { waitUntil: 'networkidle2' });
    await page.waitForFunction(() => document.body.innerText.includes('Raka Prasetyo') || document.body.innerText.includes('Seleksi'), { timeout: 10000 });
    await new Promise(r => setTimeout(r, 800));
    await snap('status_seleksi');

    // 11. Cek Status - Lulus (PPDB-20262027-G2-0001)
    await page.goto(`${BASE_URL}/ppdb/cek-status?no=PPDB-20262027-G2-0001`, { waitUntil: 'networkidle2' });
    await page.waitForFunction(() => document.body.innerText.includes('Dianingtas Hartono') || document.body.innerText.includes('Lulus'), { timeout: 10000 });
    await new Promise(r => setTimeout(r, 800));
    await snap('status_lulus');

    // 12. Cek Status - Diterima (PPDB-2026-G1-0001)
    await page.goto(`${BASE_URL}/ppdb/cek-status?no=PPDB-2026-G1-0001`, { waitUntil: 'networkidle2' });
    await page.waitForFunction(() => document.body.innerText.includes('Ahmad Fauzi') || document.body.innerText.includes('Diterima'), { timeout: 10000 });
    await new Promise(r => setTimeout(r, 800));
    await snap('status_diterima');

    await page.close();
  }

  await browser.close();
  console.log(`\nTotal local PPDB screenshots captured: ${targets.length}`);

  // Upload to Cloudinary & Upsert Database
  console.log(`\n=== Uploading to Cloudinary & Upserting Database ===`);
  let uploadedCount = 0;

  for (const item of targets) {
    const publicId = `guidebook/ppdb/${item.modul}_${item.bagian}_${item.device}`;
    try {
      const uploadRes = await cloudinary.uploader.upload(item.filepath, {
        folder: 'guidebook/ppdb',
        public_id: `${item.modul}_${item.bagian}_${item.device}`,
        overwrite: true,
        resource_type: 'image'
      });
      const secureUrl = uploadRes.secure_url;
      console.log(`[CLOUDINARY] Uploaded: ${publicId} -> ${secureUrl}`);

      await prisma.guidebook_screenshot.upsert({
        where: {
          role_modul_bagian_device: {
            role: 'ppdb',
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
          role: 'ppdb',
          modul: item.modul,
          bagian: item.bagian,
          device: item.device,
          url: secureUrl
        }
      });
      uploadedCount++;
    } catch (err) {
      console.error(`[ERROR] Failed to upload/upsert ${publicId}:`, err.message);
    }
  }

  console.log(`\nSuccessfully uploaded and registered ${uploadedCount}/${targets.length} PPDB screenshots!`);
  await prisma.$disconnect();
}

captureAll().catch(err => {
  console.error("FATAL ERROR in captureAll:", err);
  process.exit(1);
});
