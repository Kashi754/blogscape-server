const asyncHandler = require('express-async-handler');

const PostModel = require('../models/PostModel');

exports.postsList = asyncHandler(async (req, res) => {
  const { blogId, beforeDate, beforeId, limit } = req.query;

  if ((beforeDate && !beforeId) || (!beforeDate && beforeId)) {
    return res.status(400).send('Both beforeDate and beforeId are required');
  }

  const blogIdQuery = blogId ? { blog_id: blogId } : null;

  const posts = await PostModel.list(blogIdQuery, beforeDate, beforeId, limit);

  res.send(posts);
});

exports.postsSearch = asyncHandler(async (req, res) => {
  const { q: query, beforeRank, beforeId, limit } = req.query;

  if ((beforeRank && !beforeId) || (!beforeRank && beforeId) || !query) {
    return res.status(400).send('Please provide all required parameters');
  }

  const posts = await PostModel.search(query, beforeRank, beforeId, limit);

  if (posts.length === 0) {
    const suggestions = await PostModel.getSuggestions(query);
    return res.status(404).send(suggestions);
  }

  res.send(posts);
});

exports.postUpdate = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const updatedPost = await PostModel.update(blogId, postId, req.body);

  res.send(updatedPost);
});

exports.postsIdGet = asyncHandler(async (req, res) => {
  const post = await PostModel.findBy({
    column: 'id',
    operator: '=',
    value: req.params.id,
  });

  if (post.length === 0) {
    return res.status(404).send(`Post with id ${req.params.id} not found`);
  }

  res.send(post[0]);
});

exports.postsRandomGet = asyncHandler(async (req, res) => {
  const postId = await PostModel.randomId();
  res.send(postId);
});

exports.postsCreatePost = asyncHandler(async (req, res) => {
  const blogId = req.user.blogId;
  const newPost = req.body;

  // TODO: parse markdown into plaintext
  req.body.plaintextBody = newPost.body;

  const post = await PostModel.create(blogId, newPost);

  res.send(post);
});

exports.mePostsList = asyncHandler(async (req, res) => {
  const blogId = req.user.blogId;
  const posts = await PostModel.findBy({
    column: 'blog_id',
    operator: '=',
    value: blogId,
  });

  res.send(posts);
});

exports.postsCommentsList = asyncHandler(async (req, res) => {
  res.send('NOT IMPLEMENTED: posts comments list route');
});

exports.postsCommentPost = asyncHandler(async (req, res) => {
  res.send('NOT IMPLEMENTED: posts comment post route');
});
