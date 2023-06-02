const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.createUser);
router.post('/login', authController.login);
router
  .route('/:id')
  .get(userController.getUserData)
  .delete(userController.deleteUser)
  .patch(userController.updateUser);
router
  .route('/')
  .get(userController.getDataUsers)
  .delete(userController.deleteAllUsers);

module.exports = router;
