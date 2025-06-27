const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticateToken } = require('../middleware/auth');

// All report routes require authentication
router.use(authenticateToken);

// Reports routes
router.post('/', reportController.createReport);
router.get('/', reportController.getAllReports);
router.get('/:id', reportController.getReportById);
router.delete('/:id', reportController.deleteReport);
router.post('/:id/export', reportController.exportReport);

// Analytics routes
router.get('/analytics', reportController.getAnalytics);

module.exports = router;
