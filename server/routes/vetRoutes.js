const express = require('express');
const router = express.Router();
const vetController = require('../controllers/vetController');
const appointmentsController = require('../controllers/appointmentsController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Apply authentication to all vet routes
router.use(authenticateToken);
router.use(requireRole(['vet', 'admin', 'manager']));

// Health Records routes
router.post('/health-records', vetController.createHealthRecord);
router.get('/health-records', vetController.getAllHealthRecords);
router.get('/health-records/:id', vetController.getHealthRecordById);
router.put('/health-records/:id', vetController.updateHealthRecord);
router.delete('/health-records/:id', vetController.deleteHealthRecord);
router.get('/health-records/cattle/:cattleId', vetController.getHealthRecordsByCattle);

// Health Alerts routes
router.post('/health-alerts', vetController.createHealthAlert);
router.get('/health-alerts', vetController.getHealthAlerts);
router.get('/health-alerts/:id', vetController.getHealthAlertById);
router.put('/health-alerts/:id', vetController.updateHealthAlert);
router.delete('/health-alerts/:id', vetController.deleteHealthAlert);

// Appointments routes
router.get('/appointments', appointmentsController.getAllAppointments);
router.post('/appointments', appointmentsController.addAppointment);

module.exports = router; 
 