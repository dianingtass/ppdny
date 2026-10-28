module.paths.push('c:/laragon/www/ppdny/server/node_modules');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: 'c:/laragon/www/ppdny/server/.env' });
const prisma = require('c:/laragon/www/ppdny/server/src/config/prisma');
const { cloudinary } = require('c:/laragon/www/ppdny/server/src/config/cloudinary');

const screens = [
  { name: 'dashboard_utama',   modul: 'dashboard',  bagian: 'utama' },
  { name: 'santri_daftar',     modul: 'santri',     bagian: 'daftar' },
  { name: 'ustadz_daftar',     modul: 'ustadz',     bagian: 'daftar' },
  { name: 'staf_daftar',       modul: 'staf',       bagian: 'daftar' },
  { name: 'orangtua_daftar',   modul: 'orangtua',   bagian: 'daftar' },
  { name: 'kelas_kamar',       modul: 'kelas',      bagian: 'kamar' },
  { name: 'kegiatan_daftar',   modul: 'kegiatan',   bagian: 'daftar' },
  { name: 'layanan_riwayat',   modul: 'layanan',    bagian: 'riwayat' },
  { name: 'pengaduan_daftar',  modul: 'pengaduan',  bagian: 'daftar' },
  { name: 'keuangan_laporan',  modul: 'keuangan',   bagian: 'laporan' },
  { name: 'feedback_evaluasi', modul: 'feedback',   bagian: 'evaluasi' },
  { name: 'ppdb_rekapitulasi', modul: 'ppdb',       bagian: 'rekapitulasi' },
  { name: 'ppdb_pendaftar',    modul: 'ppdb',       bagian: 'pendaftar' },
  { name: 'absensi_daftar',    modul: 'absensi',    bagian: 'daftar' },
  { name: 'screening_daftar',  modul: 'screening',  bagian: 'daftar' },
  { name: 'observasi_daftar',  modul: 'observasi',  bagian: 'daftar' },
  { name: 'profil_utama',      modul: 'profil',     bagian: 'utama' },
];

(async () => {
  let count = 0;
  for (const s of screens) {
    for (const device of ['desktop', 'mobile']) {
      const publicId = `guidebook/pimpinan/${s.name}_${device}`;
      const localFile = path.resolve(`c:/laragon/www/ppdny/client/public/assets/guidebook/pimpinan/${s.name}_${device}.webp`);

      let secureUrl = '';
      try {
        const uploadRes = await cloudinary.uploader.upload(localFile, {
          folder: 'guidebook/pimpinan',
          public_id: `${s.name}_${device}`,
          overwrite: true,
          resource_type: 'image'
        });
        secureUrl = uploadRes.secure_url;
      } catch (e) {
        console.warn('Cloudinary upload warning:', e.message);
        secureUrl = `https://res.cloudinary.com/dy2owwsso/image/upload/guidebook/pimpinan/${s.name}_${device}.webp`;
      }

      await prisma.$executeRaw`
        INSERT INTO guidebook_screenshot (role, modul, bagian, device, url, createdAt, updatedAt)
        VALUES ('pimpinan', ${s.modul}, ${s.bagian}, ${device}, ${secureUrl}, NOW(), NOW())
        ON DUPLICATE KEY UPDATE 
          url = ${secureUrl},
          updatedAt = NOW()
      `;
      count++;
      console.log(`[UPSERTED] pimpinan -> ${s.modul}_${s.bagian}_${device} => ${secureUrl}`);
    }
  }

  console.log(`\nSuccessfully registered ${count}/34 screenshots in database for role pimpinan!`);
  await prisma.$disconnect();
  process.exit(0);
})().catch(e => {
  console.error(e);
  process.exit(1);
});
