///////////////////////
// The app.js file is mostly used for middleware declarations

const express = require('express');
const morgan = require('morgan');

const userRoutes = require('./routes/userRoutes');

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

// Mounting users router
app.use('/users', userRoutes);

// Redirects unhandled routes to root
app.get('*', (req, res) => {
  res.redirect('/home.html');
});

module.exports = app;
