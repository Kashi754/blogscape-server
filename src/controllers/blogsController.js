const asyncHandler = require('express-async-handler');

const BlogModel = require('../models/BlogModel');
const PostModel = require('../models/PostModel');

exports.blogList = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { beforeDate, beforeId, limit } = req.query;

  if ((beforeDate && !beforeId) || (!beforeDate && beforeId)) {
    return res.status(400).send('Both beforeDate and beforeId are required');
  }

  const blogs = await BlogModel.list(userId, beforeDate, beforeId, limit);

  res.send(blogs);
});

exports.blogSearch = asyncHandler(async (req, res) => {
  const userId = req.user.id;
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

exports.meBlogUpdate = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const updatedBlog = await BlogModel.update(userId, req.body);
  res.send(updatedBlog);
});

exports.blogIdGet = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const blogResults = await BlogModel.findBy(userId, {
    column: 'id',
    operator: '=',
    value: req.params.id,
  });

  if (blogResults.length === 0) {
    return res.status(404).send(`Blog with id ${req.params.id} not found`);
  }

  const blog = blogResults[0];

  res.send(blog);
});

exports.meBlogGet = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const blogResults = await BlogModel.findBy(userId, {
    column: 'fts_blog.user_id',
    operator: '=',
    value: userId,
  });

  const blog = blogResults[0];

  res.send(blog);
});

exports.blogRandomGet = asyncHandler(async (req, res) => {
  const blogId = await BlogModel.randomId();
  res.send(blogId);
});

exports.getFollowedBlogs = asyncHandler(async (req, res) => {
  const userId = req.user.id;
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
  const userId = req.user.id;
  const blogs = await BlogModel.listPopular(userId, 10);
  res.send(blogs);
});
