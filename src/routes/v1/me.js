const express = require('express');

const meRouter = express.Router();
const usersController = require('../../controllers/usersController');
const blogsController = require('../../controllers/blogsController');
const blogFollowersController = require('../../controllers/blogFollowersController');
const postsController = require('../../controllers/postsController');
const socialMediaController = require('../../controllers/socialMediaController');

meRouter.put('/profile', usersController.meUpdateProfile);

meRouter.put('/social-media', socialMediaController.meUpdateSocials);

meRouter.get('/blog', blogsController.meBlogGet);

meRouter.put('/blog', blogsController.blogUpdate);

meRouter.get('/following', blogsController.getFollowedBlogs);

meRouter.put('/following', blogFollowersController.changeFollowingStatus);

meRouter.get('/posts', postsController.mePostsList);

meRouter.put('/password', usersController.meUpdatePassword);

module.exports = meRouter;
