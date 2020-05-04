const Project = require('../models/projectModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getProjectsAll = catchAsync(async (req, res, next) => {
  const projects = await Project.find({});

  res.status(200).json({
    status: 'success',
    total: projects.length,
    data: {
      projects
    }
  });
});

exports.getProject = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const project = await Project.findById(id);

  if (!project) {
    return next(
      new AppError(
        'No project was found for that ID, please try with another',
        404
      )
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      project
    }
  });
});

exports.createProject = catchAsync(async (req, res, next) => {
  // TODO: Verify if it doesn't exist the req.body
  const newProject = await Project.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      project: newProject
    }
  });
});

exports.updateProject = catchAsync(async (req, res, next) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true
  });

  if (!project) {
    return next(
      new AppError(
        'No project was found for that ID, please try with another',
        404
      )
    );
  }

  res.status(202).json({
    status: 'success',
    data: {
      project
    }
  });
});

exports.deleteProject = catchAsync(async (req, res, next) => {
  const project = await Project.findByIdAndDelete(req.params.id);

  if (!project) {
    return next(
      new AppError(
        'No project was found for that ID, please try with another',
        404
      )
    );
  }

  res.status(204).json({
    status: 'success',
    data: {
      message: 'It was deleted successfully!'
    }
  });
});

exports.getMonthlyRevenue = catchAsync(async (req, res, next) => {
  const { month } = req.params;

  if (month < 1 || month > 12) {
    return next(
      new AppError('The month range should be 1 to 12, try again', 400)
    );
  }

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
});
