const catchAsync = require('../utils/catchAsync');
const {
  insertData,
  getAllData,
  selectEntry,
  deleteAllData,
  updateEntry,
} = require('./databaseActions');

/////////////////////////////////////////////////////////////////

exports.createUser = catchAsync(async (req, res, next) => {
  const data = await insertData(req.body, 'users');
  console.log(data);
  res.status(200).json({ status: 'success', data: req.body });
});

exports.getDataUsers = catchAsync(async (req, res, next) => {
  const data = await getAllData('users', req.query);
  res.status(200).json({ status: 'success', data });
});

exports.getUserData = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  const user = await selectEntry('select', 'users', 'id', userId);
  res.status(200).json({ status: 'success', data: user });
});

exports.deleteAllUsers = catchAsync(async (req, res, next) => {
  deleteAllData('users');
  res.status(204).json({ status: 'success' });
});
exports.deleteUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  await selectEntry('delete', 'users', 'id', userId);
  res.status(204).json({ status: 'success' });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  await updateEntry('users', req.body, 'id', userId);
  // await db.none('UPDATE users SET active = $1 WHERE id = $2', [true, 123]);
  res.status(200).json({ status: 'success' });
});
