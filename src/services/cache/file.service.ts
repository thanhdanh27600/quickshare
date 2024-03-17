import { redis } from '../../redis';
import {
  LIMIT_FEATURE_SECOND,
  LIMIT_FILE_REQUEST,
  LIMIT_FILE_SECOND,
  REDIS_KEY,
  getRedisKey,
} from '../../types/constants';

export class FileCache {
  async limitFeature(ip: string) {
    // check or reset get request limit
    const curLimit = await this.limitIp(ip);
    if (parseFloat(curLimit) >= LIMIT_FILE_REQUEST) return true;
    return false;
  }
  async limitIp(ip: string) {
    const keyLimit = getRedisKey(REDIS_KEY.LIMIT_FILE, ip);

    const ttl = await redis.ttl(keyLimit);
    if (ttl < 0) {
      await redis.set(keyLimit, 0);
      await redis.expire(keyLimit, LIMIT_FEATURE_SECOND);
    }
    const curLimit = (await redis.get(keyLimit)) || '';
    return curLimit;
  }
  async incLimitIp(ip: string) {
    const keyLimit = getRedisKey(REDIS_KEY.LIMIT_FILE, ip);
    await redis.incr(keyLimit);
  }
  async postFileHash({ hash, data }: { hash: string; data: any[] }) {
    const hashKey = getRedisKey(REDIS_KEY.MAP_FILE_BY_HASH, hash);

    await Promise.all([redis.hset(hashKey, data), redis.expire(hashKey, LIMIT_FILE_SECOND)]);
  }
  purgeFileHash(hash: string) {
    const hashKey = getRedisKey(REDIS_KEY.MAP_FILE_BY_HASH, hash);
    redis.expire(hashKey, -1).then().catch();
  }
}

export const fileCacheService = new FileCache();
