const catchAsync = require('../utils/catchAsync');
const databaseActions = require('../database/databaseActions');

exports.createPost = catchAsync(async (req, res, next) => {
  const post = {
    title: req.title,
    body: req.body,
    user_id: req.user.id,
  };
  await databaseActions.insertData(req.body, 'posts');
  res.status(200).json({ status: 'success', data: post });
});

exports.getAllPosts = catchAsync(async (req, res, next) => {
  console.log(req.query);
  const data = await databaseActions.getAllData('posts', req.query);
  res.status(200).json({ status: 'success', data });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  const user = await databaseActions.selectEntry(
    'select',
    'posts',
    'id',
    userId
  );
  res.status(200).json({ status: 'success', data: user });
});

exports.deleteAllPosts = catchAsync(async (req, res, next) => {
  databaseActions.deleteAllData('posts');
  res.status(204).json({ status: 'success' });
});
exports.deletePost = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  await databaseActions.selectEntry('delete', 'posts', 'id', userId);
  res.status(204).json({ status: 'success' });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  await databaseActions.updateEntry('posts', req.body, 'id', userId);
  // await db.none('UPDATE users SET active = $1 WHERE id = $2', [true, 123]);
  res.status(200).json({ status: 'success' });
});
