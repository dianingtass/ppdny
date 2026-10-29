module.paths.push('c:/laragon/www/ppdny/server/node_modules');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'c:/laragon/www/ppdny/server/.env' });
const prisma = require('c:/laragon/www/ppdny/server/src/config/prisma');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';

const rolesConfig = [
  { role: 'admin', route: '/admin/guidebook' },
  { role: 'pengurus', route: '/pengurus/guidebook' },
  { role: 'pimpinan', route: '/pimpinan/guidebook' },
  { role: 'santri', route: '/santri/guidebook' },
  { role: 'timkesehatan', route: '/timkesehatan/guidebook' },
  { role: 'orangtua', route: '/orangtua/guidebook' },
  { role: 'ustadz', route: '/ustadz/guidebook' },
  { role: 'ppdb', route: '/ppdb/guidebook', isPublic: true }
];

async function auditPages() {
  console.log('=== DEEP AUDIT OF GUIDEBOOK PAGE CONTENTS & PRINT RENDERING ===\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  for (const cfg of rolesConfig) {
    console.log(`Checking role: ${cfg.role.toUpperCase()} ...`);

    if (!cfg.isPublic) {
      const user = await prisma.users.findFirst({
        where: { user_role: { some: { role: { role: cfg.role } } } }
      });
      const token = jwt.sign(
        { id: user.id, email: user.email, role: cfg.role, nama: user.nama, nip: user.nip },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
      await page.evaluate(({ t, u }) => {
        localStorage.setItem('token', t);
        localStorage.setItem('user', JSON.stringify(u));
      }, { t: token, u: user });
    }

    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto(`${BASE_URL}${cfg.route}`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('main section, main', { timeout: 15000 });
    await new Promise(r => setTimeout(r, 1200));

    const audit = await page.evaluate(() => {
      const main = document.querySelector('main');
      if (!main) return { error: 'No main element found' };

      const sections = Array.from(document.querySelectorAll('main section'));
      const imgs = Array.from(document.querySelectorAll('main img'));
      const brokenImgs = imgs.filter(img => !img.complete || img.naturalWidth === 0).map(img => img.src);
      const tables = Array.from(document.querySelectorAll('main table'));
      const headings = Array.from(document.querySelectorAll('main h1, main h2, main h3')).map(h => h.innerText);
      const callouts = Array.from(document.querySelectorAll('main [class*="border-l-4"]'));
      const textLen = main.innerText.length;

      // Check for raw unparsed markdown symbols in text
      const rawMarkdownMatches = (main.innerText.match(/\{section:[a-z0-9_-]+\}/g) || []).length;
      const unparsedImages = (main.innerText.match(/!\[.*?\]\(.*?\)/g) || []).length;

      return {
        sectionCount: sections.length,
        imgCount: imgs.length,
        brokenImgCount: brokenImgs.length,
        brokenImgs,
        tableCount: tables.length,
        headingCount: headings.length,
        calloutCount: callouts.length,
        textLen,
        rawMarkdownMatches,
        unparsedImages
      };
    });

    console.log(`  Sections: ${audit.sectionCount} | Headings: ${audit.headingCount} | Images: ${audit.imgCount} | Tables: ${audit.tableCount} | Callouts: ${audit.calloutCount}`);
    console.log(`  Content length: ${audit.textLen} chars | Broken images: ${audit.brokenImgCount}`);

    if (audit.brokenImgCount > 0) {
      console.error(`  ❌ BROKEN IMAGES in ${cfg.role}:`, audit.brokenImgs);
    }
    if (audit.rawMarkdownMatches > 0) {
      console.warn(`  ⚠️ UNPARSED {section:...} tags found: ${audit.rawMarkdownMatches}`);
    }
    if (audit.unparsedImages > 0) {
      console.warn(`  ⚠️ UNPARSED ![...](...) tags found: ${audit.unparsedImages}`);
    }
    if (consoleErrors.length > 0) {
      console.warn(`  Browser console errors: ${consoleErrors.length}`);
    }

    const isOk = audit.brokenImgCount === 0 && audit.rawMarkdownMatches === 0 && audit.unparsedImages === 0;
    console.log(`  Status: ${isOk ? '✅ PERFECT' : '⚠️ ATTENTION NEEDED'}\n`);
  }

  await browser.close();
  await prisma.$disconnect();
}

auditPages().catch(e => {
  console.error("FATAL ERROR:", e);
  process.exit(1);
});
