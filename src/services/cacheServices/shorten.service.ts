import { redis } from '../../redis/client';
import {
  LIMIT_FEATURE_SECOND,
  LIMIT_SHORTENED_SECOND,
  LIMIT_SHORTEN_REQUEST,
  REDIS_KEY,
  getRedisKey,
} from '../../types/constants';

export class ShortenCache {
  async limitFeature(ip: string) {
    // check or reset get request limit
    const curLimit = await this.limitIp(ip);
    if (parseFloat(curLimit) >= LIMIT_SHORTEN_REQUEST) return true;
    return false;
  }
  async limitIp(ip: string) {
    const keyLimit = getRedisKey(REDIS_KEY.LIMIT_SHORTEN, ip);

    const ttl = await redis.ttl(keyLimit);
    if (ttl < 0) {
      await redis.set(keyLimit, 0);
      await redis.expire(keyLimit, LIMIT_FEATURE_SECOND);
    }
    const curLimit = (await redis.get(keyLimit)) || '';
    return curLimit;
  }
  async incLimitIp(ip: string) {
    const keyLimit = getRedisKey(REDIS_KEY.LIMIT_SHORTEN, ip);
    await redis.incr(keyLimit);
  }
  async existHash(hash: string) {
    const hashKey = getRedisKey(REDIS_KEY.MAP_SHORTEN_BY_HASH, hash);
    return await redis.hexists(hashKey, 'url');
  }
  async postShortenHash({ ip, hash, data }: { ip: string; hash: string; data: any[] }) {
    const hashKey = getRedisKey(REDIS_KEY.MAP_SHORTEN_BY_HASH, hash);
    const keyLimit = getRedisKey(REDIS_KEY.LIMIT_SHORTEN, ip);

    await Promise.all([redis.hset(hashKey, data), redis.expire(hashKey, LIMIT_SHORTENED_SECOND), redis.incr(keyLimit)]);
  }

  updateShortenHash(hash: string) {
    const hashKey = getRedisKey(REDIS_KEY.MAP_SHORTEN_BY_HASH, hash);
    redis.expire(hashKey, -1).then().catch();
  }
}

export const shortenCacheService = new ShortenCache();
