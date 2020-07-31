require('dotenv').config({
  path: './.env',
});

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate } = require('celebrate');
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

// cors для работы с кроссерверными запросами
const corsOptions = {
  origin: 'https://romanova404.github.io/',
  credentials: true,
};

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(requestLogger);

app.use(routes);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
