const knex = require('../database');
const { RateLimiterPostgres } = require('rate-limiter-flexible');

const maxWrongAttemptsByIPperDay = 100;
const maxConsecutiveFailsByUsernameAndIP = 10;

const limiterSlowBruteByIP = new RateLimiterPostgres({
  storeClient: knex,
  storeType: 'knex',
  keyPrefix: 'login_fail_ip_per_day',
  points: maxWrongAttemptsByIPperDay,
  duration: 60 * 60 * 24, // 1 day
  blockDuration: 60 * 60 * 24, // Block for 1day, if 100 wrong attempts per day
});

const limiterConsecutiveFailsByUsernameAndIP = new RateLimiterPostgres({
  storeClient: knex,
  storeType: 'knex',
  keyPrefix: 'login_fail_consecutive_username_and_ip',
  points: maxConsecutiveFailsByUsernameAndIP,
  duration: 60 * 60 * 24 * 90, // Store number for 90 days since first fail
  blockDuration: 60 * 60, // Block for 1 hour
});

const getUsernameIPkey = (username, ip) => `${username}_${ip}`;

const limitLoginRequests = async (req, res, next) => {
  const ipAddr = req.ip;
  const username = req.body.username;
  const usernameIPkey = getUsernameIPkey(username, ipAddr);

  const [resUsernameAndIP, resSlowByIP] = await Promise.all([
    limiterConsecutiveFailsByUsernameAndIP.get(usernameIPkey),
    limiterSlowBruteByIP.get(ipAddr),
  ]);

  let retrySecs = 0;
  let activatedLimiter;

  // Check if IP or Username + IP is already blocked
  if (
    resSlowByIP !== null &&
    resSlowByIP.consumedPoints > maxWrongAttemptsByIPperDay
  ) {
    retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
    activatedLimiter = 'slowByIp';
  } else if (
    resUsernameAndIP !== null &&
    resUsernameAndIP.consumedPoints > maxConsecutiveFailsByUsernameAndIP
  ) {
    retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1;
    activatedLimiter = 'usernameAndIp';
  }
  if (retrySecs > 0) {
    const limit =
      activatedLimiter === 'slowByIp'
        ? maxWrongAttemptsByIPperDay
        : maxConsecutiveFailsByUsernameAndIP;

    const remaining =
      activatedLimiter === 'slowByIp'
        ? resSlowByIP.remainingPoints
        : resUsernameAndIP.remainingPoints;

    const reset =
      activatedLimiter === 'slowByIp'
        ? new Date(Date.now() + resSlowByIP.msBeforeNext)
        : new Date(Date.now() + resUsernameAndIP.msBeforeNext);

    res.header({
      'Retry-After': retrySecs,
      'X-RateLimit-Limit': limit,
      'X-RateLimit-Remaining': remaining,
      'X-RateLimit-Reset': reset,
    });

    res.status(400).send('Too many Requests');
  }
};

module.exports = {
  getUsernameIPkey,
  limitLoginRequests,
  limiterConsecutiveFailsByUsernameAndIP,
  limiterSlowBruteByIP,
};
