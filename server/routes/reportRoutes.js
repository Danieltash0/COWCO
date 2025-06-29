const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roleAuth');

// Get real-time production summary
router.get('/production-summary', authenticateToken, authorizeRoles(['manager', 'admin']), reportController.getProductionSummary);

// Get real-time health summary
router.get('/health-summary', authenticateToken, authorizeRoles(['manager', 'admin']), reportController.getHealthSummary);

// Get real-time financial summary
router.get('/financial-summary', authenticateToken, authorizeRoles(['manager', 'admin']), reportController.getFinancialSummary);

module.exports = router; 