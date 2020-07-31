const routes = require('express').Router();

const users = require('./users');
const articles = require('./articles');
const { createUser, login, logout } = require('../controllers/users');
const { createUserCheck, loginCheck } = require('../modules/validation');
const { auth } = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');
const { NOT_FOUND } = require('../config/constants');

routes.post('/signup', createUserCheck, createUser);
routes.post('/signin', loginCheck, login);
routes.post('/logout', logout);

routes.use(auth);
routes.use(users);
routes.use(articles);

/* eslint-disable no-unused-vars */
routes.all('*', (req, res, next) => {
  /* eslint-enable no-unused-vars */
  throw new NotFoundError(NOT_FOUND);
});

module.exports = routes;
