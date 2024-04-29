const express = require('express');

const meRouter = express.Router();
const meController = require('../../controllers/meController');
const blogsController = require('../../controllers/blogsController');
const blogFollowersController = require('../../controllers/blogFollowersController');
const postsController = require('../../controllers/postsController');

meRouter.put('/profile', meController.meUpdateProfile);

meRouter.put('/social-media', meController.meUpdateSocials);

meRouter.get('/blog', blogsController.meBlogGet);

meRouter.put('/blog', blogsController.blogUpdate);

meRouter.get('/following', blogsController.getFollowedBlogs);

meRouter.put('/following', blogFollowersController.changeFollowingStatus);

meRouter.get('/posts', postsController.mePostsList);

meRouter.put('/password', meController.meUpdatePassword);

module.exports = meRouter;
