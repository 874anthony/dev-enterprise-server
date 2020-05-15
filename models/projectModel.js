const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: [true, 'A project must have a name'],
    minlength: [10, 'A project must have at least 10 characters'],
    maxlength: [25, "A project can't exceed the 25 characters"],
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
    default: 20,
    required: [true, 'You must indicate the revenue value for the enterprise']
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'You must specify details about the project']
  },
  startDate: {
    type: Date,
    required: [true, 'A tour must have a date of start']
  },
  finishDate: {
    type: Date,
    required: [true, 'A tour must have a date of finish']
  },
  imageCover: {
    type: String,
    default: 'default.jpg'
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
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A project must have an user']
  }
});

// INDEXES
projectSchema.index({ location: '2dsphere' });

// POST MIDDLEWARES
// DOCUMENT MIDDLEWARES
// - Populating the field of user
projectSchema.post('save', async function(doc, next) {
  await doc
    .populate({
      path: 'user',
      select: 'role name email'
    })
    .execPopulate();
});

//////////////////////////////////////////////////////

// PRE MIDDLEWARES
// QUERY MIDDLEWARES
// - Modifying udpated at everythime something changes
projectSchema.pre(/^find/, function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
