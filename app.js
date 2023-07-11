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

// Serve files from public page

/////////////////////////////////////////////////////////
// const corsOptions = {
//   // origin:'https://abc.onrender.com',
//   AccessControlAllowOrigin: '*',
//   origin: '*',
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
// };
// app.options(cors(corsOptions));

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, PUT, POST');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept'
//   );
//   next();
// });

app.use(cors({ credentials: true, origin: true }));

app.use(express.static('./client/build'));
app.use('/userPhotos', express.static(`${__dirname}/img/users`));
// Routing
app.get('/', (req, res) => {
  res.status(200).send('Hello from root');
});

// Mounting routers
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

app.use(globalErrorHandler);

module.exports = app;
