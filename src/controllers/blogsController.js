const asyncHandler = require('express-async-handler');

exports.blogsList = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: blog list route');
});

exports.blogsPopularList = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: blog popular list route');
});

exports.blogsIdGet = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: blog id get route');
});
