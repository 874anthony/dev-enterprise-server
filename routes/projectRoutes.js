const express = require('express');
// Controllers
const projectController = require('../controllers/projectController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// Needs to be logged in
router.use(authController.isLogged);

// Create and endpoint for nearest projects

// Personalized routes
router
  .route('/monthly-revenue/:month')
  .get(authController.validRoles('admin'), projectController.getMonthlyRevenue);

router
  .route('/projects-within/:distance/center/:latlng/unit/:unit')
  .get(projectController.ProjectsWithin);

// Normal Routes
router
  .route('/')
  .get(projectController.getProjectsAll)
  .post(projectController.createProject);

router
  .route('/:id')
  .get(
    authController.validRoles('admin', 'project-manager'),
    projectController.getProject
  )
  .patch(projectController.updateProjectImages, projectController.updateProject)
  .delete(
    authController.validRoles('admin', 'project-manager'),
    projectController.deleteProject
  );

module.exports = router;
