const Project = require('../models/projectModel');

exports.GetProjectsAll = async (req, res) => {
  try {
    const projects = await Project.find({});

    res.status(200).json({
      status: 'success',
      total: projects.length,
      data: {
        projects
      }
    });
  } catch (error) {
    console.log('Error', error);
  }
};

exports.CreateProject = async (req, res) => {
  // TODO: Verify if it doesn't exist the req.body
  try {
    const newProject = await Project.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        project: newProject
      }
    });
  } catch (error) {
    console.log('Error en el servidor:', error);
  }
};

exports.UpdateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true
    });

    res.status(202).json({
      status: 'success',
      data: {
        project
      }
    });
  } catch (error) {
    console.log(`Throw NEW ERROR: ${error}`);
  }
};
