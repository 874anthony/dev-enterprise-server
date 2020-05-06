// TODO: Finish this controller
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const Factory = require('./handlerFactory');

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'This route is not defined, please use /signup instead'
  });
};
