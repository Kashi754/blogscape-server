const asyncHandler = require('express-async-handler');

const BlogFollowersModel = require('../models/BlogFollowersModel');

exports.changeFollowingStatus = asyncHandler(async (req, res) => {
  const userId = req.user.id;
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
