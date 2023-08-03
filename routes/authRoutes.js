const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.createUser);
router.post('/confirmSignup/:code', authController.confirmSignup);
router.post('/login', authController.login);
router.post('/checkUser', authController.protect, authController.confirmAuth);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword', authController.resetPassword);

module.exports = router;
