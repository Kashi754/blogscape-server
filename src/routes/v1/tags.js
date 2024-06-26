const express = require('express');

const tagsRouter = express.Router();
const { tagsController } = require('../../controllers');

tagsRouter.get('/', tagsController.tagsList);

tagsRouter.post('/', tagsController.tagsCreateTag);

module.exports = tagsRouter;
