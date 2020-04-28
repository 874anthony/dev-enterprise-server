// Starting the app
const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const projectRouter = require('./routes/projectRoutes');

app.use('/api/v1/projects', projectRouter);

module.exports = app;
