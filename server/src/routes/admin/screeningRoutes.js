const express = require("express");
const router = express.Router();
const screeningController = require("../../controllers/admin/screeningController");
const createUploader = require("../../middleware/uploadMiddleware");

const upload = createUploader("screening", "screening");

router.get("/santri", screeningController.getSantriList);
router.get("/santri/:id/detail", screeningController.getSantriDetail);
router.get("/santri/:id/screening", screeningController.getScreeningBySantri);
router.get("/pertanyaan", screeningController.getPertanyaan);
router.get("/penanganan", screeningController.getPenanganan);
router.get("/:id", screeningController.getDetailScreening);
router.get("/santri/:id/latest", screeningController.getLatestScreening);
router.post(
  "/create",
  upload.single("foto"),
  screeningController.postScreening
);
router.put(
  "/:id/foto",
  upload.single("foto"),
  screeningController.updateFotoPredileksi
);

router.put(
  "/:id/predileksi",
  screeningController.updatePredileksi
);

router.delete(
  "/:id",
  screeningController.deleteScreening
);

module.exports = router;

