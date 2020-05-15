const multer = require('multer');
const Project = require('../models/projectModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Factory = require('./handlerFactory');

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },

  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    let filename = '';

    if (file.fieldname === 'imageCover') {
      filename = `project-${req.user.id}-${Date.now()}-cover.${ext}`;
    }

    if (req.files.images) {
      req.files.images.forEach(
        // eslint-disable-next-line no-return-assign
        (filePassed, i) =>
          (filename = `project-${req.user.id}-${Date.now()}-${i + 1}.${ext}`)
      );
    }

    cb(null, filename);
  }
});

const upload = multer({
  storage,
  fileFilter: multerFilter
});

exports.updateProjectImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);

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

exports.ProjectsWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitute and longitude in the format lat,lng.',
        400
      )
    );
  }

  const projects = await Project.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    status: 'success',
    results: projects.length,
    data: {
      data: projects
    }
  });
});

// From the handler
exports.getProject = Factory.getOne(Project);
exports.getProjectsAll = Factory.getAll(Project, {
  path: 'user',
  select: 'role name email'
});
exports.createProject = Factory.createOne(Project);
exports.updateProject = Factory.updateOne(Project);
exports.deleteProject = Factory.deleteOne(Project);
