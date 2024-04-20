const asyncHandler = require('express-async-handler');

exports.commentsList = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: comments list route');
});

exports.commentsCreateComment = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: comments create comment route');
});
