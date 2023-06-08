const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const databaseActions = require('./databaseActions');
const passwordHash = require('../passwordHash');
const catchAsync = require('../utils/catchAsync');
const { insertData } = require('./databaseActions');

const signToken = (username, email) =>
  jwt.sign({ username, email }, process.env.JWT_SECRET);

exports.createUser = catchAsync(async (req, res, next) => {
  // 1) Get user data from request body
  const { username, email } = req.body;
  // 2) Create token
  const token = signToken(username, email);
  const data = await insertData(req.body, 'users');
  res.cookie('jwt', token, { maxAge: 30 * 60 * 1000 });
  res.status(200).json({ status: 'success', data, token });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    next(new AppError(`No email or password specified`, 400));
  }

  // 2) Check if user exists and password is correct
  const user = await databaseActions.selectEntry(
    'select',
    'users',
    'email',
    email
  );
  if (
    !user ||
    !(await passwordHash.comparePasswords(user.password, password))
  ) {
    return next(new AppError(`Incorrect email or password`, 401));
  }
  const token = signToken(user.username, user.email);
  res.cookie('jwt', token, { maxAge: 30 * 60 * 1000 });
  res.status(200).json({ status: 'ok', user, token });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Check for cookie with jwt
  if (!req.cookies) next(new AppError('Your are not logged in', 400));
  // 2) Find user with credentials
  const { username } = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
  const user = await databaseActions.selectEntry(
    'select',
    'users',
    'username',
    username
  );
  if (!user)
    next(new AppError('You have been logged out. Please try again later'));
  req.user = user;
  next();
});
