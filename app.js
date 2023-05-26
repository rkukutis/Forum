const express = require('express');
const morgan = require('morgan');

const userRoutes = require('./routes/userRoutes');

const app = express();

// enable logging if in development mode
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.json());

// Serve files from public page
// app.use(express.static(`${__dirname}/public`));

/////////////////////////////////////////////////////////

// Routing
app.get('/', (req, res) => {
  res.status(200).send('Hello from root');
});

// Mounting routers
app.use('/users', userRoutes);

app.get('*', (req, res) => {
  res.end();
});

module.exports = app;
