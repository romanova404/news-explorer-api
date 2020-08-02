require('dotenv').config({
  path: './.env',
});

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const { mongoUrlDev } = require('./config/devconfig');
const limiter = require('./limiter');
const routes = require('./routes');
const { errorHandler } = require('./modules/errorhandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

app.use(helmet());
app.use(limiter);

const { PORT = 3000, NODE_ENV, MONGO_URL } = process.env;

mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : mongoUrlDev, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const corsList = ['https://romanova404.github.io/', 'http://localhost:8080', 'https://yandexstudyproject.design'];
const corsOptions = {
  origin: corsList,
  credentials: true,
};

app.use(bodyParser.json());
app.use(cookieParser());

app.options('*', cors(corsOptions), (req, res) => {
  res.status(200).send('OK');
});
app.use(cors(corsOptions));

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
