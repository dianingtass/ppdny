const express = require('express');
const router = express.Router();
const stafController = require('../../controllers/admin/stafController');
const { requireRole } = require('../../middleware/verifyToken');

router.use(requireRole('admin'));

router.get('/', stafController.getStaffList);
router.post('/', stafController.createStaff); 
router.put('/:id', stafController.updateStaff);
router.delete('/:id', stafController.deleteStaff);
router.put('/:id/toggle-status', stafController.toggleStaffStatus);
router.put('/:id/reset-password', stafController.resetPassword);

module.exports = router;