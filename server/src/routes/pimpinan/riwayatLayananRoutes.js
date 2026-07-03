const express = require('express');
const router  = express.Router();
const { requireRole } = require('../../middleware/verifyToken');
const ctrl    = require('../../controllers/shared/masterDataController');

router.use(requireRole('pimpinan'));

router.get('/',    ctrl.getRiwayatLayanan);
router.get('/options', ctrl.getRiwayatLayananOptions);

module.exports = router;
