const asyncHandler = require('express-async-handler');

exports.authLoginPost = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: login route');
});

exports.authRegisterPost = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: register route');
});

exports.authLogoutPost = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: logout route');
});
