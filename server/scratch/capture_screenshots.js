const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Target URL - bisa local atau deployed. Coba local dulu, kalau tidak respon, pindah ke deployed.
const LOCAL_URL = 'http://localhost:5173';
const DEPLOYED_URL = 'https://ppdny.vercel.app';

const ROLES_CONFIG = [
  {
    role: 'admin',
    email: 'admin@ppdny.id',
    password: 'password123',
    isMobile: false,
    pages: [
      { name: 'dashboard', path: '/admin' },
      { name: 'manajemen_staf', path: '/admin/data-staf' },
      { name: 'data_santri', path: '/admin/data-santri' },
      { name: 'data_orangtua', path: '/admin/data-orangtua' },
      { name: 'data_ustadz', path: '/admin/data-ustadz' },
      { name: 'data_kelas', path: '/admin/data-kelas' },
      { name: 'data_kamar', path: '/admin/data-kamar' },
      { name: 'jenis_layanan', path: '/admin/jenis-layanan' },
      { name: 'jenis_tagihan', path: '/admin/jenis-tagihan' },
      { name: 'pengaduan', path: '/admin/pengaduan' },
      { name: 'kegiatan', path: '/admin/kegiatan' },
      { name: 'riwayat_layanan', path: '/admin/riwayat-layanan' },
      { name: 'keuangan', path: '/admin/keuangan' },
      { name: 'feedback', path: '/admin/feedback' },
      { name: 'log_aktivitas', path: '/admin/log' },
      { name: 'materi_scabies', path: '/admin/manageMateri' },
      { name: 'screening', path: '/admin/daftarSantriScreening' },
      { name: 'observasi', path: '/admin/daftarSantriObservasi' },
      { name: 'absensi_kesehatan', path: '/admin/daftarAbsensiKamar' },
      { name: 'faq', path: '/admin/faq' }
    ]
  },
  {
    role: 'pimpinan',
    email: 'pimpinan@ppdny.id',
    password: 'password123',
    isMobile: false,
    pages: [
      { name: 'dashboard', path: '/pimpinan' },
      { name: 'data_santri', path: '/pimpinan/data-santri' },
      { name: 'data_ustadz', path: '/pimpinan/data-ustadz' },
      { name: 'materi_scabies', path: '/pimpinan/scabies/materi' },
      { name: 'pengaduan', path: '/pimpinan/pengaduan' },
      { name: 'keuangan', path: '/pimpinan/keuangan' },
      { name: 'feedback', path: '/pimpinan/feedback' },
      { name: 'screening', path: '/pimpinan/daftarSantriScreening' },
      { name: 'observasi', path: '/pimpinan/daftarSantriObservasi' },
      { name: 'faq', path: '/pimpinan/faq' }
    ]
  },
  {
    role: 'pengurus',
    email: 'pengurus@ppdny.id',
    password: 'password123',
    isMobile: false,
    pages: [
      { name: 'dashboard', path: '/pengurus' },
      { name: 'data_santri', path: '/pengurus/data-santri' },
      { name: 'data_orangtua', path: '/pengurus/data-orangtua' },
      { name: 'data_ustadz', path: '/pengurus/data-ustadz' },
      { name: 'data_kelas', path: '/pengurus/data-kelas' },
      { name: 'data_kamar', path: '/pengurus/data-kamar' },
      { name: 'jenis_layanan', path: '/pengurus/jenis-layanan' },
      { name: 'jenis_tagihan', path: '/pengurus/jenis-tagihan' },
      { name: 'riwayat_layanan', path: '/pengurus/riwayat-layanan' },
      { name: 'keuangan', path: '/pengurus/keuangan' },
      { name: 'kegiatan', path: '/pengurus/kegiatan' },
      { name: 'faq', path: '/pengurus/faq' }
    ]
  },
  {
    role: 'timkesehatan',
    email: 'timkes@ppdny.id',
    password: 'password123',
    isMobile: false,
    pages: [
      { name: 'dashboard', path: '/timkesehatan' },
      { name: 'materi_scabies', path: '/timkesehatan/manageMateri' },
      { name: 'screening', path: '/timkesehatan/daftarSantriScreening' },
      { name: 'observasi', path: '/timkesehatan/daftarSantriObservasi' },
      { name: 'absensi_kesehatan', path: '/timkesehatan/daftarAbsensiKamar' },
      { name: 'konsultasi', path: '/timkesehatan/konsultasi' },
      { name: 'faq', path: '/timkesehatan/faq' }
    ]
  },
  {
    role: 'orangtua',
    email: 'bapak@gmail.com',
    password: 'password123',
    isMobile: true,
    pages: [
      { name: 'dashboard', path: '/orangtua' },
      { name: 'kesehatan', path: '/orangtua/kesehatan' },
      { name: 'profil', path: '/orangtua/profil' },
      { name: 'kegiatan', path: '/orangtua/kegiatan' },
      { name: 'keuangan', path: '/orangtua/keuangan' },
      { name: 'pengaduan', path: '/orangtua/pengaduan' }
    ]
  }
];

async function checkUrl(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  try {
    console.log(`Checking connectivity to: ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 5000 });
    await browser.close();
    return true;
  } catch (err) {
    await browser.close();
    return false;
  }
}

async function run() {
  let baseUrl = LOCAL_URL;
  const isLocalAlive = await checkUrl(LOCAL_URL);
  if (!isLocalAlive) {
    console.log(`Local URL ${LOCAL_URL} not responding. Switching to Deployed URL: ${DEPLOYED_URL}`);
    baseUrl = DEPLOYED_URL;
  } else {
    console.log(`Using Local URL: ${LOCAL_URL}`);
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Buat folder output utama
  const baseDocsDir = path.join(__dirname, '..', '..', 'docs');
  const baseAssetsDir = path.join(baseDocsDir, 'assets');
  if (!fs.existsSync(baseDocsDir)) fs.mkdirSync(baseDocsDir, { recursive: true });
  if (!fs.existsSync(baseAssetsDir)) fs.mkdirSync(baseAssetsDir, { recursive: true });

  for (const config of ROLES_CONFIG) {
    console.log(`\n========================================`);
    console.log(`Processing role: ${config.role.toUpperCase()}`);
    console.log(`========================================`);

    // Set Viewport
    if (config.isMobile) {
      // Viewport HP (iPhone X size)
      await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
    } else {
      // Viewport Desktop
      await page.setViewport({ width: 1280, height: 800 });
    }

    const roleAssetsDir = path.join(baseAssetsDir, config.role);
    if (!fs.existsSync(roleAssetsDir)) fs.mkdirSync(roleAssetsDir, { recursive: true });

    // Go to Login
    console.log(`Navigating to login page...`);
    await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle2' });
    
    // Clear any previous session
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload({ waitUntil: 'networkidle2' });

    // Fill form
    console.log(`Logging in with ${config.email}...`);
    // Cari input identifier (NIS/No. HP/Email)
    await page.waitForSelector('input[type="text"]', { timeout: 5000 });
    await page.type('input[type="text"]', config.email);

    // Cari input password
    await page.waitForSelector('input[type="password"]', { timeout: 5000 });
    await page.type('input[type="password"]', config.password);

    // Submit
    const submitBtn = await page.waitForSelector('button[type="submit"]', { timeout: 5000 });
    await submitBtn.click();

    // Tunggu sampai redirect / login selesai
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {
      console.log('Navigation wait timed out, continuing...');
    });

    // Cek jika butuh pilih role (seperti step 2 login jika ada multi-role)
    const hasRoleSelection = await page.evaluate(() => {
      return document.body.innerText.includes('Pilih ruang kerja Anda');
    });

    if (hasRoleSelection) {
      console.log(`Role selection required. Selecting role: ${config.role}...`);
      // Klik button yang berisi teks role (misal: "ADMIN", "TIMKESEHATAN", dll.)
      await page.evaluate((targetRole) => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const targetBtn = buttons.find(b => b.innerText.toLowerCase().includes(targetRole));
        if (targetBtn) targetBtn.click();
      }, config.role);
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
    }

    // Ambil screenshot masing-masing halaman
    for (const pageConfig of config.pages) {
      console.log(`Navigating to ${pageConfig.name} (${pageConfig.path})...`);
      try {
        await page.goto(`${baseUrl}${pageConfig.path}`, { waitUntil: 'networkidle2', timeout: 15000 });
        
        // Tunggu sebentar agar animasi selesai & data ter-render (misal: charts, table)
        await new Promise(r => setTimeout(r, 2000));

        // Hilangkan toast alert atau install prompt jika ada agar tidak menutupi UI
        await page.evaluate(() => {
          // Cari toast/alert element
          const alerts = document.querySelectorAll('.alert, [role="alert"], #install-prompt');
          alerts.forEach(el => el.remove());
        });

        const screenshotPath = path.join(roleAssetsDir, `${pageConfig.name}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: false });
        console.log(`Screenshot saved: ${screenshotPath}`);
      } catch (err) {
        console.error(`Gagal mengambil screenshot ${pageConfig.name}: ${err.message}`);
      }
    }
  }

  await browser.close();
  console.log('\n========================================');
  console.log('Automated Screenshot Capture Finished!');
  console.log('========================================');
}

run().catch(err => {
  console.error('Fatal Error running screenshot automation:', err);
});
