const express = require('express');
const router = express.Router();
const { requireRole } = require('../../middleware/verifyToken');

router.use(requireRole('admin'));

const dashboardController = require('../../controllers/admin/dashboardController');

router.get('/stats', dashboardController.getDashboardStats);

module.exports = router;