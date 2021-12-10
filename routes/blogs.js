const express = require('express');
const Blogs = require('../models/Blog');
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const router = express.Router();

// @desc        For showing add page
router.get('/add', ensureAuth, (req, res) => {
  res.render('blogs/add');
});

// @desc        For getting the data of add blog
router.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Blogs.create(req.body);
    req.flash('success_msg', 'Blog has been added successfully.');
    res.redirect('/index/dashboard');
  } catch (err) {
    res.render('error/500');
    console.log(err);
  }
});

// @desc        For rendering public blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blogs.find({ status: 'Public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean();
    res.render('blogs/index', {
      blogs,
    });
  } catch (err) {
    console.log(err);
  }
});

// @desc        For showing user blogs
router.get('/user/:id', async (req, res) => {
  const blogs = await Blogs.find({ status: 'Public', user: req.params.id })
    .populate('user')
    .sort({ createdAt: 'desc' })
    .lean();

  if (!blogs) {
    return res.render('error/404');
  } else {
    res.render('blogs/index', {
      blogs,
    });
  }
});

// @desc        For showing edit page
router.get('/edit/:id', ensureAuth, async (req, res) => {
  const blog = await Blogs.findById(req.params.id).lean();

  if (!blog) {
    res.render('error/404');
  }

  if (blog.user != req.user.id) {
    res.redirect('/');
  } else {
    res.render('blogs/edit', {
      blog,
    });
  }
});

// @desc        For showing single blog
router.get('/:id', async (req, res) => {
  let blog = await Blogs.findById(req.params.id).populate('user').lean();

  if (!blog) {
    return res.render('error/404');
  } else {
    res.render('blogs/show', {
      blog,
    });
  }
});

// @desc        For updating blog
router.put('/:id', ensureAuth, async (req, res) => {
  let blog = await Blogs.findById(req.params.id).lean();

  if (!blog) {
    return res.render('error/404');
  }

  if (blog.user != req.user.id) {
    res.redirect('/');
  } else {
    blogs = await Blogs.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });
    req.flash('success_msg', 'Your blog has been updated.');
    res.redirect('/index/dashboard');
  }
});

// @desc        For deleting blog
router.delete('/:id', ensureAuth, async (req, res) => {
  await Blogs.findByIdAndDelete(req.params.id);
  req.flash('error_msg', 'Your blog has been deleted.');
  res.redirect('/index/dashboard');
});

// @desc        For filtering blog
router.post('/filter', async (req, res) => {
  const search = req.body.search;
  let blogs = await Blogs.find({ title: { $regex: search, $options: '$i' } })
    .populate('user')
    .sort({ createdAt: 'desc' })
    .lean();
  res.render('blogs/filter', {
    blogs,
  });
});

module.exports = router;
