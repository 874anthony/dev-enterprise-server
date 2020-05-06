const express = require('express');
const weatherController = require('../controllers/weatherController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/get-current-weather/:city')
  .get(authController.isLogged, weatherController.getWeatherByName);

module.exports = router;
