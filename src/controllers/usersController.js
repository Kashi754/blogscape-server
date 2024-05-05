const asyncHandler = require('express-async-handler');
const UsersModel = require('../models/UsersModel');

exports.usersIdGet = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await UsersModel.findBy({
    column: 'users.id',
    operator: '=',
    value: userId,
  });

  if (user.length === 0) {
    return res.status(404).send(`User with id ${req.params.id} not found`);
  }

  res.send(user[0]);
});

exports.meGetProfile = asyncHandler(async (req, res) => {
  const user = await UsersModel.findBy({
    column: 'users.id',
    operator: '=',
    value: req.user.id,
  });

  res.send(user[0]);
});

exports.meUpdateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const updatedProfile = await UsersModel.update(userId, req.body);

  res.send(updatedProfile);
});

exports.meUpdatePassword = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: users update password route');
});
