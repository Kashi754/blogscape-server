const express = require('express');

const postsRouter = express.Router();
const { postsController, commentsController } = require('../../controllers');

postsRouter.get('/', postsController.postsList);

postsRouter.post('/', postsController.postsCreatePost);

postsRouter.get('/search', postsController.postsSearch);

postsRouter.get('/:id', postsController.postsIdGet);

postsRouter.put('/:id', postsController.postUpdate);

postsRouter.get('/:id/comments', commentsController.commentsList);

postsRouter.post('/:id/comments', commentsController.createComment);

postsRouter.get('/random', postsController.postsRandomGet);

module.exports = postsRouter;
