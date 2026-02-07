const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/santri/dashboardController');

// Middleware untuk semua route dashboard
router.use(dashboardController.verifyToken);

// Route dashboard
router.get('/', dashboardController.getDashboardData);

module.exports = router;