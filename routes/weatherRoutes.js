const express = require('express');
const weatherController = require('../controllers/weatherController');

const router = express.Router();

router
  .route('/get-current-weather/:city')
  .get(weatherController.getWeatherByName);

module.exports = router;
