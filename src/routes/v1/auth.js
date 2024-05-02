const express = require('express');
const passport = require('passport');

const authRouter = express.Router();
const { authSchema } = require('../../validation/schema');
const { authController } = require('../../controllers');
const { checkAuthenticated, checkLoggedIn } = require('../../middleware/auth');

authRouter.post(
  '/login',
  [
    checkLoggedIn,
    checkSchema(authSchema.login, ['body']),
    passport.authenticate('local', { session: true, failWithError: true }),
  ],
  authController.authLoginPost,
  authController.authLoginFail
);

authRouter.post(
  '/register',
  [checkSchema(authSchema.registration, ['body']), checkLoggedIn],
  authController.authRegisterPost
);

authRouter.post('/logout', checkAuthenticated, authController.authLogoutPost);

module.exports = authRouter;
