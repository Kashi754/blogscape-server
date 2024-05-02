const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const UsersModel = require('../models/UsersModel');
const {
  limiterConsecutiveFailsByUsernameAndIP,
  limiterSlowBruteByIP,
  getUsernameIPkey,
} = require('../middleware/rateLimiterLogin');

exports.authLoginPost = asyncHandler(async (req, res) => {
  const usernameIPkey = getUsernameIPkey(req.body.username, req.ip);
  const resUsernameAndIP =
    await limiterConsecutiveFailsByUsernameAndIP.get(usernameIPkey);

  if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > 0) {
    // Reset on successful authorization
    await limiterConsecutiveFailsByUsernameAndIP.delete(usernameIPkey);
  }

  res.status(200).send(req.user);
});

exports.authLoginFail = async (err, req, res, next) => {
  try {
    const promises = [limiterSlowBruteByIP.consume(req.ip)];
    const user = await UsersModel.getUserLogin(req.body.username);
    if (user) {
      promises.push(limiterConsecutiveFailsByUsernameAndIP.consume(req.ip));
    }
    await Promise.all(promises);
    return res.status(401).send('Invalid username or password');
  } catch (rlRejected) {
    if (rlRejected instanceof Error) {
      return next(rlRejected);
    } else {
      res.header({
        'Retry-After': String(Math.round(rlRejected.msBeforeNext / 1000)) || 1,
      });
      return res.status(429).send('Too many login attempts');
    }
  }
};

exports.authRegisterPost = asyncHandler(async (req, res, next) => {
  const loginData = req.body;

  const SALT_ROUNDS = 10;
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(loginData.password, salt);
  loginData.password_hash = hash;
  delete loginData.password;

  const user = await UsersModel.create(req.body);

  if (!user) {
    return res
      .status(400)
      .send('User with that username or email already exists');
  }

  res.status(201).send();
});

exports.authLogoutPost = (req, res, next) => {
  req.logout();
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.clearCookie('connect.sid');
    res.status(201).send();
  });
};

exports.getUserAuth = (username) => {
  const user = UsersModel.getUserLogin(username);

  return user;
};
