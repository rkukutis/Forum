///////////////////////
// The app.js file is mostly used for middleware declarations

const express = require('express');
const morgan = require('morgan');

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const AppError = require('./routes/utils/AppError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// Middlewares
// Middleware has access to the request and response
// next() must always be called in the end of the middleware function
// The order of the middleware in the code is VERY important

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.json());

// User middleware
app.use(express.static(`${__dirname}/public`));

/////////////////////////////////////////////////////////

// Routing
app.get('/', (req, res) => {
  res.status(200).send('Hello from root');
});

// Mounting routers
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

// Redirects unhandled routes to root
app.get('*', (req, res) => {
  res.end();
});

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
  // if next() receives an argument, express assumes an error has occured
});

app.use(globalErrorHandler);

module.exports = app;
