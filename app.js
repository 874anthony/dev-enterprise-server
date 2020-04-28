// Starting the app
const express = require('express');
const morgan = require('morgan');

const app = express();

// Parse the Request  to the body.
app.use(express.json());
// Encoding the data sent by the URL. (My own explication)
app.use(express.urlencoded({ extended: true }));
// Getting the logs
app.use(morgan('dev'));

// Routes
const projectRouter = require('./routes/projectRoutes');

app.use('/api/v1/projects', projectRouter);

module.exports = app;
