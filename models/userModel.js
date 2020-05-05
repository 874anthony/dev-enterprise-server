const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please, tell us your name!']
  },
  email: {
    type: String,
    required: [true, 'Please, tell us your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please, provide us a valid email']
  },
  photo: {
    type: String,
    default: 'default.jpg'
  },
  password: {
    type: String,
    minlength: 8,
    required: [true, 'Please, put a password'],
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please, confirm your password'],
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'Its not the same password! Try again'
    }
  },
  country: {
    type: String,
    required: [true, 'Please, tell us where are you from'],
    validate: [validator.isAlpha, 'Please, the country must contain letters']
  },
  city: {
    type: String,
    required: [true, 'Please, tell us your city'],
    validate: [validator.isAlpha, 'Please, the country must contain letters'],
    lowercase: true
  },
  phoneNumber: {
    type: String,
    validate: [validator.isMobilePhone, 'Please, supply us a valid number'],
    select: false
  },
  description: {
    type: String,
    trim: true,
    maxlength: [100, 'You must not pass 100 characters']
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
