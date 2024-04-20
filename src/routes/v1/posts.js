const express = require('express');

const postsRouter = express.Router();
const postsController = require('../../controllers/postsController');

postsRouter.get('/', postsController.postsList);

postsRouter.post('/', postsController.postsCreatePost);

postsRouter.get('/:id', postsController.postsIdGet);

postsRouter.get('/:id/comments', postsController.postsCommentsList);

postsRouter.post('/:id/comments', postsController.postsCommentPost);

module.exports = postsRouter;
