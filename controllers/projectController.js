const Project = require('../models/projectModel');

exports.GetProjectsAll = async (req, res) => {
  try {
    const projects = await Project.find({});

    res.status(200).json({
      status: 'success',
      total: projects.length,
      data: {
        projects,
      },
    });
  } catch (error) {
    console.log('Error', error);
  }
};

exports.CreateProject = async (req, res) => {};
