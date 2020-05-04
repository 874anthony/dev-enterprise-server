const exprees = require('express');
const projectController = require('../controllers/projectController');

const router = exprees.Router();

router
  .route('/monthly-revenue/:month')
  .get(projectController.getMonthlyRevenue);

router
  .route('/')
  .get(projectController.getProjectsAll)
  .post(projectController.createProject);

router
  .route('/:id')
  .patch(projectController.updateProject)
  .delete(projectController.deleteProject);

module.exports = router;
