const path = require('path');
const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('./catchAsync');
const AppError = require('./appError');

// Multer setup
const storage = multer.memoryStorage();

const filter = function (file, cb) {
  //Allowed file extensions
  const fileTypes = /jpeg|jpg|png|gif|svg/;

  //check extension names
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) return cb(null, true);
  cb('Please upload images ONLY!');
};

exports.upload = multer({
  storage,
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    filter(file, cb);
  },
});
// TODO: Add proper error handling
// https://github.com/expressjs/multer#error-handling

exports.imageResize = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('Please select an image'));

  const imagePath = `./img/users/user_${req.user.id}.jpg`;
  await sharp(req.file.buffer)
    .resize(200, 200)
    .toFile(imagePath, (err) => err && next(new AppError(err)));

  res.status(200).json({ status: 'ok', message: 'Image uploaded' });
});
