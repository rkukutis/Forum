const path = require('path');
const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('./catchAsync');
const AppError = require('./appError');
const { updateEntry } = require('../database/databaseActions');

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
  console.log(req.file);
  if (!req.file) return next(new AppError('Please select an image'));

  const imagePath = `./img/users/user_${req.user.id}.jpg`;
  await sharp(req.file.buffer)
    .resize(200, 200)
    .toFile(imagePath, (err) => err && next(new AppError(err)));

  await updateEntry(
    'users',
    { image: `user_${req.user.id}.jpg` },
    'id',
    req.user.id
  );

  res.status(200).json({ status: 'ok', message: 'Image uploaded' });
});
