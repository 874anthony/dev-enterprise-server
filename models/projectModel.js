const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: [true, 'A project must have a name'],
    minlength: [10, 'A project must have at least 10 characters'],
    unique: true
  },
  priority: {
    type: String,
    enum: ['to define', 'low', 'medium', 'high', 'mandatory'],
    default: 'to define'
  },
  budget: {
    type: Number,
    required: [true, 'You must specify the amount needed'],
    min: [20000, 'The minimun value should be at least 20000']
  },
  profitPercentage: {
    type: Number,
    min: 10,
    max: 100,
    default: 10,
    required: [true, 'You must indicate the revenue value for the enterprise']
  },
  summary: {
    type: String,
    trim: true
  },
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
  },
  projectStatus: {
    type: String,
    enum: ['waiting', 'approved', 'denied', 'started', 'finished'],
    default: 'waiting'
  },
  updatedAt: {
    type: Date,
    default: undefined
  }
});

// PRE MIDDLEWARES
// QUERY MIDDLEWARES
// - Modifying udpated at everythime something changes
projectSchema.pre(/^find/, function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
