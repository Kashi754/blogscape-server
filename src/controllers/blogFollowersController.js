const asyncHandler = require('express-async-handler');

const BlogFollowersModel = require('../models/BlogFollowersModel');

const userId = 'a007ec9f-5f75-419f-8369-5ab37d7e99e6';

exports.changeFollowingStatus = asyncHandler(async (req, res) => {
  const { blogIds, following } = req.body;

  if (!blogIds || following === undefined) {
    return res.status(400).send('Both blogIds and following are required');
  }

  let response;

  if (following) {
    try {
      response = await BlogFollowersModel.followBlog(userId, blogIds);
    } catch (err) {
      if (err.status) {
        return res.status(err.status).send(err.message);
      }
      res.status(409).send('One or more blogs already followed');
    }
  } else {
    response = await BlogFollowersModel.unFollowBlog(userId, blogIds);
  }

  res.send(response);
});
