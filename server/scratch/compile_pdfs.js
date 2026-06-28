const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const DOCS_DIR = path.resolve(__dirname, '..', '..', 'docs');
const PUBLIC_DOCS_DIR = path.resolve(__dirname, '..', '..', 'client', 'public', 'docs');

const FILES_CONFIG = [
  {
    mdFile: 'guidebook-admin.md',
    pdfFile: 'Panduan_SIM-Tren_Admin.pdf',
    title: 'Buku Panduan Admin SIM-Tren',
    subtitle: 'Sistem Informasi Manajemen Pesantren — Layanan Kesehatan & Administrasi',
    roleName: 'SUPER ADMIN'
  },
  {
    mdFile: 'guidebook-pimpinan.md',
    pdfFile: 'Panduan_SIM-Tren_Pimpinan.pdf',
    title: 'Buku Panduan Pimpinan SIM-Tren',
    subtitle: 'Sistem Informasi Manajemen Pesantren — Layanan Kesehatan & Administrasi',
    roleName: 'PIMPINAN PESANTREN'
  },
  {
    mdFile: 'guidebook-pengurus.md',
    pdfFile: 'Panduan_SIM-Tren_Pengurus.pdf',
    title: 'Buku Panduan Pengurus SIM-Tren',
    subtitle: 'Sistem Informasi Manajemen Pesantren — Layanan Kesehatan & Administrasi',
    roleName: 'PENGURUS PONDOK'
  },
  {
    mdFile: 'guidebook-timkesehatan.md',
    pdfFile: 'Panduan_SIM-Tren_Tim_Kesehatan.pdf',
    title: 'Buku Panduan Tim Kesehatan SIM-Tren',
    subtitle: 'Sistem Informasi Manajemen Pesantren — Layanan Kesehatan & Administrasi',
    roleName: 'TIM KESEHATAN (MEDIS)'
  },
  {
    mdFile: 'guidebook-orangtua.md',
    pdfFile: 'Panduan_SIM-Tren_Orang_Tua.pdf',
    title: 'Buku Panduan Orang Tua SIM-Tren',
    subtitle: 'Sistem Informasi Manajemen Pesantren — Layanan Kesehatan & Administrasi',
    roleName: 'WALI SANTRI (ORANG TUA)'
  }
];

function parseMarkdown(mdText) {
  const lines = mdText.split('\n');
  let html = '';
  let inList = false;

  for (let line of lines) {
    let trimmed = line.trim();

    // Horizontal Rule
    if (trimmed === '---') {
      if (inList) { html += '</ul>\n'; inList = false; }
      html += '<hr />\n';
      continue;
    }

    // Headings
    if (trimmed.startsWith('# ')) {
      if (inList) { html += '</ul>\n'; inList = false; }
      html += `<h1>${trimmed.substring(2)}</h1>\n`;
      continue;
    }
    if (trimmed.startsWith('## ')) {
      if (inList) { html += '</ul>\n'; inList = false; }
      html += `<h2>${trimmed.substring(3)}</h2>\n`;
      continue;
    }
    if (trimmed.startsWith('### ')) {
      if (inList) { html += '</ul>\n'; inList = false; }
      html += `<h3>${trimmed.substring(4)}</h3>\n`;
      continue;
    }
    if (trimmed.startsWith('#### ')) {
      if (inList) { html += '</ul>\n'; inList = false; }
      html += `<h4>${trimmed.substring(5)}</h4>\n`;
      continue;
    }

    // Lists
    if (trimmed.startsWith('- ')) {
      if (!inList) { html += '<ul>\n'; inList = true; }
      let content = trimmed.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      html += `  <li>${content}</li>\n`;
      continue;
    }
    if (line.startsWith('  - ')) {
      if (!inList) { html += '<ul>\n'; inList = true; }
      let content = line.substring(4).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      html += `  <li class="sub-list">${content}</li>\n`;
      continue;
    }

    // Empty line
    if (trimmed === '') {
      if (inList) { html += '</ul>\n'; inList = false; }
      continue;
    }

    // Images
    const imgMatch = trimmed.match(/!\[(.*?)\]\((.*?)\)/);
    if (imgMatch) {
      if (inList) { html += '</ul>\n'; inList = false; }
      html += `<div class="screenshot-container"><img src="${imgMatch[2]}" alt="${imgMatch[1]}" /><div class="caption">${imgMatch[1]}</div></div>\n`;
      continue;
    }

    // Regular paragraph
    if (inList) { html += '</ul>\n'; inList = false; }
    let content = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html += `<p>${content}</p>\n`;
  }

  if (inList) { html += '</ul>\n'; }
  return html;
}

function generateHtmlWrapper(bodyHtml, config) {
  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>${config.title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&display=swap');
    
    body {
      font-family: 'Geist', sans-serif;
      color: #1f2937;
      line-height: 1.6;
      margin: 0;
      padding: 50px;
      background-color: #ffffff;
      font-size: 14px;
    }
    
    .cover {
      text-align: center;
      padding-top: 180px;
      height: 700px;
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    
    .cover-header {
      margin-bottom: 50px;
    }
    
    .cover img.logo {
      width: 120px;
      margin-bottom: 40px;
    }
    
    .cover h1 {
      font-size: 34px;
      font-weight: 900;
      color: #15803d;
      margin-bottom: 10px;
      letter-spacing: -0.5px;
      border: none;
      padding: 0;
      page-break-before: avoid;
    }
    
    .cover h2 {
      font-size: 18px;
      font-weight: 500;
      color: #4b5563;
      margin-top: 10px;
      margin-bottom: 40px;
    }
    
    .cover .badge {
      display: inline-block;
      background-color: #d1fae5;
      color: #065f46;
      font-weight: 800;
      padding: 8px 18px;
      border-radius: 9999px;
      font-size: 14px;
      letter-spacing: 1px;
      margin-top: 20px;
    }
    
    .cover .meta {
      font-size: 12px;
      color: #9ca3af;
      margin-top: auto;
      border-top: 1px solid #f3f4f6;
      padding-top: 20px;
    }
    
    h1 {
      color: #15803d;
      font-size: 26px;
      font-weight: 800;
      margin-top: 50px;
      margin-bottom: 20px;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 10px;
      page-break-before: always;
    }
    
    /* Avoid page break on the very first h1 */
    .content > h1:first-child {
      page-break-before: avoid;
      margin-top: 10px;
    }
    
    h2 {
      color: #166534;
      font-size: 18px;
      font-weight: 700;
      margin-top: 35px;
      margin-bottom: 15px;
      page-break-after: avoid;
    }
    
    h3 {
      color: #1e3a8a;
      font-size: 15px;
      font-weight: 700;
      margin-top: 25px;
      page-break-after: avoid;
    }
    
    p {
      margin-bottom: 16px;
      text-align: justify;
    }
    
    ul {
      padding-left: 24px;
      margin-bottom: 16px;
    }
    
    li {
      margin-bottom: 8px;
    }
    
    li.sub-list {
      margin-left: 20px;
      list-style-type: circle;
    }
    
    hr {
      border: 0;
      border-top: 1px solid #e5e7eb;
      margin: 40px 0;
    }
    
    .screenshot-container {
      margin: 30px 0;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
      page-break-inside: avoid;
    }
    
    .screenshot-container img {
      width: 100%;
      display: block;
    }
    
    .screenshot-container .caption {
      background-color: #f9fafb;
      padding: 12px 16px;
      font-size: 11px;
      font-weight: 600;
      color: #4b5563;
      border-top: 1px solid #e5e7eb;
      text-align: center;
    }
  </style>
</head>
<body>

  <div class="cover">
    <div class="cover-header">
      <img class="logo" src="assets/admin/dashboard.png" style="display:none;" /> <!-- Dummy space -->
      <!-- Let's put a beautiful text-based emblem instead of image link that might break -->
      <div style="font-size: 40px; font-weight: 900; color: #15803d; margin-bottom: 20px;">SIM-Tren</div>
      <h1>PANDUAN PENGGUNAAN</h1>
      <h2>${config.subtitle}</h2>
      <div class="badge">ROLE: ${config.roleName}</div>
    </div>
    <div class="meta">
      <p style="text-align: center; margin: 0;">Diterbitkan oleh Tim Pengembang SIM-Tren &copy; 2026</p>
      <p style="text-align: center; margin: 0; font-size: 10px; color: #d1d5db; margin-top: 5px;">Dokumen ini dibuat otomatis dan diperbarui secara berkala.</p>
    </div>
  </div>

  <div class="content">
    ${bodyHtml}
  </div>

</body>
</html>
  `;
}

async function run() {
  if (!fs.existsSync(PUBLIC_DOCS_DIR)) {
    fs.mkdirSync(PUBLIC_DOCS_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  console.log('Compiling Markdown guidebooks into PDFs...');

  for (const config of FILES_CONFIG) {
    const mdPath = path.join(DOCS_DIR, config.mdFile);
    if (!fs.existsSync(mdPath)) {
      console.error(`Markdown file not found: ${mdPath}`);
      continue;
    }

    console.log(`\n----------------------------------------`);
    console.log(`Compiling: ${config.mdFile} -> ${config.pdfFile}`);
    console.log(`----------------------------------------`);

    // Baca Markdown & konversi
    const mdText = fs.readFileSync(mdPath, 'utf8');
    const bodyHtml = parseMarkdown(mdText);
    const fullHtml = generateHtmlWrapper(bodyHtml, config);

    // Tulis temporary HTML file di folder docs/
    const tempHtmlFile = `temp_${config.mdFile.replace('.md', '.html')}`;
    const tempHtmlPath = path.join(DOCS_DIR, tempHtmlFile);
    fs.writeFileSync(tempHtmlPath, fullHtml, 'utf8');

    // Buka file di Puppeteer
    const fileUrl = `file:///${tempHtmlPath.replace(/\\/g, '/')}`;
    console.log(`Loading temp HTML page: ${fileUrl}`);
    await page.goto(fileUrl, { waitUntil: 'networkidle2' });

    // Cetak ke PDF
    const pdfPath = path.join(PUBLIC_DOCS_DIR, config.pdfFile);
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      margin: {
        top: '60px',
        bottom: '60px',
        left: '50px',
        right: '50px'
      },
      displayHeaderFooter: true,
      headerTemplate: `<div style="font-size: 8px; font-family: sans-serif; color: #9ca3af; width: 100%; text-align: right; padding-right: 50px;">SIM-Tren ${config.roleName} Guidebook</div>`,
      footerTemplate: `<div style="font-size: 8px; font-family: sans-serif; color: #9ca3af; width: 100%; text-align: center;">Halaman <span class="pageNumber"></span> dari <span class="totalPages"></span></div>`,
      printBackground: true
    });

    console.log(`PDF successfully generated: ${pdfPath}`);

    // Hapus file HTML temporary
    fs.unlinkSync(tempHtmlPath);
  }

  await browser.close();
  console.log('\n========================================');
  console.log('PDF Guidebook Compilation Finished!');
  console.log('========================================');
}

run().catch(err => {
  console.error('Error during PDF compilation:', err);
});
