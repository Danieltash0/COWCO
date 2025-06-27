const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Admin routes - require authentication and admin role
router.use(authenticateToken);
router.use(requireRole(['Admin', 'Farm Manager']));

// User management
router.get('/users', adminController.getAllUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.put('/users/:id/status', adminController.toggleUserStatus);

// Activity logs
router.get('/logs', adminController.getActivityLogs);
router.get('/logs/user/:userId', adminController.getLogsByUser);
router.get('/logs/action/:action', adminController.getLogsByAction);
router.get('/logs/export', adminController.exportLogs);

// Settings
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);

module.exports = router;
