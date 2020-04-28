const exprees = require('express');
const projectController = require('../controllers/projectController');

const router = exprees.Router();

router.route('/').get(projectController.GetProjectsAll);

module.exports = router;
