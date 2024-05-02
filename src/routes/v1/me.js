const express = require('express');

const meRouter = express.Router();
const {
  usersController,
  blogsController,
  blogFollowersController,
  postsController,
  socialMediaController,
  meController,
} = require('../../controllers');

meRouter.put('/profile', usersController.meUpdateProfile);

meRouter.put('/social-media', socialMediaController.meUpdateSocials);

meRouter.get('/blog', blogsController.meBlogGet);

meRouter.put('/blog', blogsController.meBlogUpdate);

meRouter.get('/following', blogsController.getFollowedBlogs);

meRouter.put('/following', blogFollowersController.changeFollowingStatus);

meRouter.get('/posts', postsController.mePostsList);

meRouter.put('/password', usersController.meUpdatePassword);

module.exports = meRouter;
