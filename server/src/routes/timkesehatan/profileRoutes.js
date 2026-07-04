const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/shared/profileController');
const createUploader = require('../../middleware/uploadMiddleware');
const { requireRole } = require('../../middleware/verifyToken');

// Batasi route ini khusus untuk role timkesehatan
router.use(requireRole('timkesehatan'));

router.get('/', profileController.getProfile);
router.put('/update', profileController.updateProfile);
router.put('/password', profileController.updatePassword);

const uploadProfil = createUploader('profil', 'profil');
router.post('/photo', uploadProfil.single('foto'), profileController.updatePhoto);

module.exports = router;
