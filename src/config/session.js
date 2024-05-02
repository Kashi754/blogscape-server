const config = require('./environment');
const knex = require('../database');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const knexStore = new KnexSessionStore({
  knex,
});

const SessionCookie =
  config.env === 'development'
    ? {
        secure: false,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days
        httpOnly: true,
      }
    : {
        secure: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days
        httpOnly: true,
      };

module.exports.default = session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: knexStore,
  cookie: SessionCookie,
});
