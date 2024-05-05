const config = require('./environment');
const knex = require('../database');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const knexStore = new KnexSessionStore({
  knex,
  tablename: 'sessions',
  createtable: false,
});

const maxAge = 1000 * 60 * 60 * 24 * 2; // 2 days

const SessionCookie =
  config.env === 'development'
    ? {
        secure: false,
        sameSite: 'lax',
        maxAge: maxAge,
        httpOnly: true,
      }
    : {
        secure: true,
        sameSite: 'none',
        maxAge: maxAge,
        httpOnly: true,
      };

module.exports.knexSession = session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: knexStore,
  cookie: SessionCookie,
});

module.exports.maxAge = maxAge;
