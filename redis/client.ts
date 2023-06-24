import { createClient, RedisClientOptions } from 'redis';
import { isProduction } from 'types/constants';

export function createRedisInstance() {
  try {
    const options: RedisClientOptions = {
      url: isProduction ? `redis://default:${process.env.REDIS_AUTH}@cache:6379` : undefined,
      password: process.env.REDIS_AUTH,
    };

    const client = createClient(options);

    client.on('error', (error: unknown) => {
      console.warn('[Redis] has error', error);
    });
    return client;
  } catch (e) {
    throw new Error(`Could not create Redis instance`);
  }
}

export const redis = createRedisInstance();
