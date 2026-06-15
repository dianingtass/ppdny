const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

const { verifyToken } = require('./middleware/verifyToken');
const activityLog = require('./middleware/activityLog');

dotenv.config();

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'same-site' } }));

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',').map(o => o.trim()).filter(Boolean);
if (allowedOrigins.length === 0) {
  allowedOrigins.push('http://localhost:5173', 'http://localhost:3000');
}
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: Origin '${origin}' tidak diizinkan.`));
  },
  credentials: true,
}));

const generalLimiter = rateLimit({
  windowMs: 60 * 1000, max: 100,
  standardHeaders: true, legacyHeaders: false,
  message: { success: false, message: 'Terlalu banyak request. Coba lagi sebentar.' },
});
app.use('/api', generalLimiter);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: false, limit: '2mb' }));



// ── PUBLIC ROUTES (tidak perlu token) ────────────────────────
app.get('/api', (req, res) => res.json({ success: true, message: 'PPDNY API' }));
app.use('/api/public',        require('./routes/public/publicRoutes'));

app.use('/api/ppdb/public',   require('./routes/ppdb/publicPpdbRoutes'));
app.use('/api/auth',          require('./routes/authRoutes'));


// ── CRON ENDPOINT (dipanggil Vercel Cron) ────────────────────
app.post('/api/cron/auto-close-konsultasi', async (req, res) => {
  // Validasi secret agar tidak bisa dipanggil sembarangan
  const secret = req.headers['x-cron-secret'];
  if (secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ success: false, message: 'Unauthorized.' });
  }
  try {
    const konsultasiService = require('./controllers/shared/konsultasiService');
    await konsultasiService.autoCloseExpiredActiveRooms();
    await konsultasiService.autoCloseInactiveRooms();
    return res.json({ success: true, message: 'Auto-close konsultasi selesai.' });
  } catch (err) {
    console.error('Cron auto-close konsultasi error:', err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ── PROTECTED ROUTES (butuh token) ───────────────────────────
app.use(verifyToken);

app.use(activityLog);

app.use('/api/santri/notifications',   require('./routes/santri/notificationRoutes'));
app.use('/api/orangtua/notifications', require('./routes/orangtua/notificationRoutes'));
app.use('/api/ustadz/notifications',   require('./routes/ustadz/notificationRoutes'));

app.use('/api/santri',                require('./routes/santri/dashboardRoutes'));
app.use('/api/santri/profile',        require('./routes/santri/pendataanRoutes'));
app.use('/api/santri/keuangan',       require('./routes/santri/keuanganRoutes'));
app.use('/api/santri/kegiatan',       require('./routes/santri/kegiatanRoutes'));
app.use('/api/santri/pengaduan',      require('./routes/santri/pengaduanRoutes'));
app.use('/api/santri/layanan',        require('./routes/santri/layananRoutes'));
app.use('/api/santri/layanan/riwayat',require('./routes/santri/riwayatLayananRoutes'));




app.use('/api/pengurus/dashboard',          require('./routes/pengurus/dashboardRoutes'));
app.use('/api/pengurus/santri',             require('./routes/pengurus/santriRoutes'));
app.use('/api/pengurus/orangtua',           require('./routes/pengurus/orangtuaRoutes'));
app.use('/api/pengurus/ustadz',             require('./routes/pengurus/ustadzRoutes'));
app.use('/api/pengurus/kelas',              require('./routes/pengurus/kelasRoutes'));
app.use('/api/pengurus/kamar',              require('./routes/pengurus/kamarRoutes'));
app.use('/api/pengurus/penempatan-kelas',   require('./routes/pengurus/assignKelasRoutes'));
app.use('/api/pengurus/penempatan-kamar',   require('./routes/pengurus/assignKamarRoutes'));
app.use('/api/pengurus/jenis-layanan',      require('./routes/pengurus/jenisLayananRoutes'));
app.use('/api/pengurus/jenis-tagihan',      require('./routes/pengurus/jenisTagihanRoutes'));
app.use('/api/pengurus/riwayat-layanan',    require('./routes/pengurus/riwayatLayananRoutes'));
app.use('/api/pengurus/kegiatan',           require('./routes/pengurus/kegiatanRoutes'));
app.use('/api/pengurus/keuangan',           require('./routes/pengurus/keuanganRoutes'));

app.use('/api/orangtua/dashboard', require('./routes/orangtua/dashboardRoutes'));
app.use('/api/orangtua/profile',   require('./routes/orangtua/pendataanRoutes'));
app.use('/api/orangtua/kegiatan',  require('./routes/orangtua/kegiatanRoutes'));
app.use('/api/orangtua/keuangan',  require('./routes/orangtua/keuanganRoutes'));
app.use('/api/orangtua/pengaduan', require('./routes/orangtua/pengaduanRoutes'));


app.use('/api/ustadz/dashboard', require('./routes/ustadz/dashboardRoutes'));
app.use('/api/ustadz/profile',   require('./routes/ustadz/pendataanRoutes'));
app.use('/api/ustadz/kegiatan',  require('./routes/ustadz/kegiatanRoutes'));
app.use('/api/ustadz/santri',    require('./routes/ustadz/santriRoutes'));
app.use('/api/ustadz/pengaduan', require('./routes/ustadz/pengaduanRoutes'));

app.use('/api/pimpinan/dashboard', require('./routes/pimpinan/dashboardRoutes'));
app.use('/api/pimpinan/santri',    require('./routes/pimpinan/santriRoutes'));
app.use('/api/pimpinan/ustadz',    require('./routes/pimpinan/ustadzRoutes'));
app.use('/api/pimpinan/pengaduan', require('./routes/pimpinan/pengaduanRoutes'));
app.use('/api/pimpinan/keuangan',  require('./routes/pimpinan/keuanganRoutes'));
app.use('/api/pimpinan/feedback',  require('./routes/pimpinan/feedbackRoutes'));


app.use('/api/admin/dashboard',          require('./routes/admin/dashboardRoutes'));
app.use('/api/admin/staf',               require('./routes/admin/stafRoutes'));
app.use('/api/admin/santri',             require('./routes/admin/santriRoutes'));
app.use('/api/admin/orangtua',           require('./routes/admin/orangtuaRoutes'));
app.use('/api/admin/ustadz',             require('./routes/admin/ustadzRoutes'));
app.use('/api/admin/kelas',              require('./routes/admin/kelasRoutes'));
app.use('/api/admin/kamar',              require('./routes/admin/kamarRoutes'));
app.use('/api/admin/penempatan-kelas',   require('./routes/admin/assignKelasRoutes'));
app.use('/api/admin/penempatan-kamar',   require('./routes/admin/assignKamarRoutes'));
app.use('/api/admin/jenis-layanan',      require('./routes/admin/jenisLayananRoutes'));
app.use('/api/admin/jenis-tagihan',      require('./routes/admin/jenisTagihanRoutes'));
app.use('/api/admin/pengaduan',          require('./routes/admin/pengaduanRoutes'));
app.use('/api/admin/kegiatan',           require('./routes/admin/kegiatanRoutes'));
app.use('/api/admin/riwayat-layanan',    require('./routes/admin/riwayatLayananRoutes'));
app.use('/api/admin/keuangan',           require('./routes/admin/keuanganRoutes'));
app.use('/api/admin/feedback',           require('./routes/admin/feedbackRoutes'));
app.use('/api/admin/log',                require('./routes/admin/logRoutes'));




app.use('/api/ppdb/admin',   require('./routes/ppdb/adminPpdbRoutes'));
app.use('/api/ppdb/panitia', require('./routes/ppdb/panitiaPpdbRoutes'));

// ── ERROR HANDLER ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  const isDev = process.env.NODE_ENV !== 'production';
  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err);

  if (err.code === 'LIMIT_FILE_SIZE')
    return res.status(413).json({ success: false, message: 'Ukuran file melebihi batas 5 MB.' });
  if (err.message?.startsWith('Format file'))
    return res.status(400).json({ success: false, message: err.message });
  if (err.message?.startsWith('CORS'))
    return res.status(403).json({ success: false, message: err.message });

  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan pada server.',
    ...(isDev && { detail: err.message }),
  });
});

// ── LOCAL DEV: jalankan server hanya jika bukan di Vercel ─────
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;
