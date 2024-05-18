const asyncHandler = require('express-async-handler');
const UsersModel = require('../models/UsersModel');
const bcrypt = require('bcrypt');

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
  const updatedProfile = await UsersModel.updateProfile(userId, req.body);

  res.send(updatedProfile);
});

exports.meUpdatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  // Verify old password
  const oldPasswordHash = await UsersModel.getPasswordHash(userId);

  console.log('oldPasswordHash', oldPasswordHash);
  console.log('oldPassword', oldPassword);

  const matchedPassword = await bcrypt.compare(oldPassword, oldPasswordHash);
  if (!matchedPassword) {
    return res.status(401).send('Incorrect Password');
  }

  // Hash new password
  const SALT_ROUNDS = 10;
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(newPassword, salt);

  if (oldPasswordHash === hash) {
    return res
      .status(400)
      .send('New password must be different from old password');
  }

  // Update password in database
  await UsersModel.update(null, userId, {
    password_hash: hash,
  });

  res.send('Password Successfully Changed');
});
