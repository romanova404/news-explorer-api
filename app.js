require('dotenv').config({
  path: './.env',
});

const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const limiter = require('./limiter');
const routes = require('./routes');
const { createUser, login } = require('./controllers/users');
const { createUserCheck, loginCheck } = require('./modules/validation');

const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

app.use(helmet());
app.use(limiter);
const { PORT = 3000, MONGO_URL } = process.env;

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(cookieParser());

app.use(requestLogger);

app.post('/signup', createUserCheck, createUser);
app.post('/signin', loginCheck, login);

app.use(auth, routes);

app.use(errorLogger);

app.use(errors());
app.use((err, req, res, next) => { /* eslint-disable-line no-unused-vars */
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
