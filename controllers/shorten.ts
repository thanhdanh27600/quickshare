import type { NextApiRequest, NextApiResponse } from 'next';
import requestIp from 'request-ip';
import { z } from 'zod';
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
import { decrypt } from '../utils/crypto';
import HttpStatusCode from '../utils/statusCode';
import { generateRandomString, isValidUrl } from '../utils/text';
import { validateShortenSchema } from '../utils/validateMiddleware';

export const handler = async (req: NextApiRequest, res: NextApiResponse<ShortenUrl>) => {
  try {
    require('../utils/loggerServer').info(req);
    if (req.method !== 'GET') {
      return res.status(HttpStatusCode.METHOD_NOT_ALLOWED).json({ errorMessage: 'Method Not Allowed' });
    }
    const ip = requestIp.getClientIp(req) || '';
    let url = req.query.url as string;
    await validateShortenSchema.parseAsync({
      query: { url, ip },
    });
    url = decrypt(decodeURI(url));
    if (!isValidUrl(url)) {
      return res.status(HttpStatusCode.BAD_REQUEST).send({
        errorMessage: 'Wrong URL format, please try again',
        errorCode: 'INVALID_URL',
      });
    }
    // check or reset get link limit
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
          throw new Error('Bad URL, please try again');
        }
        targetHash = generateRandomString(NUM_CHARACTER_HASH);
        hashShortenedLinkKey = getRedisKey(REDIS_KEY.HASH_SHORTEN_BY_HASHED_URL, targetHash);
        isExist = await redis.hexists(hashShortenedLinkKey, 'url');
      }
      // write hash to cache, increment limit
      const dataHashShortenLink = ['url', url, 'updatedAt', new Date().getTime()];
      await redis.hset(hashShortenedLinkKey, dataHashShortenLink);
      await redis.expire(hashShortenedLinkKey, LIMIT_SHORTENED_SECOND);
      await redis.incr(keyLimit);
      const keyHash = getRedisKey(REDIS_KEY.HASH_HISTORY_BY_ID, ip);
      // retrive client id and write to db
      let clientRedisId = await redis.hget(keyHash, 'dbId');
      if (!clientRedisId) {
        // cache missed
        const clientDb = await prisma.urlShortenerRecord.findFirst({
          where: {
            ip,
          },
        });
        if (!clientDb) {
          // new client's ip
          let record = await prisma.urlShortenerRecord.findFirst({
            where: { ip },
          });
          if (!record) {
            record = await prisma.urlShortenerRecord.create({
              data: { ip },
            });
          }
          clientRedisId = record.id + '';
        } else {
          // cache hit
          clientRedisId = clientDb.id + '';
        }
      }
      const dataHashClient = ['lastUrl', url, 'lastHash', targetHash, 'dbId', clientRedisId];
      await redis.hset(keyHash, dataHashClient);
      const history = await prisma.urlShortenerHistory.create({
        data: {
          url,
          hash: targetHash,
          urlShortenerRecordId: +clientRedisId!,
        },
      });
      console.log('history', history);
      return res.status(HttpStatusCode.OK).json({ url, hash: targetHash });
    }
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return res.status(HttpStatusCode.BAD_REQUEST).json(error.issues);
    }
    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ errorMessage: (error as any).message || 'Something when wrong.' });
  }
};
