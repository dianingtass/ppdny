const express = require("express");
const router = express.Router();
const { requireRole } = require('../../middleware/verifyToken');
const absensiController = require("../../controllers/timkesehatan/absensiController");

router.use(requireRole('pimpinan'));

router.get("/kamar", absensiController.getKamarList);
router.get("/kamar/:id/detail", absensiController.getKamarDetail);
router.get("/kamar/:id/absensi", absensiController.getAbsensiByKamar);
router.get("/kamar/:id/latest", absensiController.getLatestAbsensi);
router.get("/kamar/:id/santri", absensiController.getSantriByKamar);
router.get("/item-kebersihan", absensiController.getItemKebersihan);
router.get("/kamar/:id/laporan", absensiController.getLaporanAbsensi);
router.get("/:id_heading", absensiController.getAbsensiDetail);

module.exports = router;
