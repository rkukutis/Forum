const User = require('../models/usersModel');
const APIFeatures = require('../routes/utils/apiFeatures');
const catchAsync = require('../routes/utils/catchAsync');
const AppError = require('../routes/utils/AppError');

exports.getAllUsers = catchAsync(async (req, res) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const users = await features.query;
  res.status(200).json({ status: 'success', data: users });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({ status: 'success', message: newUser });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    // Return because we dont want to return the 200 response below
    return next(new AppError('No user found with this ID', 404));
  }

  res.status(200).json({ status: 'success', message: user });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id);

  if (!user) {
    // Return because we dont want to return the 200 response below
    return next(new AppError('No user found with this ID', 404));
  }

  res.status(200).json({ status: 'success', message: user });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    // Return because we dont want to return the 200 response below
    return next(new AppError('No user found with this ID', 404));
  }

  res.status(204).json({ status: 'success', message: user });
});
