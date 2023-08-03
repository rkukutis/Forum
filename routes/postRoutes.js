const express = require('express');
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/:id')
  .get(postController.getPost)
  .delete(authController.restrictToAccountOwner, postController.deletePost)
  .patch(authController.restrictToAccountOwner, postController.updatePost);

// create comment on certain post
router
  .route('/:id/comments')
  .get(commentController.getComments)
  .post(
    authController.protect,
    authController.protect,
    commentController.createComment
  );

router
  .route('/')
  .post(authController.protect, postController.createPost)
  .get(postController.getAllPosts)
  .delete(
    authController.restrictToRole(['admin']),
    postController.deleteAllPosts
  );

module.exports = router;
