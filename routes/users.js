const routerUsers = require('express').Router();

const { showUserInfo } = require('../controllers/users');

routerUsers.get('/users/me', showUserInfo);

module.exports = routerUsers;
