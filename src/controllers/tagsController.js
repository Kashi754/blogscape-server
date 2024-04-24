const asyncHandler = require('express-async-handler');

exports.tagsList = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: tags list route');
});

exports.tagsCreateTag = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: tags create tag route');
});
