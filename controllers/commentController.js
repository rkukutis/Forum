const catchAsync = require('../utils/catchAsync');
const databaseActions = require('../database/databaseActions');
const AppError = require('../utils/appError');

exports.createComment = catchAsync(async (req, res, next) => {
  // req.body.slug = slugify(req.body.title) || 'defaultSlug';

  const comment = {
    post_id: req.params.id,
    body: req.body.body,
    user_id: req.user.id,
  };

  const createdComment = await databaseActions.insertData(comment, 'comments');
  res.status(200).json({ status: 'success', data: createdComment });
});
