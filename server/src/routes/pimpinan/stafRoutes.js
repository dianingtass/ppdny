const express = require('express');
const router = express.Router();
const stafController = require('../../controllers/pimpinan/stafController');

router.get('/', stafController.getStaffList);

module.exports = router;
