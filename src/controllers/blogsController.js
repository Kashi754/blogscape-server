const asyncHandler = require('express-async-handler');

const BlogModel = require('../models/BlogModel');

exports.blogList = asyncHandler(async (req, res, next) => {
  // const query = req.query;
  // const searchParams = query.q.split(',') || null;
  // const afterParams = {
  //   afterDate: query.afterDate,
  //   afterId: query.afterId
  // };
  // const blogs = await BlogModel.search(
  //   searchParams,
  //   req.user ? req.user.id : null
  // );
  const userId = 'df751170-1d53-46ca-89b6-b549fd62e0eb';
  const blogs = await BlogModel.list(userId);

  res.send(blogs);
});

exports.blogPopularList = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: blog popular list route');
});

exports.blogIdGet = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: blog id get route');
});
