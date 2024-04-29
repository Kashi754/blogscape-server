const asyncHandler = require('express-async-handler');

const BlogModel = require('../models/BlogModel');

const userId = 'a007ec9f-5f75-419f-8369-5ab37d7e99e6';

exports.blogList = asyncHandler(async (req, res) => {
  const { beforeDate, beforeId, limit } = req.query;

  if ((beforeDate && !beforeId) || (!beforeDate && beforeId)) {
    return res.status(400).send('Both beforeDate and beforeId are required');
  }

  const blogs = await BlogModel.list(userId, beforeDate, beforeId, limit);

  res.send(blogs);
});

exports.blogSearch = asyncHandler(async (req, res) => {
  const { q: query, beforeRank, beforeId, limit } = req.query;

  if ((beforeRank && !beforeId) || (!beforeRank && beforeId) || !query) {
    return res.status(400).send('Please provide all required parameters');
  }

  const blogs = await BlogModel.search(
    userId,
    query,
    beforeRank,
    beforeId,
    limit
  );

  if (blogs.length === 0) {
    const suggestions = await BlogModel.getSuggestions(query);
    return res.status(404).send(suggestions);
  }

  res.send(blogs);
});

exports.blogUpdate = asyncHandler(async (req, res) => {
  const updatedBlog = await BlogModel.update(userId, req.body);
  res.send(updatedBlog);
});

exports.blogIdGet = asyncHandler(async (req, res) => {
  const blog = await BlogModel.findBy(userId, {
    column: 'id',
    operator: '=',
    value: req.params.id,
  });

  if (blog.length === 0) {
    return res.status(404).send(`Blog with id ${req.params.id} not found`);
  }

  res.send(blog[0]);
});

exports.meBlogGet = asyncHandler(async (req, res) => {
  const blog = await BlogModel.findBy(userId, {
    column: 'user_id',
    operator: '=',
    value: userId,
  });

  res.send(blog[0]);
});

exports.getFollowedBlogs = asyncHandler(async (req, res) => {
  const blogs = await BlogModel.findBy(userId, {
    column: 'blog_following.user_id',
    type: 'NotNull',
  });

  if (blogs.length === 0) {
    return res.status(404).send('No followed blogs found');
  }

  res.send(blogs);
});

exports.getPopularBlogs = asyncHandler(async (req, res) => {
  const blogs = await BlogModel.listPopular(userId, 10);
  res.send(blogs);
});
