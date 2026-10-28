module.paths.push('c:/laragon/www/ppdny/server/node_modules');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'c:/laragon/www/ppdny/server/.env' });
const prisma = require('c:/laragon/www/ppdny/server/src/config/prisma');
const { cloudinary } = require('c:/laragon/www/ppdny/server/src/config/cloudinary');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ASSETS_DIR = path.resolve('c:/laragon/www/ppdny/client/public/assets/guidebook/ustadz');
const BASE_URL = 'http://localhost:5173';

const token = jwt.sign(
  { id: 3, email: 'ustadz@ppdny.id', role: 'ustadz', nama: 'Ustadz Abdul Hamid', nip: 'UST001' },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
const userObj = { id: 3, nama: 'Ustadz Abdul Hamid', email: 'ustadz@ppdny.id', role: 'ustadz', nip: 'UST001' };

async function fixUstadzModalDetail() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const targets = [];

  for (const device of ['desktop', 'mobile']) {
    console.log(`\n=== Capturing Ustadz kegiatan_modal_detail for ${device.toUpperCase()} ===`);
    const page = await browser.newPage();
    if (device === 'mobile') {
      await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    } else {
      await page.setViewport({ width: 1280, height: 800 });
    }

    await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(({ t, u }) => {
      localStorage.setItem('token', t);
      localStorage.setItem('user', JSON.stringify(u));
    }, { t: token, u: userObj });

    await page.goto(`${BASE_URL}/ustadz/kegiatan`, { waitUntil: 'networkidle2' });
    await page.waitForFunction(() => document.body.innerText.includes('Lihat Rincian'), { timeout: 10000 });

    if (device === 'mobile') {
      await page.evaluate(() => {
        const overlay = document.querySelector('.fixed.inset-0.bg-black\\/50') || document.querySelector('[class*="bg-black"]');
        if (overlay) overlay.click();
      }).catch(() => {});
      await new Promise(r => setTimeout(r, 400));
    }

    // Click "Lihat Rincian" to open DetailKegiatanModal
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.innerText.includes('Lihat Rincian') || b.innerText.includes('Rincian'));
      if (btn) btn.click();
    });

    await new Promise(r => setTimeout(r, 1000));

    const filename = `kegiatan_modal_detail_${device}.png`;
    const filepath = path.join(ASSETS_DIR, filename);
    await page.screenshot({ path: filepath });
    console.log(`[SAVED] ${filename} (${fs.statSync(filepath).size} bytes)`);

    targets.push({ device, filename, filepath });
    await page.close();
  }

  await browser.close();

  // Upload to Cloudinary & Upsert DB
  for (const item of targets) {
    const publicId = `guidebook/ustadz/guidebook_ustadz_kegiatan_modal_detail_${item.device}`;
    const uploadRes = await cloudinary.uploader.upload(item.filepath, {
      folder: 'guidebook/ustadz',
      public_id: `guidebook_ustadz_kegiatan_modal_detail_${item.device}`,
      overwrite: true,
      resource_type: 'image'
    });
    const secureUrl = uploadRes.secure_url;
    console.log(`[CLOUDINARY] Uploaded: ${publicId} -> ${secureUrl}`);

    await prisma.$executeRaw`
      UPDATE guidebook_screenshot
      SET url = ${secureUrl}, updatedAt = NOW()
      WHERE role = 'ustadz' AND modul = 'kegiatan' AND bagian = 'modal_detail' AND device = ${item.device}
    `;
  }

  console.log('\nUstadz kegiatan_modal_detail successfully updated on Cloudinary & DB!');
  await prisma.$disconnect();
}

fixUstadzModalDetail().catch(err => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});
