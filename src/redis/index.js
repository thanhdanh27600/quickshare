const { Redis } = require('ioredis');

const redisConfig = {
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_AUTH,
  port: '6379',
};

function createRedisInstance(config = redisConfig) {
  try {
    /** @type {import('ioredis').RedisOptions} */
    const options = {
      host: config.host,
      lazyConnect: true,
      showFriendlyErrorStack: true,
      retryStrategy: (times) => {
        if (times > 3) {
          throw new Error(`[Redis] Could not connect after ${times} attempts`);
        }

        return Math.min(times * 200, 1000);
      },
    };

    if (config.port) {
      options.port = Number(config.port);
    }

    if (config.password) {
      options.password = config.password;
    }

    const redis = new Redis(options);

    redis.on('error', (error) => {
      console.warn('[Redis] error', error);
    });

    redis.on('ready', () => {
      console.log('[Redis] have ready');
    });

    return redis;
  } catch (e) {
    throw new Error(`[Redis] Could not create a Redis instance`);
  }
}

const redis = createRedisInstance();

module.exports = { redis };
