const catchAsync = require('../utils/catchAsync');
const {
  insertData,
  getAllData,
  selectEntry,
  deleteAllData,
  updateEntry,
} = require('./databaseActions');

exports.createPost = catchAsync(async (req, res, next) => {
  const data = await insertData(req.body, 'posts');
  console.log(data);
  res.status(200).json({ status: 'success', data: req.body });
});

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const data = await getAllData('posts', req.params);
  res.status(200).json({ status: 'success', data });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  const user = await selectEntry('select', 'posts', 'id', userId);
  res.status(200).json({ status: 'success', data: user });
});

exports.deleteAllPosts = catchAsync(async (req, res, next) => {
  deleteAllData('posts');
  res.status(204).json({ status: 'success' });
});
exports.deletePost = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  await selectEntry('delete', 'posts', 'id', userId);
  res.status(204).json({ status: 'success' });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  await updateEntry('posts', req.body, 'id', userId);
  // await db.none('UPDATE users SET active = $1 WHERE id = $2', [true, 123]);
  res.status(200).json({ status: 'success' });
});
