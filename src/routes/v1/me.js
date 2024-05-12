const express = require('express');

const meRouter = express.Router();
const {
  usersController,
  blogsController,
  blogFollowersController,
  postsController,
  socialMediaController,
} = require('../../controllers');
meRouter.get('/profile', usersController.meGetProfile);

meRouter.put('/profile', usersController.meUpdateProfile);

meRouter.put('/social-media', socialMediaController.meUpdateSocials);

meRouter.get('/blog', blogsController.meBlogGet);

meRouter.put('/blog', blogsController.meBlogUpdate);

meRouter.get('/following', blogsController.getFollowedBlogs);

meRouter.put('/following', blogFollowersController.changeFollowingStatus);

meRouter.get('/posts', postsController.postsList);

meRouter.put('/password', usersController.meUpdatePassword);

module.exports = meRouter;
