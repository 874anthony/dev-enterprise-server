const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: [true, 'A project must have a name'],
    minlength: 3
  },
  priority: {
    type: String,
    default: 'To define'
  },
  budget: {
    type: Number,
    required: [true, 'You must specify the amount needed']
  },
  summary: String,
  startDate: Date,
  finishDate: Date,
  imageCover: {
    type: String,
    required: [true, 'A project must have an image cover']
  },
  images: [String],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number],
    zoneDescription: String
  }
  // projectStatus: {
  //   type: String,
  //   enum:
  // }
});

// PRE-SAVE DOCUMENTS MIDDLEWARES

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
