const express = require('express');

const meRouter = express.Router();
const meController = require('../../controllers/meController');

meRouter.put('/profile', meController.meUpdateProfile);

meRouter.put('/social-media', meController.meUpdateSocials);

meRouter.get('/blog', meController.meBlogGet);

meRouter.put('/blog', meController.meUpdateBlog);

meRouter.get('/following', meController.meFollowingList);

meRouter.put('/following', meController.meUpdateFollowing);

meRouter.get('/posts', meController.mePostsList);

meRouter.put('/password', meController.meUpdatePassword);

module.exports = meRouter;
