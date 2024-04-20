const express = require('express');

const authRouter = express.Router();
const authController = require('../../controllers/authController');

authRouter.post('/login', authController.authLoginPost);

authRouter.post('/register', authController.authRegisterPost);

authRouter.post('/logout', authController.authLogoutPost);

module.exports = authRouter;
