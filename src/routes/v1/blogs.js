const express = require('express');

const blogsRouter = express.Router();
const { blogsController } = require('../../controllers');

blogsRouter.get('/', blogsController.blogList);

blogsRouter.get('/search', blogsController.blogSearch);

blogsRouter.get('/popular', blogsController.getPopularBlogs);

blogsRouter.get('/random', blogsController.blogRandomGet);

blogsRouter.get('/:id', blogsController.blogIdGet);

module.exports = blogsRouter;
