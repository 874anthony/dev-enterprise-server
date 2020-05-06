const express = require('express');
const projectController = require('../controllers/projectController');
const authController = require('../controllers/authController');

const router = express.Router();

// Needs to be logged in
router.use(authController.isLogged);

// Personalized routes
router
  .route('/monthly-revenue/:month')
  .get(authController.validRoles('admin'), projectController.getMonthlyRevenue);

// Normal Routes
router
  .route('/')
  .get(
    authController.validRoles('admin', 'project-manager'),
    projectController.getProjectsAll
  )
  .post(projectController.createProject);

// Normal Routes with parameter
router
  .route('/:id')
  .get(
    authController.validRoles('admin', 'project-manager'),
    projectController.getProject
  )
  .patch(projectController.updateProject)
  .delete(
    authController.validRoles('admin', 'project-manager'),
    projectController.deleteProject
  );

module.exports = router;
