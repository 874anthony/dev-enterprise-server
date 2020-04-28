const exprees = require('express');
const projectController = require('../controllers/projectController');

const router = exprees.Router();

router
  .route('/')
  .get(projectController.GetProjectsAll)
  .post(projectController.CreateProject);

router.route('/:id').patch(projectController.UpdateProject);

module.exports = router;
