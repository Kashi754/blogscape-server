const passport = require('passport');
const bcrypt = require('bcrypt');
const authController = require('../controllers/authController');

exports.authUser = async (username, password, done) => {
  // TODO: Fetch user from database
  const user = await authController.getUserAuth(username);

  if (!user) {
    return done(null, false);
  }

  const matchedPassword = await bcrypt.compare(password, user.passwordHash);

  if (!matchedPassword) {
    return done(null, false);
  }

  delete user.passwordHash;

  return done(null, user);
};

passport.serializeUser((user, done) => {
  process.nextTick(() => {
    return done(null, user);
  });
});

passport.deserializeUser((user, done) => {
  process.nextTick(() => {
    return done(null, user);
  });
});
