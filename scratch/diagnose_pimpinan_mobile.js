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

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('response', res => {
    if (res.status() >= 400) console.log('HTTP ERROR:', res.status(), res.url());
  });

  const user = await prisma.users.findFirst({
    where: { user_role: { some: { role: { role: 'pimpinan' } } } }
  });
  const token = jwt.sign(
    { id: user.id, email: user.email, role: 'pimpinan', nama: user.nama, nip: user.nip },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  console.log('1. Setting auth on / ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(({ t, u }) => {
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
  }, { t: token, u: user });

  console.log('2. Navigating to /pimpinan ...');
  await page.goto('http://localhost:5173/pimpinan', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  console.log('Final URL:', page.url());
  const ls = await page.evaluate(() => ({ token: localStorage.getItem('token') ? 'PRESENT' : 'NULL', user: localStorage.getItem('user') }));
  console.log('LocalStorage state:', ls);

  const text = await page.evaluate(() => document.body.innerText.slice(0, 300));
  console.log('Body Text:', text.replace(/\n+/g, ' '));

  await browser.close();
  await prisma.$disconnect();
})();
