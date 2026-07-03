const express = require('express');
const router  = express.Router();
const { requireRole } = require('../../middleware/verifyToken');
const ctrl    = require('../../controllers/shared/kamarController');

router.use(requireRole('pimpinan'));

router.get('/',                              ctrl.getKamar);
router.get('/:id/santri',                    ctrl.getSantriByKamar);

module.exports = router;
