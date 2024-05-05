const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { authUser } = require('./src/config/passport');
const config = require('./src/config/environment');
const { rateLimiterBursty } = require('./src/middleware/rateLimiterBursty');
const app = express();
const { knexSession } = require('./src/config/session');
const PORT = config.port || 5000;

if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('common'));
}

app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT'],
    credentials: true,
    optionsSuccessStatus: 200,
    preflightContinue: false,
  })
);

// Passport Config
app.use(knexSession);
app.use(passport.initialize());
app.use(passport.session());

app.use(rateLimiterBursty);

passport.use(new LocalStrategy(authUser));

app.use(express.json());

app.use('/api/v1', require('./src/routes/v1/v1Router'));

app.listen(PORT, (error) => {
  if (!error) {
    console.log(config.db.host);
    console.log(`Server is successfully running on PORT: ${PORT}`);
  } else {
    console.log("Error occurred, server can't start", error);
  }
});
