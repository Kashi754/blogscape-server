const asyncHandler = require('express-async-handler');

const BlogModel = require('../models/BlogModel');

exports.blogList = asyncHandler(async (req, res, next) => {
  const { beforeDate, beforeId, limit } = req.query;

  const userId = 'a007ec9f-5f75-419f-8369-5ab37d7e99e6';
  const blogs = await BlogModel.list(userId, beforeDate, beforeId, limit);

  res.send(blogs);
});

exports.blogSearch = asyncHandler(async (req, res, next) => {
  const { q: query, beforeRank, beforeId, limit } = req.query;
  const userId = 'a007ec9f-5f75-419f-8369-5ab37d7e99e6';
  const blogs = await BlogModel.search(
    userId,
    query,
    beforeRank,
    beforeId,
    limit
  );

  if (blogs.length === 0) {
    const suggestions = await BlogModel.getSuggestions(query);
    res.status(404).send(suggestions);
  } else {
    res.send(blogs);
  }
});

exports.blogUpdate = asyncHandler(async (req, res, next) => {
  const userId = 'a007ec9f-5f75-419f-8369-5ab37d7e99e6';

  const updatedBlog = await BlogModel.update(userId, req.body);
  res.send(updatedBlog);
});

exports.blogPopularList = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: blog popular list route');
});

exports.blogIdGet = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: blog id get route');
});
