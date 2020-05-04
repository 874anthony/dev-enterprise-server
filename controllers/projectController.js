const Project = require('../models/projectModel');

exports.getProjectsAll = async (req, res) => {
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
    res.status(500).json({
      status: 'fail',
      data: {
        error
      }
    });
  }
};

exports.createProject = async (req, res) => {
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
    res.status(500).json({
      status: 'fail',
      data: {
        error
      }
    });
  }
};

exports.updateProject = async (req, res) => {
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
    res.status(500).json({
      status: 'fail',
      data: {
        error
      }
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: {
        message: 'El registro ha sido eliminado exitosamente'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      data: {
        error
      }
    });
  }
};

exports.getMonthlyRevenue = async (req, res) => {
  try {
    const { month } = req.params;

    const earnings = await Project.aggregate([
      {
        $match: {
          finishDate: {
            $gte: new Date(`2020-${month}-01`),
            $lte: new Date(`2020-${month}-31`)
          }
        }
      },
      {
        $group: {
          _id: null,
          totalGaining: {
            $sum: {
              $divide: [{ $multiply: ['$budget', '$profitPercentage'] }, 100]
            }
          }
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        earnings
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      data: {
        error
      }
    });
  }
};
