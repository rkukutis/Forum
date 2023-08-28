const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
app.use(cookieParser());

// enable logging if in development mode
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.json());

app.use(cors({ credentials: true, origin: true }));

// frontend will be hosted seperately
// app.use(express.static('./client/build'));

// accesses user photos
app.use('/userPhotos', express.static(`${__dirname}/img/users`));
// Routing

// Mounting routers
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

app.use(globalErrorHandler);

module.exports = app;
