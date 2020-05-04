const express = require('express');
const projectController = require('../controllers/projectController');

const router = express.Router();

// Personalized routes
router
  .route('/monthly-revenue/:month')
  .get(projectController.getMonthlyRevenue);

// Normal Routes
router
  .route('/')
  .get(projectController.getProjectsAll)
  .post(projectController.createProject);

// Normal Routes with parameter
router
  .route('/:id')
  .patch(projectController.updateProject)
  .delete(projectController.deleteProject);

module.exports = router;
