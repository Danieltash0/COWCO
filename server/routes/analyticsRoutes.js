const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// CRUD for financial records
router.get('/financial-records', analyticsController.getAllFinancialRecords);
router.get('/financial-records/:id', analyticsController.getFinancialRecordById);
router.post('/financial-records', analyticsController.createFinancialRecord);
router.put('/financial-records/:id', analyticsController.updateFinancialRecord);
router.delete('/financial-records/:id', analyticsController.deleteFinancialRecord);

// Analytics summary and export
router.get('/summary', analyticsController.getAnalyticsSummary);
router.get('/export', analyticsController.exportFinancialReport);
router.get('/records-by-date', analyticsController.getFinancialRecordsByDateRange);

module.exports = router; 