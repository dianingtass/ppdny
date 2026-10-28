module.paths.push('c:/laragon/www/ppdny/server/node_modules');
const puppeteer = require('puppeteer');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'c:/laragon/www/ppdny/server/.env' });
const prisma = require('c:/laragon/www/ppdny/server/src/config/prisma');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  
  const user = await prisma.users.findFirst({
    where: { user_role: { some: { role: { role: 'pimpinan' } } } }
  });
  console.log('User found:', user?.id, user?.nama);
  const token = jwt.sign({ id: user.id, nama: user.nama, role: 'pimpinan' }, process.env.JWT_SECRET);

  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.evaluate((t, u) => {
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
  }, token, user);

  await page.goto('http://localhost:5173/pimpinan', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  console.log('Current URL 1:', page.url());

  // Try navigating to santri
  await page.goto('http://localhost:5173/pimpinan/data-santri', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  console.log('Current URL 2:', page.url());

  // Close mobile sidebar if overlay present
  await page.evaluate(() => {
    const overlay = document.querySelector('.fixed.inset-0.bg-black\\/50') || document.querySelector('[class*="bg-black"]');
    if (overlay) overlay.click();
  }).catch(() => {});
  await new Promise(r => setTimeout(r, 400));

  const text = await page.evaluate(() => document.body.innerText.slice(0, 200));
  console.log('Text:', text.replace(/\n+/g, ' '));

  await browser.close();
  await prisma.$disconnect();
})();
