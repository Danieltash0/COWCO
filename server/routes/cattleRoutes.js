const express = require('express');
const router = express.Router();
const cattleController = require('../controllers/cattleController');

router.post('/', cattleController.createCattle);
router.get('/', cattleController.getAllCattle);

module.exports = router;
