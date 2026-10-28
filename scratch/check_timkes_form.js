module.paths.push('c:/laragon/www/ppdny/server/node_modules');
const puppeteer = require('puppeteer');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'c:/laragon/www/ppdny/server/.env' });
const prisma = require('c:/laragon/www/ppdny/server/src/config/prisma');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new'
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  
  const user = await prisma.users.findFirst({
    where: { user_role: { some: { role: { role: 'timkesehatan' } } } }
  });
  const token = jwt.sign({ id: user.id, nama: user.nama, role: 'timkesehatan' }, process.env.JWT_SECRET || 'your-secret-key');
  await page.evaluate((t, u) => {
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
  }, token, user);

  await page.goto('http://localhost:5173/timkesehatan/daftarAbsensiKamar/1/create', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  
  console.log('URL:', page.url());
  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log('Body Text Snippet:', bodyText.slice(0, 300).replace(/\n+/g, ' '));
  await page.screenshot({ path: 'scratch/test_absensi_form.webp', type: 'webp', quality: 90 });
  console.log('Screenshot size:', fs.statSync('scratch/test_absensi_form.webp').size);

  await browser.close();
  await prisma.$disconnect();
})();
