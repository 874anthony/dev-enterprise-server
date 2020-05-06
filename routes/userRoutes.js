const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// Handling the auth.
router.route('/signUp').post(authController.signUp);
router.route('/login').post(authController.logIn);

// Handling the users
router.route('/').post(userController.createUser);

module.exports = router;
