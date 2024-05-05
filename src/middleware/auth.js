exports.checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  console.log(req.user);
  res.status(401).send('Please login');
};

exports.checkLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
    });
    res.clearCookie('user');
    return next();
  }
  next();
};
