// Own requires
const AppError = require('../utils/appError');

// Error handlers

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const sendErrorProduction = (err, res) => {
  // Operational error created by us

  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    // If it didn't come by us UNKNOWN ERROR
    // Log the error
    console.error(err);

    // Display the generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
};

const sendErrorDevelopment = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDevelopment(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // Creating the new error
    let error = { ...err };

    // CAST ERROR
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    // DUPLICATE FIELDS
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    sendErrorProduction(error, res);
  }
};
