import prisma from 'db/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { redis } from 'redis/client';
import requestIp from 'request-ip';
import { LIMIT_URL_HOUR, LIMIT_URL_NUMBER, LIMIT_URL_SECOND, NUM_CHARACTER_HASH, REDIS_KEY } from 'types/constants';
import { ShortenUrl } from 'types/shorten';
import { decrypt } from 'utils/crypto';
import HttpStatusCode from 'utils/statusCode';
import { generateRandomString, isValidUrl } from 'utils/text';

export const handler = async (req: NextApiRequest, res: NextApiResponse<ShortenUrl>) => {
  try {
    require('utils/loggerServer').info(req);
    const ip = requestIp.getClientIp(req);
    let url = req.query.url as string;
    // TODO: ZOD
    if (!url || !ip) {
      return res.status(HttpStatusCode.BAD_REQUEST).send({
        errorMessage: 'You have submitted wrong data, please try again',
        errorCode: 'BAD_REQUEST',
      });
    }
    url = decrypt(decodeURI(url));
    if (!url || !isValidUrl(url)) {
      return res.status(HttpStatusCode.BAD_REQUEST).send({
        errorMessage: 'Wrong URL format, please try again',
        errorCode: 'INVALID_URL',
      });
    }
    // check or reset get link limit
    await redis.connect();
    const keyLimit = `${REDIS_KEY.HASH_LIMIT}:${ip}`;
    const ttl = await redis.ttl(keyLimit);
    if (ttl < 0) {
      await redis.set(keyLimit, 0);
      await redis.expire(keyLimit, LIMIT_URL_SECOND);
    }
    const curLimit = (await redis.get(keyLimit)) || '';
    if (parseFloat(curLimit) >= LIMIT_URL_NUMBER) {
      await redis.quit();
      return res.status(HttpStatusCode.TOO_MANY_REQUESTS).send({
        errorMessage: `Exceeded ${LIMIT_URL_NUMBER} shorten links, please comeback after ${LIMIT_URL_HOUR} hours.`,
        errorCode: 'UNAUTHORIZED',
      });
    } else {
      // check hash collapse
      let targetHash = generateRandomString(NUM_CHARACTER_HASH);
      let hashShortenedLinkKey = `${REDIS_KEY.HASH_SHORTEN_BY_HASHED_URL}:${targetHash}`;
      let isExist = await redis.HEXISTS(hashShortenedLinkKey, 'createdAt');
      let timesLimit = 0;
      // regenerate if collapse
      while (isExist) {
        console.log('timesLimit', timesLimit);
        if (timesLimit++ > 10 /** U better buy lucky ticket */) {
          throw new Error('Bad URL, please try again');
        }
        targetHash = generateRandomString(NUM_CHARACTER_HASH);
        hashShortenedLinkKey = `${REDIS_KEY.HASH_SHORTEN_BY_HASHED_URL}:${targetHash}`;
        isExist = await redis.HEXISTS(hashShortenedLinkKey, 'createdAt');
      }
      // write hash to cache, increment limit
      const dataHashShortenLink = ['createdAt', new Date().getTime(), 'count', '0'];
      await redis.hSet(hashShortenedLinkKey, dataHashShortenLink);
      await redis.incr(keyLimit);
      const keyHash = `${REDIS_KEY.HASH_HISTORY_BY_ID}:${ip}`;
      // retrive client id and write to db
      let clientRedisId = await redis.hGet(keyHash, 'dbId');
      if (!clientRedisId) {
        const clientDb = await prisma.urlShortenerRecord.findFirst({
          where: {
            ip,
          },
        });
        if (!clientDb) {
          // maybe cache were down...
          const record = await prisma.urlShortenerRecord.create({
            data: { ip },
          });
          clientRedisId = record.id + '';
        } else {
          clientRedisId = clientDb.id + '';
        }
      }
      const dataHashClient = ['lastUrl', url, 'lastHash', targetHash, 'dbId', clientRedisId];
      await redis.hSet(keyHash, dataHashClient);
      const history = await prisma.urlShortenerHistory.create({
        data: {
          url,
          hash: targetHash,
          urlShortenerRecordId: +clientRedisId!,
        },
      });
      await redis.quit();
      return res.status(HttpStatusCode.OK).json({ url, hash: targetHash });
    }
  } catch (error) {
    console.error(error);
    await redis.quit();
    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ errorMessage: (error as any).message || 'Something when wrong.' });
  }
};
