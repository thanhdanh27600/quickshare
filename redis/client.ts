import { Redis, RedisOptions } from 'ioredis';
import { isProduction } from 'types/constants';

const redisConfig = {
  host: '127.0.0.1',
  password: process.env.REDIS_AUTH,
  port: '6379',
};

export function createRedisInstance(config = redisConfig) {
  try {
    const options: RedisOptions = {
      host: config.host,
      db: isProduction ? 'cache' : undefined,
      lazyConnect: true,
      showFriendlyErrorStack: true,
      retryStrategy: (times: number) => {
        if (times > 3) {
          throw new Error(`[Redis] Could not connect after ${times} attempts`);
        }

        return Math.min(times * 200, 1000);
      },
    };

    if (config.port) {
      options.port = +config.port;
    }

    if (config.password) {
      options.password = config.password;
    }

    const redis = new Redis(options);

    redis.on('error', (error: unknown) => {
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

export const redis = createRedisInstance();
