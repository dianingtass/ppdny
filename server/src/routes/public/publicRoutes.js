const express = require("express");
const router = express.Router();
const publicController = require("../../controllers/public/publicController");

router.get("/stats", publicController.getLandingStats);
router.get("/ppdb-status", publicController.getPpdbStatus);

module.exports = router;
