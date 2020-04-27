// Starting the app
const express = require('express');
const app = express();

// Routes
const projectRouter = require('./routes/projectRoutes');

app.use('/api/v1/projects', projectRouter);

module.exports = app;
