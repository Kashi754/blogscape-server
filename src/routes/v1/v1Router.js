const express = require('express');
const ImageKit = require('imagekit');
const { checkAuthenticated } = require('../../middleware/auth');
const knex = require('../../database');
const v1Router = express.Router();

const config = require('./../../config/environment');

if (config.env !== 'production') {
  v1Router.post('/reset', (req, res) => {
    knex.migrate.rollback().then(() => {
      knex.migrate.latest().then(() => {
        knex.seed.run().then(() => {
          res.sendStatus(200);
        });
      });
    });
  });
}

v1Router.use('/auth', require('./auth'));
v1Router.use('/blogs', checkAuthenticated, require('./blogs'));
v1Router.use('/users', checkAuthenticated, require('./users'));
v1Router.use('/me', checkAuthenticated, require('./me'));
v1Router.use('/posts', checkAuthenticated, require('./posts'));
v1Router.use('/tags', checkAuthenticated, require('./tags'));
v1Router.get('/secret', checkAuthenticated, (req, res) => {
  const imageKit = new ImageKit({
    publicKey: 'public_iILFPVBo5QbfK+36qOvA8VwUEzk=',
    privateKey: 'private_sJZIRCeXbZhjCPoTcFYloIhq6PY=',
    urlEndpoint: 'https://ik.imagekit.io/blogscape',
  });

  const authenticationParameters = imageKit.getAuthenticationParameters();
  res.send(authenticationParameters);
});
v1Router.get('/health', (_req, res) => {
  res.sendStatus(200);
});
v1Router.use('/*', (_req, res) => {
  res.sendStatus(404);
});

module.exports = v1Router;
