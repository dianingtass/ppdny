const express = require('express');
const router = express.Router();
const multer = require('multer');
const manageMateriController = require('../controllers/manageMateriController');
const createUploader = require('../middleware/uploadMiddleware');

const upload = createUploader('materi', 'materi');

// Route Materi List
router.get('/comments/:commentId/replies', manageMateriController.getReplyKomentar);
router.post('/comments/:commentId/replies', manageMateriController.createReplyKomentar);
router.get('/:id/comments', manageMateriController.getKomentarMateri);
router.post('/:id/comments', manageMateriController.createKomentarMateri);
router.get('/:id', manageMateriController.getDetailMateri);
router.get('/', manageMateriController.getViewMateri);
router.post('/', (req, res, next) => {
  upload.single("gambar")(req, res, function (err) {
    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ success: false, message: "Ukuran file maksimal 5MB" });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, manageMateriController.postManageMateri);

router.put('/:id', upload.single("gambar"), manageMateriController.putManageMateri);
router.delete('/:id', manageMateriController.deleteManageMateri);

module.exports = router;
