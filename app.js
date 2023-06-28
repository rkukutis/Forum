const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// enable logging if in development mode
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.json());

app.use(cookieParser());

// Serve files from public page

/////////////////////////////////////////////////////////

app.use(cors());
app.use('/userPhotos', express.static(`${__dirname}/img/users`));
// Routing
app.get('/', (req, res) => {
  res.status(200).send('Hello from root');
});

// Mounting routers
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

// app.get('*', (req, res) => {
//   res.end();
// });

app.use(globalErrorHandler);

module.exports = app;
