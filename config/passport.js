const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID:
          process.env.GOOGLE_CLIENT_ID ||
          '246102249259-4pmgtdblhabv0vmtj76u92hebgmojnrm.apps.googleusercontent.com',
        clientSecret:
          process.env.GOOGLE_CLIENT_SECRET || 'uW-W-fcpfU2PECv4ZzslJdkg',
        callbackURL: '/auth/google/callback',
      },
      async function (accessToken, refreshToken, profile, cb) {
        const newUser = {
          google_id: profile.id,
          displayName: profile.displayName,
          familyName: profile.name.familyName,
          givenName: profile.name.givenName,
          image: profile.photos[0].value,
        };
        try {
          let user = await User.findOne({ google_id: profile.id });
          if (user) {
            return cb(null, user);
          } else {
            user = await User.create(newUser);
            return cb(null, user);
          }
        } catch (err) {
          console.log(err);
        }
      }
    )
  );
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
