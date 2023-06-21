const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.createUser);
router.post('/login', authController.login);
router.use(authController.protect, authController.restrictTo('admin'));
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
