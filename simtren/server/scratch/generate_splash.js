const puppeteer = require('puppeteer');
const path = require('path');

async function generate() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Set viewport to iPhone 12/13/14 Pro standard resolution
  await page.setViewport({
    width: 1170,
    height: 2532,
    deviceScaleFactor: 1
  });

  const fs = require('fs');
  const logoBuffer = fs.readFileSync(path.resolve(__dirname, '../../client/public/pwa-512x512.png'));
  const logoBase64 = logoBuffer.toString('base64');
  const logoPath = `data:image/png;base64,${logoBase64}`;
  console.log('Successfully encoded logo as base64 URI');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          padding: 0;
          width: 1170px;
          height: 2532px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(160deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          overflow: hidden;
        }
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-top: -100px; /* offset slightly upwards for visual balance on tall screens */
        }
        .logo {
          width: 256px;
          height: 256px;
          object-fit: contain;
          margin-bottom: 48px;
          filter: drop-shadow(0 10px 15px rgba(22, 163, 74, 0.15));
        }
        .title {
          font-size: 72px;
          font-weight: 800;
          color: #14532d;
          letter-spacing: -2px;
          margin: 0 0 16px 0;
        }
        .subtitle {
          font-size: 32px;
          font-weight: 500;
          color: #16a34a;
          letter-spacing: 0.5px;
          margin: 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <img src="${logoPath}" class="logo" />
        <h1 class="title">SIM-Tren</h1>
        <p class="subtitle">Sistem Informasi Pesantren</p>
      </div>
    </body>
    </html>
  `;

  await page.setContent(html);
  
  // Wait for image decoding and rendering
  console.log('Rendering content...');
  await new Promise(r => setTimeout(r, 1500));

  const outputPath = path.resolve(__dirname, '../../client/public/apple-splash.png');
  await page.screenshot({ path: outputPath, type: 'png' });
  console.log('Splash screen successfully generated at:', outputPath);

  await browser.close();
}

generate().catch(err => {
  console.error('Generation failed:', err);
  process.exit(1);
});
