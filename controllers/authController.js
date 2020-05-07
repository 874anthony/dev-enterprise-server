const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove the password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    user
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  createSendToken(newUser, 201, res);
});

exports.logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // If it's not provided
  if (!email || !password) {
    return next(new AppError('Please, put your email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  // If it not exists
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password, try again', 400));
  }

  createSendToken(user, 200, res);
});

exports.isLogged = catchAsync(async (req, res, next) => {
  let token;

  // Verify if the token exists

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! You can't get access", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  // Check if the user exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does no longer exist', 401)
    );
  }

  req.user = currentUser;
  next();
});

exports.validRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to access here.', 403)
      );
    }
    next();
  };
};

// TODO: Reset the passwords and the changed iat
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("There's not user with this current email", 404));
  }

  // 2) Send him the token to reset
  const resetToken = user.createPasswordToken();
  user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'Go to /resetPassword with the token to reset your password',
    token: resetToken
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const resetToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.find({
    resetPasswordToken: resetToken,
    resetPasswordExpires: { $gt: Date.now() }
  });
});
