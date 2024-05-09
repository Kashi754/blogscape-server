const express = require('express');

const blogsRouter = express.Router();
const { blogsController } = require('../../controllers');

blogsRouter.get('/', blogsController.blogList);

blogsRouter.get('/search', blogsController.blogSearch);

blogsRouter.get('/popular', blogsController.getPopularBlogs);

blogsRouter.get('/:id', blogsController.blogIdGet);

blogsRouter.get('/random', blogsController.blogRandomGet);

module.exports = blogsRouter;
