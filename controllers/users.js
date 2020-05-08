const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userModel = require('../models/user.js');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.showUserInfo = (req, res, next) => {
  userModel.findById({ _id: req.user._id })
    .then((user) => {
      res.status(200).send({ email: user.email, name: user.name });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => userModel.create({ email, password: hash, name }))
    .then((user) => res.status(201).send({ _id: user._id, email: user.email, name: user.name }))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return userModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 604800,
        httpOnly: true,
        sameSite: true,
        secure: true,
      });
      res.send({ token });
    })
    .catch(next);
};
