const jwt = require('jsonwebtoken');

const AppError = require('../utils/appError');
const databaseActions = require('../database/databaseActions');
const passwordHash = require('../utils/passwordHash');
const catchAsync = require('../utils/catchAsync');

const signToken = (username, email) =>
  jwt.sign({ username, email }, process.env.JWT_SECRET);

exports.createUser = catchAsync(async (req, res, next) => {
  // 1) Get user data from request body
  //TO DO: sanitize user input
  const { username, email, password } = req.body;
  // 2) Create token
  const token = signToken(username, email);
  const data = await databaseActions.insertData(
    { username, email, password },
    'users'
  );
  res.cookie('jwt', token, { maxAge: 30 * 60 * 1000 });
  res.status(200).json({ status: 'success', data, token });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError(`No email or password specified`, 400));
  }

  // 2) Check if user exists and password is correct
  const user = await databaseActions.selectUser(
    'select',
    'users',
    'email',
    email
  );
  console.log(user);
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
  let token;
  // 1) get jwt
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) return next(new AppError('Your are not logged in', 400));
  // 2) Find user with credentials
  const { username } = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
  const user = await databaseActions.selectUser(
    'select',
    'users',
    'username',
    username
  );
  if (!user) {
    return next(
      new AppError('You have been logged out. Please try again later')
    );
  }
  req.user = user;
  next();
});

exports.restrictToRole =
  (...roles) =>
  (req, res, next) => {
    console.log(roles);
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`You do not have permission to perform this action`, 403)
      );
    }
    next();
  };

exports.restrictToAccountOwner = catchAsync(async (req, res, next) => {
  const updatedUser = await databaseActions.selectUser(
    'select',
    'users',
    'id',
    req.user.id
  );
  console.log(updatedUser, req.user);
  if (!updatedUser || updatedUser.id !== req.user.id)
    return next(
      new AppError('Only the owner of this account can make changes')
    );

  next();
});
