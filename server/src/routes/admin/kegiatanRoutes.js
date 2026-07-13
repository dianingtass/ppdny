const express = require('express');
const router = express.Router();
const { requireRole } = require('../../middleware/verifyToken');

router.use(requireRole('admin'));

const kegiatanController = require('../../controllers/admin/kegiatanController');

router.get('/', kegiatanController.getKegiatan);
router.post('/', kegiatanController.createKegiatan);
router.put('/:id', kegiatanController.updateKegiatan);
router.delete('/:id', kegiatanController.deleteKegiatan);

module.exports = router;