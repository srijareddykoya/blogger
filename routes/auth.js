const express = require('express');
const router = express.Router();
const passport = require('passport');

// @desc    Auth with google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// @desc    Google auth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/index/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    req.flash(
      'success_msg',
      'You have signed in successfully. Welcome to the blogIT.'
    );
    res.redirect('/index/dashboard');
  }
);

// @desc    For signning out
router.get('/signout', (req, res) => {
  req.logOut();
  req.flash('success_msg', 'You have signed out successfully. Come back soon!');
  res.redirect('/index/login');
});

module.exports = router;
