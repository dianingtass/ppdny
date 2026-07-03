const express = require('express');
const router  = express.Router();
const { requireRole } = require('../../middleware/verifyToken');
const ctrl    = require('../../controllers/shared/orangtuaController');

router.use(requireRole('pimpinan'));

router.get('/',                    ctrl.getOrangTua);
router.get('/search',              ctrl.searchUser);
router.get('/:id/anak',            ctrl.getAnakByOrtu);

module.exports = router;
