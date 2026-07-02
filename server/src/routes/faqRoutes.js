const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');
const { verifyToken } = require('../middleware/verifyToken');

// Public route to view FAQ
router.get('/', faqController.getFaqList);

// Protected routes to manage FAQ (Admin, Pengurus, Tim Kesehatan)
router.post('/', verifyToken, faqController.createFaq);
router.put('/:id', verifyToken, faqController.updateFaq);
router.delete('/:id', verifyToken, faqController.deleteFaq);

module.exports = router;
