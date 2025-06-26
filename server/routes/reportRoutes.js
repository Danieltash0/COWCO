const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// Reports routes
router.post('/', reportController.createReport);
router.get('/', reportController.getAllReports);
router.get('/:id', reportController.getReportById);
router.delete('/:id', reportController.deleteReport);
router.post('/:id/export', reportController.exportReport);

// Analytics routes
router.get('/analytics', reportController.getAnalytics);

module.exports = router;
