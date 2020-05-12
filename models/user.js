const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AuthError = require('../errors/auth-err');
const { WRONG_AUTH } = require('../config/constants');

const userSchema = new mongoose.Schema({
  email: {
    required: true,
    type: String,
    unique: true,
  },
  password: {
    required: true,
    type: String,
    select: false,
    minlength: 8,
  },
  name: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthError(WRONG_AUTH));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthError(WRONG_AUTH));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
