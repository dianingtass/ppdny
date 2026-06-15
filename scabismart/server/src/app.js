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

const {
  publicRouter:  pengajuanPublicRouter,
  globalRouter:  pengajuanGlobalRouter,
  timkesRouter:  pengajuanTimkesRouter,
} = require('./routes/timkesehatan/pengajuanMateriRoutes');

// ── PUBLIC ROUTES (tidak perlu token) ────────────────────────
app.get('/api', (req, res) => res.json({ success: true, message: 'PPDNY API' }));
app.use('/api/public',        require('./routes/public/publicRoutes'));
app.use('/api/public/materi', require('./routes/viewMateriRoutes'));

app.use('/api/auth',          require('./routes/authRoutes'));
app.use('/api/public/pengajuanMateri', pengajuanPublicRouter);

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


app.use('/api/santri',                require('./routes/santri/dashboardRoutes'));
app.use('/api/santri/profile',        require('./routes/santri/pendataanRoutes'));

app.use('/api/santri/konsultasi',     require('./routes/santri/konsultasiRoutes'));

app.use('/api/global/viewMateri',   require('./routes/viewMateriRoutes'));
app.use('/api/global/manageMateri', require('./routes/manageMateriRoutes'));
app.use('/api/global/faq',          require('./routes/faqRoutes'));
app.use('/api/global/riwayatPengajuanMateri', pengajuanGlobalRouter);



app.use('/api/orangtua/dashboard', require('./routes/orangtua/dashboardRoutes'));
app.use('/api/orangtua/profile',   require('./routes/orangtua/pendataanRoutes'));

app.use('/api/orangtua/screening', require('./routes/orangtua/screeningRoutes'));
app.use('/api/orangtua/observasi', require('./routes/orangtua/observasiRoutes'));



app.use('/api/pimpinan/dashboard', require('./routes/pimpinan/dashboardRoutes'));

app.use('/api/pimpinan/screening', require('./routes/pimpinan/screeningRoutes'));
app.use('/api/pimpinan/observasi', require('./routes/pimpinan/observasiRoutes'));

app.use('/api/admin/dashboard',          require('./routes/admin/dashboardRoutes'));

app.use('/api/admin/screening',          require('./routes/admin/screeningRoutes'));
app.use('/api/admin/observasi',          require('./routes/admin/observasiRoutes'));
app.use('/api/admin/absensi',            require('./routes/admin/absensiRoutes'));

app.use('/api/timkesehatan/dashboard',       require('./routes/timkesehatan/dashboardRoutes'));
app.use('/api/timkesehatan/screening',       require('./routes/timkesehatan/screeningRoutes'));
app.use('/api/timkesehatan/absensi',         require('./routes/timkesehatan/absensiRoutes'));
app.use('/api/timkesehatan/observasi',       require('./routes/timkesehatan/observasiRoutes'));
app.use('/api/timkesehatan/konsultasi',      require('./routes/timkesehatan/konsultasiRoutes'));
app.use('/api/timkesehatan/pengajuanMateri', pengajuanTimkesRouter);



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
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;
