const express = require('express');
const router = express.Router();
const cattleController = require('../controllers/cattleController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// All cattle routes require authentication
router.use(authenticateToken);

router.post('/', cattleController.createCattle);
router.get('/', cattleController.getAllCattle);
router.get('/:id', cattleController.getCattleById);

// Edit and delete operations require admin or manager role
router.put('/:id', requireRole(['admin', 'manager']), cattleController.updateCattle);
router.delete('/:id', requireRole(['admin', 'manager']), cattleController.deleteCattle);

module.exports = router;
