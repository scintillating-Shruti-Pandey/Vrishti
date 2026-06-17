const express = require('express');
const { body } = require('express-validator');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// @route   POST /api/auth/register
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/\d/)
      .withMessage('Password must contain a number')
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage('Password must contain a special character'),
  ],
  authController.register
);

// @route   POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  authController.login
);

// @route   GET /api/auth/google
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// @route   GET /api/auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  authController.googleCallback
);

// @route   GET /api/auth/me
router.get('/me', auth, authController.getMe);

// @route   PUT /api/auth/profile
router.put('/profile', auth, authController.updateProfile);

module.exports = router;
