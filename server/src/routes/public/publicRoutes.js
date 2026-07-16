const express = require("express");
const router = express.Router();
const publicController = require("../../controllers/public/publicController");
const guidebookController = require("../../controllers/public/guidebookController");

router.get("/stats", publicController.getLandingStats);
router.get("/ppdb-status", publicController.getPpdbStatus);
router.get("/guidebook/screenshots", guidebookController.getGuidebookScreenshots);

module.exports = router;
