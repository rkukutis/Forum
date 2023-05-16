const catchAsync = require('../routes/utils/catchAsync');

exports.getAllPosts = catchAsync(async (req, res, next) => {});

exports.createPost = catchAsync(async (req, res, next) => {
  console.log('Hello from the backend');
  res.status(200).json({ status: 'success', message: req.body });
});

exports.getPost = catchAsync(async (req, res, next) => {});
exports.updatePost = catchAsync(async (req, res, next) => {});
exports.deletePost = catchAsync(async (req, res, next) => {});
