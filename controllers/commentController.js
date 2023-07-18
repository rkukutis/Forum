const catchAsync = require('../utils/catchAsync');
const databaseActions = require('../database/databaseActions');
const AppError = require('../utils/appError');

exports.createComment = catchAsync(async (req, res, next) => {
  const comment = {
    post_id: req.params.id,
    body: req.body.body,
    user_id: req.user.id,
  };

  const createdComment = await databaseActions.insertData(comment, 'comments');
  res.status(200).json({ status: 'success', data: createdComment });
});

exports.getComments = catchAsync(async (req, res, next) => {
  const comments = await databaseActions.selectComments(
    req.params.id,
    req.query
  );
  res.status(200).json({ status: 'success', data: comments });
});
