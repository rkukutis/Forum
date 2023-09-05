const jwt = require('jsonwebtoken');

const AppError = require('../utils/appError');
const databaseActions = require('../database/databaseActions');
const passwordHash = require('../utils/passwordHash');
const catchAsync = require('../utils/catchAsync');
const Mail = require('../utils/mail');
const generateRandomString = require('../utils/generateRandomString');

const signToken = (username, email) =>
  jwt.sign({ username, email }, process.env.JWT_SECRET);

exports.createUser = catchAsync(async (req, res, next) => {
  // 1) Get user data from request body
  const { username, email, password, passwordConfirm } = req.body;
  if (!username || !email || !password)
    return next(new AppError('Username, email or password missing'));
  if (password !== passwordConfirm)
    return next(new AppError('Passwords do not match'));
  if (password.length >= 40 || email.length >= 40 || username.length >= 40)
    return next(
      new AppError(
        'Password, username or email is too long (max 40 characters)'
      )
    );

  // 2) Create token
  const token = signToken(username, email);
  // 3) Get created user
  const registrationCode = generateRandomString(64);
  const [user] = await databaseActions.insertData(
    {
      username,
      email,
      password,
      registration_confirmation_code: registrationCode,
    },
    'users'
  );
  // 4) Send email to ask for account confirmation
  // user is of unconfirmed status until email confirmation, this will be used to restrict functionality
  const mail = new Mail(
    user,
    'Welcome to the forum!',
    `We are glad to have you with us, ${user.username}. Please follow this link to confirm your registration http://localhost:8000/auth/confirm?token=${registrationCode}`
  );
  mail.send();

  // return cookie
  res.cookie('jwt', token, { maxAge: 30 * 60 * 1000 });
  res.status(200).json({ status: 'success', user });
});

exports.confirmSignup = catchAsync(async (req, res, next) => {
  const { code } = req.params;

  const user = await databaseActions.selectUser(
    'select',
    'users',
    'registration_confirmation_code',
    code
  );

  if (!user) return next(new AppError('Wrong confirmation code', 400));

  await databaseActions.updateEntry(
    'users',
    {
      // password will be hashed by updateEntry function
      status: 'active',
      registration_confirmation_code: '',
    },
    'id',
    user.id
  );

  res.status(200).json({ status: 'ok', message: 'user email confirmed' });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError(`No email or password specified`, 400));
  }

  // 2) Get user
  const user = await databaseActions.selectUser(
    'select',
    'users',
    'email',
    email
  );
  console.log(await passwordHash.comparePasswords(user.password, password));

  // Check if user exists and if passwords match
  if (
    !user ||
    !(await passwordHash.comparePasswords(user.password, password))
  ) {
    return next(new AppError(`Incorrect email or password`, 401));
  }

  // Respond with cookie
  const token = signToken(user.username, user.email);
  res.cookie('jwt', token, { maxAge: 30 * 60 * 1000 });
  res.status(200).json({ status: 'ok', user });
});

exports.protect = catchAsync(async (req, res, next) => {
  console.log(req.cookies.jwt);
  let token;
  // 1) get JWT
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
      new AppError('You have been logged out. Please try again later', 400)
    );
  }
  req.user = user;
  next();
});

exports.confirmAuth = catchAsync(async (req, res) => {
  // receives user from protect middleware
  res.status(200).json({ status: 'ok', message: 'User valid', user: req.user });
});

exports.restrictToRole =
  (...roles) =>
  (req, res, next) => {
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
  if (!updatedUser || updatedUser.id !== req.user.id)
    return next(
      new AppError('Only the owner of this account can make changes', 403)
    );

  next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  // 1) Find user with correct email
  const user = await databaseActions.selectUser(
    'select',
    'users',
    'email',
    email
  );
  if (!user) return next(new AppError('No user with this email adress', 404));

  // 2) generate random string, add it and creation time to db
  const randomString = generateRandomString(32);
  const hashedString = await passwordHash.hashPassword(randomString);
  const currentDateISO = new Date(Date.now()).toISOString();

  await databaseActions.updateEntry(
    'users',
    { password_reset_code: hashedString, password_changed: currentDateISO },
    'id',
    user.id
  );

  // 3) Send email with password reset string
  const mail = new Mail(
    user,
    'Password reset Code',
    `Enter this code to reset you password: ${randomString} or follow the link http://localhost:8000/auth/resetPassword?user=${user.email}&token=${randomString}}. Code expires in 10 minutes`
  );
  mail.send();
  res
    .status(200)
    .json({ status: 'ok', message: 'Password reset code or link sent' });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // email should be stored client side after requesting reset code
  const { email, resetCode, newPassword } = req.body;

  // 1) Check if received email matches the one stored in the db and is not expired (10 min)
  const user = await databaseActions.selectUser(
    'select',
    'users',
    'email',
    email
  );

  if (!user) return next(new AppError('This user does not exist', 404));

  // Compare received plain string with stored hashed string
  if (
    !(await passwordHash.comparePasswords(user.password_reset_code, resetCode))
  )
    return next(new AppError('Wrong password reset code', 400));

  // Check reset code validity
  if (Date.now() - new Date(user.password_changed).getTime() > 600000)
    return next(new AppError('Password reset code has expired', 400));

  // 2) Check if new password is not the same as the old one
  if (await passwordHash.comparePasswords(user.password, newPassword))
    return next(new AppError('New password is the same as the old one', 400));

  // 3) Set new Password
  await databaseActions.updateEntry(
    'users',
    {
      // password will be hashed by updateEntry function
      password: newPassword,
      password_reset_code: '',
    },
    'id',
    user.id
  );

  res.status(200).json({ status: 'ok', message: 'password reset' });
});
