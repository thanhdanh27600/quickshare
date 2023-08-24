import { UrlShortenerRecord } from '@prisma/client';
import requestIp from 'request-ip';
import prisma from '../db/prisma';
import { redis } from '../redis/client';
import {
  LIMIT_SHORTENED_SECOND,
  LIMIT_URL_HOUR,
  LIMIT_URL_REQUEST,
  LIMIT_URL_SECOND,
  NUM_CHARACTER_HASH,
  REDIS_KEY,
  getRedisKey,
} from '../types/constants';
import { ShortenUrl } from '../types/shorten';
import { api, badRequest, successHandler } from '../utils/axios';
import { decrypt } from '../utils/crypto';
import HttpStatusCode from '../utils/statusCode';
import { generateRandomString } from '../utils/text';
import { validateShortenSchema } from '../utils/validateMiddleware';

export const handler = api<ShortenUrl>(
  async (req, res) => {
    const ip = requestIp.getClientIp(req) || '';
    let url = (req.query.url as string) || null;
    let hash = (req.query.hash as string) || null;
    await validateShortenSchema.parseAsync({
      query: { url, hash, ip },
    });
    url = decrypt(decodeURI(url || ''));
    if (!url && !hash) {
      return res.status(HttpStatusCode.BAD_REQUEST).send({
        errorMessage: 'Wrong shorten format, please try again',
        errorCode: 'INVALID_URL',
      });
    }
    // if hash then retrieve from cache & db
    if (hash) {
      const keyHash = getRedisKey(REDIS_KEY.HASH_SHORTEN_BY_HASHED_URL, hash);
      let url = await redis.hget(keyHash, 'url');
      if (!url) {
        url = (await prisma.urlShortenerHistory.findFirst({ where: { hash } }))?.url || '';
      }
      if (url) return successHandler(res, { url, hash });
      return badRequest(res, "No URL was found on your request. Let's shorten one!");
    }
    // check or reset get request limit
    const keyLimit = getRedisKey(REDIS_KEY.HASH_LIMIT, ip);
    const ttl = await redis.ttl(keyLimit);
    if (ttl < 0) {
      await redis.set(keyLimit, 0);
      await redis.expire(keyLimit, LIMIT_URL_SECOND);
    }
    const curLimit = (await redis.get(keyLimit)) || '';
    if (parseFloat(curLimit) >= LIMIT_URL_REQUEST) {
      return res.status(HttpStatusCode.TOO_MANY_REQUESTS).send({
        errorMessage: `Exceeded ${LIMIT_URL_REQUEST} shorten links, please comeback after ${LIMIT_URL_HOUR} hours.`,
        errorCode: 'UNAUTHORIZED',
      });
    }
    // generate hash
    else {
      // check hash collapse
      let targetHash = '';
      let hashShortenedLinkKey = '';
      let isExist = 1;
      let timesLimit = 0;
      // regenerate if collapse
      while (isExist) {
        timesLimit > 0 && console.log('timesLimit', timesLimit);
        if (timesLimit++ > 10 /** U better buy lucky ticket */) {
          throw new Error('Bad URL after digging our hash, please try again!');
        }
        targetHash = generateRandomString(NUM_CHARACTER_HASH);
        hashShortenedLinkKey = getRedisKey(REDIS_KEY.HASH_SHORTEN_BY_HASHED_URL, targetHash);
        isExist = await redis.hexists(hashShortenedLinkKey, 'url');
        // also check db if not collapse in cache
        if (!isExist) {
          isExist = !!(await prisma.urlShortenerHistory.findFirst({ where: { hash: targetHash } })) ? 1 : 0;
        }
      }
      // write hash to cache, increment limit
      const dataHashShortenLink = ['url', url, 'updatedAt', new Date().getTime()];
      await redis.hset(hashShortenedLinkKey, dataHashShortenLink);
      await redis.expire(hashShortenedLinkKey, LIMIT_SHORTENED_SECOND);
      await redis.incr(keyLimit);
      const keyHash = getRedisKey(REDIS_KEY.HASH_HISTORY_BY_ID, ip);
      let record: UrlShortenerRecord | null = null;
      // retrive client id and write to db
      let clientCacheId = await redis.hget(keyHash, 'dbId');
      if (!clientCacheId) {
        // cache missed
        const clientDb = await prisma.urlShortenerRecord.findFirst({
          where: {
            ip,
          },
        });
        if (!clientDb) {
          // new client's ip
          record = await prisma.urlShortenerRecord.findFirst({
            where: { ip },
          });
          if (!record) {
            record = await prisma.urlShortenerRecord.create({
              data: { ip },
            });
          }
          clientCacheId = record.id + '';
        } else {
          // cache hit
          clientCacheId = clientDb.id + '';
        }
      }
      const dataHashClient = ['lastUrl', url, 'lastHash', targetHash, 'dbId', clientCacheId];
      await redis.hset(keyHash, dataHashClient);
      record = record ?? (await prisma.urlShortenerRecord.findFirst({ where: { ip } }));
      if (!record)
        record = await prisma.urlShortenerRecord.create({
          data: { ip },
        });
      const history = await prisma.urlShortenerHistory.create({
        data: {
          url,
          hash: targetHash,
          urlShortenerRecordId: +record.id,
        },
      });
      console.log('history', history);
      return successHandler(res, { url, hash: targetHash });
    }
  },
  ['GET'],
);
