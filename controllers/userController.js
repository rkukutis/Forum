const catchAsync = require('../utils/catchAsync');
const databaseActions = require('../database/databaseActions');
const AppError = require('../utils/appError');

/////////////////////////////////////////////////////////////////
// Most of these functions are for admin use, i'll maybe delete some later

exports.createUser = catchAsync(async (req, res, next) => {
  const data = await databaseActions.insertData(req.body, 'users');
  console.log(data);
  res.status(200).json({ status: 'success', data: req.body });
});

exports.getDataUsers = catchAsync(async (req, res, next) => {
  const data = await databaseActions.getAllData('users', req.query);
  res.status(200).json({ status: 'success', data });
});

exports.getUserData = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  const user = await databaseActions.selectUser(
    'select',
    'users',
    'id',
    userId
  );
  res.status(200).json({ status: 'success', data: user });
});

exports.deleteAllUsers = catchAsync(async (req, res, next) => {
  databaseActions.deleteAllData('users');
  res.status(204).json({ status: 'success' });
});
exports.deleteUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  await databaseActions.selectUser('delete', 'users', 'id', userId);
  res.status(204).json({ status: 'success' });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  console.log(req.file);
  const updatedUser = await databaseActions.updateEntry(
    'users',
    req.body,
    'id',
    userId
  );
  // await db.none('UPDATE users SET active = $1 WHERE id = $2', [true, 123]);
  res.status(200).json({ status: 'success', user: updatedUser });
});
