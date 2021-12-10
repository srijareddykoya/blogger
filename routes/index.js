const express = require('express');
const Blogs = require('../models/Blog');
const Contact = require('../models/Contact');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');

// @desc      For showing login page
router.get('/login', ensureGuest, (req, res) => {
  res.render('login', {
    layout: 'login',
  });
});

// @desc      For showing dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const blogs = await Blogs.find({ user: req.user.id }).lean();
    res.render('dashboard', {
      name: req.user.displayName,
      blogs,
    });
  } catch (err) {
    req.flash('error_msg', 'Signup to view dashboard.');
    res.redirect('/index/login');
  }
});

// @desc      For showing contact page
router.get('/contact', async (req, res) => {
  res.render('contact');
});

// @desc      For getting contact page data
router.post('/contact', async (req, res) => {
  try {
    await Contact.create(req.body);
    req.flash(
      'success_msg',
      'Your contact and concern have been sucessfully submitted.'
    );
    res.redirect('/');
  } catch (err) {
    res.render('error/404');
  }
});

module.exports = router;
