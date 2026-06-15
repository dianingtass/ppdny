const express = require("express");
const router = express.Router();
const keuanganController = require("../../controllers/santri/keuanganController");
const createUploader = require("../../middleware/uploadMiddleware");

const upload = createUploader("payments", "payment");

router.get("/", keuanganController.getKeuanganDashboard);

router.post(
  "/bayar",
  upload.single("bukti_bayar"),
  keuanganController.uploadPembayaran,
);

module.exports = router;
