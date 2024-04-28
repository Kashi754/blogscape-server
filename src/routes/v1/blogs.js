const express = require('express');

const blogsRouter = express.Router();
const blogsController = require('../../controllers/blogsController');

blogsRouter.get('/', blogsController.blogList);

blogsRouter.put('/', blogsController.blogUpdate);

blogsRouter.get('/search', blogsController.blogSearch);

blogsRouter.get('/popular', blogsController.blogPopularList);

blogsRouter.get('/:id', blogsController.blogIdGet);

module.exports = blogsRouter;
