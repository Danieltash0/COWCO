const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');
const { authenticateToken } = require('../middleware/auth');

// All QR routes require authentication
router.use(authenticateToken);

// QR Code generation and management
router.post('/generate', qrController.generateQRCode);
router.get('/', qrController.getAllQRCodes);
router.get('/:id', qrController.getQRCodeById);
router.get('/cattle/:cattleId', qrController.getQRCodeByCattleId);
router.delete('/:id', qrController.deleteQRCode);

// QR Code scanning
router.post('/scan', qrController.scanQRCode);

module.exports = router;
