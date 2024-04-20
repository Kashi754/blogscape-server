const express = require('express');

const v1Router = express.Router();

v1Router.use('/auth', require('./auth'));
v1Router.use('/blogs', require('./blogs'));
v1Router.use('/users', require('./users'));
v1Router.use('/me', require('./me'));
v1Router.use('/posts', require('./posts'));
v1Router.use('/tags', require('./tags'));
v1Router.get('/secret', (req, res) => {
  const imageKit = new ImageKit({
    publicKey: 'public_iILFPVBo5QbfK+36qOvA8VwUEzk=',
    privateKey: 'private_sJZIRCeXbZhjCPoTcFYloIhq6PY=',
    urlEndpoint: 'https://ik.imagekit.io/blogscape',
  });

  const authenticationParameters = imageKit.getAuthenticationParameters();
  console.log(authenticationParameters);
  res.send(authenticationParameters);
});
v1Router.get('/health', (_req, res) => {
  res.sendStatus(200);
});
v1Router.use('/*', (_req, res) => {
  res.sendStatus(404);
});

module.exports = v1Router;
