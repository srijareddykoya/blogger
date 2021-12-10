module.exports = {
  ensureAuth: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      req.flash('error_msg', 'Signup to view this resource.');
      res.redirect('/index/login');
    }
  },
  ensureGuest: (req, res, next) => {
    if (req.isAuthenticated()) {
      req.flash('warning_msg', 'You need to sign out to view signup page.');
      res.redirect('back');
    } else {
      return next();
    }
  },
};
