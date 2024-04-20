const asyncHandler = require('express-async-handler');

exports.postsList = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: posts list route');
});

exports.postsCreatePost = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: posts create post route');
});

exports.postsIdGet = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: posts id get route');
});

exports.postsCommentsList = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: posts comments list route');
});

exports.postsCommentPost = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: posts comment post route');
});
