const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signup', userController.createUser);
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
