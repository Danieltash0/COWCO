const express = require('express');
const router = express.Router();
const cattleController = require('../controllers/cattleController');
const { authenticateToken } = require('../middleware/auth');

// All cattle routes require authentication
router.use(authenticateToken);

router.post('/', cattleController.createCattle);
router.get('/', cattleController.getAllCattle);
router.get('/:id', cattleController.getCattleById);
router.put('/:id', cattleController.updateCattle);
router.delete('/:id', cattleController.deleteCattle);

module.exports = router;
