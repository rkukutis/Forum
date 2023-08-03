const catchAsync = require('../utils/catchAsync');
const databaseActions = require('../database/databaseActions');

exports.createComment = catchAsync(async (req, res, next) => {
  const comment = {
    post_id: req.params.id,
    body: req.body.body,
    user_id: req.user.id,
  };

  const createdComment = await databaseActions.insertData(comment, 'comments');

  // This is pretty inefficient
  // Get post that the comment is created on
  const post = await databaseActions.selectPost(
    'select',
    'posts',
    'id',
    comment.post_id
  );
  // increment post comment number by 1
  await databaseActions.updateEntry('posts', {
    comment_number: post.comment_number + 1,
  });

  res.status(200).json({ status: 'success', data: createdComment });
});

exports.getComments = catchAsync(async (req, res, next) => {
  const comments = await databaseActions.selectComments(
    req.params.id,
    req.query
  );
  res.status(200).json({ status: 'success', data: comments });
});
