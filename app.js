// 3rd-party packages
const express = require('express');
const morgan = require('morgan');

// Own packages
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// Parse the Request  to the body.
app.use(express.json());
// Encoding the data sent by the URL. (My own explication)
app.use(express.urlencoded({ extended: true }));
// Getting the logs
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
const projectRouter = require('./routes/projectRoutes');
const weatherRouter = require('./routes/weatherRoutes');
const userRouter = require('./routes/userRoutes');

// Handling the middleware routes
app.use('/api/v1/projects', projectRouter);
app.use('/api/v1/weather', weatherRouter);
app.use('/api/v1/users', userRouter);
// No routes encountered
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} in this server!`, 404));
});

// Gbloal Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;
