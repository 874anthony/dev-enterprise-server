const Project = require('../models/projectModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Factory = require('./handlerFactory');

// From the handler
exports.getProjectsAll = Factory.getAll(Project);
exports.getProject = Factory.getOne(Project);

exports.createProject = Factory.createOne(Project);
exports.updateProject = Factory.updateOne(Project);
exports.deleteProject = Factory.deleteOne(Project);

// Personalized
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
