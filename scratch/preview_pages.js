module.paths.push('c:/laragon/www/ppdny/server/node_modules');
const puppeteer = require('puppeteer');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  await page.goto('http://localhost:5173/docs/Panduan_SIM-Tren_Admin.pdf#page=2', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'scratch/preview_pdf_page2.webp', type: 'webp', quality: 90 });
  console.log('Saved preview_pdf_page2.webp');

  await page.goto('http://localhost:5173/docs/Panduan_SIM-Tren_Admin.pdf#page=3', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'scratch/preview_pdf_page3.webp', type: 'webp', quality: 90 });
  console.log('Saved preview_pdf_page3.webp');

  await browser.close();
})();
