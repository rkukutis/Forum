const slugify = require('slugify');
const catchAsync = require('../utils/catchAsync');
const databaseActions = require('../database/databaseActions');

exports.createPost = catchAsync(async (req, res, next) => {
  // req.body.slug = slugify(req.body.title) || 'defaultSlug';
  const post = {
    title: req.body.title,
    slug: slugify(req.body.title),
    body: req.body.body,
    user_id: req.user.id,
  };

  const createdPost = await databaseActions.insertData(post, 'posts');
  res.status(200).json({ status: 'success', data: createdPost });
});

exports.getAllPosts = catchAsync(async (req, res, next) => {
  // console.log(req.query);
  const data = await databaseActions.selectPosts(req.query);
  res.status(200).json({ status: 'success', data });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
  const post = await databaseActions.selectPost(
    'select',
    'posts',
    'id',
    postId
  );
  res.status(200).json({ status: 'success', data: post });
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
