exports.checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).send('Please login');
};

exports.checkLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/home');
  }
  next();
};
