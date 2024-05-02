const {
  RateLimiterPostgres,
  BurstyRateLimiter,
  RateLimiterMemory,
} = require('rate-limiter-flexible');
const knex = require('../database');

const burstyLimiter = new BurstyRateLimiter(
  new RateLimiterPostgres({
    points: 4,
    duration: 1,
    storeClient: knex,
    storeType: 'knex',
    insuranceLimiter: new RateLimiterMemory({
      points: 4,
      duration: 1,
    }),
  }),
  new RateLimiterPostgres({
    keyPrefix: 'burst',
    points: 10,
    duration: 10,
    storeClient: knex,
    storeType: 'knex',
    inMemoryBlockOnConsumed: 5,
    insuranceLimiter: new RateLimiterMemory({
      points: 10,
      duration: 10,
    }),
  })
);

exports.rateLimiterBursty = async (req, res, next) => {
  try {
    const key = req.user.id ? req.user.id : req.ip;
    const pointsToConsume = req.user.id ? 1 : 2;

    const rateLimiterRes = await burstyLimiter.consume(key, pointsToConsume);

    res.header({
      'Retry-After': rateLimiterRes.msBeforeNext / 1000,
      'X-RateLimit-Remaining': rateLimiterRes.remainingPoints,
      'X-RateLimit-Reset': new Date(
        Date.now() + rateLimiterRes.msBeforeNext
      ).toISOString(),
    });

    next();
  } catch (e) {
    console.error(`Too many requests: ${e.message} - ${req.ip}`);
    res.status(429).send('Too many requests');
  }
};
