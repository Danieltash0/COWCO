const express = require('express');
const router = express.Router();
const milkingController = require('../controllers/milkingController');
const { authenticateToken } = require('../middleware/auth');

// All milking routes require authentication
router.use(authenticateToken);

router.get('/records', milkingController.getMilkingRecords);
router.post('/records', milkingController.addMilkingRecord);
router.get('/stats', milkingController.getMilkingStats);
router.delete('/records/:record_id', milkingController.deleteMilkingRecord);
router.put('/records/:record_id', milkingController.updateMilkingRecord);

module.exports = router; 