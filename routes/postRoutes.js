const express = require('express');
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/:id')
  .get(postController.getPost)
  .delete(postController.deletePost)
  .patch(postController.updatePost);
router
  .route('/')
  .post(authController.protect, postController.createPost)
  .get(postController.getAllPosts)
  .delete(postController.deleteAllPosts);

module.exports = router;
