const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router();

router
  .route('/:id')
  .get(postController.getPost)
  .delete(postController.deletePost)
  .patch(postController.updatePost);
router
  .route('/')
  .post(postController.createPost)
  .get(postController.getAllPosts)
  .delete(postController.deleteAllPosts);

module.exports = router;
