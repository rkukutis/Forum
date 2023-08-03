const express = require('express');
const { imageResize } = require('../utils/imageResize');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { upload } = require('../utils/imageResize');

const router = express.Router();

router.post(
  '/uploadPhoto',
  authController.protect,
  upload.single('avatar'),
  imageResize
);

router.use(authController.protect);
router
  .route('/')
  .get(userController.getDataUsers)
  .delete(userController.deleteAllUsers);

router
  .route('/:id')
  .get(userController.getUserData)
  .delete(userController.deleteUser)
  .patch(userController.updateUser);

module.exports = router;
