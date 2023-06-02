const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const databaseActions = require('./databaseActions');
const passwordHash = require('../passwordHash');
const catchAsync = require('../utils/catchAsync');
const { insertData } = require('./databaseActions');

exports.login = async (req, res) => {
  console.log(req.headers.authorization);
  res.status(200).json({ status: 'ok' });
};

const signToken = (username, email) =>
  jwt.sign({ username, email }, process.env.JWT_SECRET);

exports.createUser = catchAsync(async (req, res, next) => {
  console.log(req.body);
  // 1) Get user data from request body
  const { username, email } = req.body;
  // 2) Create token
  const token = signToken(username, email);
  const data = await insertData(req.body, 'users');
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
  res.status(200).json({ status: 'ok', user, token });
});
