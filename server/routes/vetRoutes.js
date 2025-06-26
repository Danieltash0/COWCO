const express = require('express');
const router = express.Router();
const vetController = require('../controllers/vetController');

// Health Records routes
router.post('/health-records', vetController.createHealthRecord);
router.get('/health-records', vetController.getAllHealthRecords);
router.get('/health-records/:id', vetController.getHealthRecordById);
router.put('/health-records/:id', vetController.updateHealthRecord);
router.delete('/health-records/:id', vetController.deleteHealthRecord);
router.get('/health-records/cattle/:cattleId', vetController.getHealthRecordsByCattle);

// Health Alerts routes
router.get('/health-alerts', vetController.getHealthAlerts);

module.exports = router; 
 