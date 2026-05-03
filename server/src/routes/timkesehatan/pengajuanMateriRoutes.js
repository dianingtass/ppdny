const express  = require('express');
const multer   = require('multer');

const { verifyToken, requireRole } = require('../../middleware/verifyToken');
const ctrl = require('../../controllers/timkesehatan/pengajuanMateriController');
const createUploader = require('../../middleware/uploadMiddleware');

const upload = createUploader('materi', 'materi');

const uploadSingle = (req, res, next) => {
  upload.single('gambar')(req, res, (err) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE')
      return res.status(400).json({ success: false, message: 'Ukuran file maksimal 5MB' });
    if (err)
      return res.status(400).json({ success: false, message: err.message });
    next();
  });
};

const optionalToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return next();
  verifyToken(req, res, next);
};

// ── ROUTER 1: PUBLIC ─────────────────────────────────────────
const publicRouter = express.Router();
publicRouter.post('/', optionalToken, uploadSingle, ctrl.ajukanMateri);

// ── ROUTER 2: GLOBAL (user login) ────────────────────────────
const globalRouter = express.Router();
globalRouter.get('/', verifyToken, ctrl.getRiwayatPengajuan);

// ── ROUTER 3: TIMKES ─────────────────────────────────────────
const timkesRouter = express.Router();
timkesRouter.get('/',             verifyToken, requireRole('timkesehatan'), ctrl.getSemuaPengajuan);
timkesRouter.put('/:id',          verifyToken, requireRole('timkesehatan'), uploadSingle, ctrl.editPengajuan);
timkesRouter.post('/:id/setujui', verifyToken, requireRole('timkesehatan'), uploadSingle, ctrl.setujuiPengajuan);
timkesRouter.post('/:id/tolak',   verifyToken, requireRole('timkesehatan'), ctrl.tolakPengajuan);

module.exports = { publicRouter, globalRouter, timkesRouter };
