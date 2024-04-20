const express = require('express');

const usersRouter = express.Router();
const usersController = require('../../controllers/usersController');

usersRouter.get('/:id', usersController.usersIdGet);

module.exports = usersRouter;
