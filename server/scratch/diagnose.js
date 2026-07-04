const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Capture console messages
  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.error(`[BROWSER RUNTIME ERROR]: ${err.toString()}`);
  });

  try {
    console.log('Navigating to login page...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });

    console.log('Filling credentials...');
    await page.type('input[placeholder*="Masukkan NIS"]', 'admin@ppdny.id');
    await page.type('input[placeholder*="Masukkan Kata Sandi"]', 'password123');

    console.log('Submitting login form...');
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);

    // Check if we are on the role selection page (step 2)
    const currentUrl = page.url();
    if (currentUrl.includes('/login') || (await page.$('button[class*="uppercase"]')) !== null) {
      console.log('Detecting multi-role screen, choosing ADMIN...');
      const roleButtons = await page.$$('button');
      let adminBtn = null;
      for (const btn of roleButtons) {
        const text = await page.evaluate(el => el.textContent, btn);
        if (text.toUpperCase().includes('ADMIN')) {
          adminBtn = btn;
          break;
        }
      }
      if (adminBtn) {
        await Promise.all([
          adminBtn.click(),
          page.waitForNavigation({ waitUntil: 'networkidle2' })
        ]);
      }
    }

    console.log('Navigating to manageMateri...');
    await page.goto('http://localhost:5173/admin/manageMateri', { waitUntil: 'networkidle2' });

    console.log('Current URL:', page.url());

    console.log('Clicking "Tambah Materi" button...');
    const buttons = await page.$$('button');
    let tambahBtn = null;
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Tambah Materi')) {
        tambahBtn = btn;
        break;
      }
    }

    console.log('Finding and clicking Edit button on a materi card...');
    const editButtons = await page.$$('button');
    let editBtn = null;
    for (const btn of editButtons) {
      const isVisible = await btn.boundingBox();
      if (!isVisible) continue;
      const text = await page.evaluate(el => el.textContent, btn);
      const className = await page.evaluate(el => el.className, btn);
      if (text.includes('Edit') && className.includes('bg-yellow-50')) {
        editBtn = btn;
        break;
      }
    }

    if (editBtn) {
      await page.evaluate(el => el.click(), editBtn);
      console.log('Clicked "Edit" button via JS click. Waiting for 3 seconds...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    } else {
      console.log('Edit button not found!');
    }

  } catch (error) {
    console.error('Script failed:', error);
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
})();
