import { redis } from '../../redis/client';
import {
  LIMIT_FEATURE_SECOND,
  LIMIT_NOTE_REQUEST,
  LIMIT_NOTE_SECOND,
  REDIS_KEY,
  getRedisKey,
} from '../../types/constants';

export class NoteCache {
  async limitFeature(ip: string) {
    // check or reset get request limit
    const curLimit = await this.limitIp(ip);
    if (parseFloat(curLimit) >= LIMIT_NOTE_REQUEST) return true;
    return false;
  }
  async limitIp(ip: string) {
    const keyLimit = getRedisKey(REDIS_KEY.LIMIT_NOTE, ip);

    const ttl = await redis.ttl(keyLimit);
    if (ttl < 0) {
      await redis.set(keyLimit, 0);
      await redis.expire(keyLimit, LIMIT_FEATURE_SECOND);
    }
    const curLimit = (await redis.get(keyLimit)) || '';
    return curLimit;
  }
  async incLimitIp(ip: string) {
    const keyLimit = getRedisKey(REDIS_KEY.LIMIT_NOTE, ip);
    await redis.incr(keyLimit);
  }
  async existHash(hash: string) {
    const hashKey = getRedisKey(REDIS_KEY.MAP_NOTE_BY_HASH, hash);
    return await redis.hexists(hashKey, 'uuid');
  }
  async postNoteHash({ ip, hash, data }: { ip: string; hash: string; data: any[] }) {
    const hashKey = getRedisKey(REDIS_KEY.MAP_NOTE_BY_HASH, hash);
    const keyLimit = getRedisKey(REDIS_KEY.LIMIT_NOTE, ip);

    await Promise.all([redis.hset(hashKey, data), redis.expire(hashKey, LIMIT_NOTE_SECOND), redis.incr(keyLimit)]);
  }
  updateNoteHash(hash: string) {
    const hashKey = getRedisKey(REDIS_KEY.MAP_NOTE_BY_HASH, hash);
    redis.expire(hashKey, -1).then().catch();
  }
}

export const noteCacheService = new NoteCache();
