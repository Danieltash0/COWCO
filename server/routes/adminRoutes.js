const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Apply authentication to all routes
router.use(authenticateToken);

// Debug endpoint to check user info
router.get('/debug/user', adminController.debugUserRole);

// User management - allow both admin and farm manager access
router.get('/users', requireRole(['admin', 'Admin', 'manager', 'Farm Manager']), adminController.getAllUsers);

// Apply admin role requirement to all other routes
router.use(requireRole(['admin', 'Admin']));

// User management (create, update, delete) - admin only
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.put('/users/:id/status', adminController.toggleUserStatus);

// Activity logs
router.get('/logs', adminController.getActivityLogs);
router.get('/logs/login', adminController.getLoginLogs);
router.get('/logs/user/:userId', adminController.getLogsByUser);
router.get('/logs/action/:action', adminController.getLogsByAction);
router.get('/logs/stats', adminController.getLogStats);
router.delete('/logs/clear', adminController.clearOldLogs);
router.get('/logs/export', adminController.exportLogs);

// Settings
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);

module.exports = router;
