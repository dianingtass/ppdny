module.paths.push('c:/laragon/www/ppdny/server/node_modules');
const puppeteer = require('puppeteer');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => {
    errors.push(err.message);
  });

  console.log('1. Navigating to login...');
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });
  await page.waitForSelector('input[name="identifier"], input[type="text"], input[type="email"]');
  
  const idInput = await page.$('input[name="identifier"]') || await page.$('input[type="text"]') || await page.$('input[type="email"]');
  await idInput.type('pimpinan@ppdny.id');

  const pwInput = await page.$('input[name="password"], input[type="password"]');
  await pwInput.type('password123');

  const submitBtn = await page.$('button[type="submit"]');
  await submitBtn.click();
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  console.log('2. Logged in successfully, URL:', page.url());

  console.log('3. Navigating to /pimpinan/guidebook...');
  await page.goto('http://localhost:5173/pimpinan/guidebook', { waitUntil: 'networkidle2' });
  await page.waitForSelector('main section', { timeout: 10000 });

  // Verify sections
  const expectedSections = [
    'pendahuluan',
    'dashboard',
    'kependidikan',
    'kegiatan_layanan',
    'pengaduan',
    'keuangan',
    'feedback',
    'ppdb',
    'kesehatan',
    'profil'
  ];

  const foundSections = await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('main section'));
    return sections.map(s => s.id);
  });

  console.log('Found sections in DOM:', foundSections);

  const missingSections = expectedSections.filter(s => !foundSections.includes(s));
  if (missingSections.length > 0) {
    throw new Error(`Missing sections: ${missingSections.join(', ')}`);
  }

  // Check TOC items count
  const tocCount = await page.evaluate(() => {
    return document.querySelectorAll('aside.w-72 nav button').length;
  });
  console.log('Desktop TOC button count:', tocCount);
  if (tocCount !== expectedSections.length) {
    throw new Error(`Expected ${expectedSections.length} TOC items, got ${tocCount}`);
  }

  // Check images
  const images = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('main img'));
    return imgs.map(img => ({
      src: img.src,
      alt: img.alt,
      complete: img.complete,
      naturalWidth: img.naturalWidth
    }));
  });
  console.log(`Found ${images.length} images on page.`);

  console.log('Errors logged:', errors);
  if (errors.length > 0) {
    console.warn(`WARNING: Encountered ${errors.length} console errors:`, errors);
  }

  console.log('=== PIMPINAN DOM VERIFICATION PASSED ===');
  await browser.close();
  process.exit(0);
})().catch(err => {
  console.error('DOM Verification failed:', err);
  process.exit(1);
});
