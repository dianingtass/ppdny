const express = require('express');
const router  = express.Router();
const { requireRole } = require('../../middleware/verifyToken');
const ctrl = require('../../controllers/pengurus/kegiatanController');

router.use(requireRole('pimpinan'));

router.get('/', ctrl.getKegiatan);

module.exports = router;
