const express = require('express');
// Controllers
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
// Routes
const projectRouter = require('../routes/projectRoutes');

const router = express.Router();

// Redirect
router.use('/:userId/projects', projectRouter);

// Handling the auth.
router.route('/signUp').post(authController.signUp);
router.route('/login').post(authController.logIn);

// Handling the users
router.route('/').post(userController.createUser);

module.exports = router;
