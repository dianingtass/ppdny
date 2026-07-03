const express = require('express');
const router  = express.Router();
const { requireRole } = require('../../middleware/verifyToken');
const ctrl    = require('../../controllers/shared/kelasController');

router.use(requireRole('pimpinan'));

router.get('/',                              ctrl.getKelas);
router.get('/:id/santri',                    ctrl.getSantriByKelas);

module.exports = router;
