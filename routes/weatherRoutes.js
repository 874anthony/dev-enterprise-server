const express = require('express');
const weatherController = require('../controllers/weatherController');
const authController = require('../controllers/authController');

const router = express.Router();

// Needs to be logged first
router.use(authController.isLogged);

router
  .route('/get-current-weather/:city')
  .get(weatherController.getWeatherByName);

module.exports = router;
