import { redis } from '../../redis/client';
import { LIMIT_SHORTENED_SECOND, LIMIT_URL_SECOND, REDIS_KEY, getRedisKey } from '../../types/constants';

export class ShortenCache {
  async limitIp(ip: string) {
    const keyLimit = getRedisKey(REDIS_KEY.LIMIT_SHORTEN, ip);

    const ttl = await redis.ttl(keyLimit);
    if (ttl < 0) {
      await redis.set(keyLimit, 0);
      await redis.expire(keyLimit, LIMIT_URL_SECOND);
    }
    const curLimit = (await redis.get(keyLimit)) || '';
    return curLimit;
  }
  async incLimitIp(ip: string) {
    const keyLimit = getRedisKey(REDIS_KEY.LIMIT_SHORTEN, ip);
    await redis.incr(keyLimit);
  }
  async existHash(hash: string) {
    const hashShortenedLinkKey = getRedisKey(REDIS_KEY.HASH_SHORTEN_BY_HASH_URL, hash);
    return await redis.hexists(hashShortenedLinkKey, 'url');
  }
  async postShortenHash({ ip, hash, data }: { ip: string; hash: string; data: any[] }) {
    const hashShortenedLinkKey = getRedisKey(REDIS_KEY.HASH_SHORTEN_BY_HASH_URL, hash);
    const keyLimit = getRedisKey(REDIS_KEY.LIMIT_SHORTEN, ip);

    await Promise.all([
      redis.hset(hashShortenedLinkKey, data),
      redis.expire(hashShortenedLinkKey, LIMIT_SHORTENED_SECOND),
      redis.incr(keyLimit),
    ]);
  }

  updateShortenHash(hash: string) {
    const hashShortenedLinkKey = getRedisKey(REDIS_KEY.HASH_SHORTEN_BY_HASH_URL, hash);
    redis.expire(hashShortenedLinkKey, -1).then().catch();
  }
}

export const shortenCacheService = new ShortenCache();
