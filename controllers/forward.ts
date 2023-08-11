import geoIp from 'geoip-country';
import { NextApiRequest, NextApiResponse } from 'next';
import { allowCors } from '../api/axios';
import prisma from '../db/prisma';
import { redis } from '../redis/client';
import { LIMIT_SHORTENED_SECOND, REDIS_KEY, getRedisKey } from '../types/constants';
import { Forward } from '../types/forward';
import { logger } from '../utils/logger';
import HttpStatusCode from '../utils/statusCode';

export const handler = allowCors(async (req: NextApiRequest, res: NextApiResponse<Forward>) => {
  try {
    require('utils/loggerServer').info(req);
    if (req.method !== 'POST') {
      return res.status(HttpStatusCode.METHOD_NOT_ALLOWED).json({ errorMessage: 'Method Not Allowed' });
    }
    const hash = req.body.hash as string;
    const userAgent = req.body.userAgent as string;
    const ip = req.body.ip as string;
    const fromClientSide = req.body.fromClientSide as string;
    if (!hash) {
      return res.status(HttpStatusCode.BAD_REQUEST).send({
        errorMessage: 'You have submitted wrong data, please try again',
        errorCode: 'BAD_REQUEST',
      });
    }
    let lookupIp;
    if (ip) {
      lookupIp = geoIp.lookup(ip);
    }

    if (!lookupIp) {
      logger.warn(!ip ? 'ip not found' : `geoIp cannot determined ${ip}`);
    }
    const data = { hash, ip, userAgent, fromClientSide, lookupIp };
    const hashShortenedLinkKey = getRedisKey(REDIS_KEY.HASH_SHORTEN_BY_HASHED_URL, hash);
    const shortenedUrlCache = await redis.hget(hashShortenedLinkKey, 'url');
    if (shortenedUrlCache) {
      // RabbitMQService.publish({
      //   type: MessageType.FORWARD,
      //   data,
      // });

      // cache hit
      console.log('cache hit');
      postProcessForward(data);
      return res.status(HttpStatusCode.OK).json({ history: { url: shortenedUrlCache } as any });
    }
    // cache missed
    console.log('cache missed');
    await postProcessForward(data, res);
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ errorMessage: (error as any).message || 'Something when wrong.' });
  }
});

export const postProcessForward = async (payload: any, res?: NextApiResponse<Forward>) => {
  const { hash, ip, userAgent, fromClientSide, lookupIp } = payload;
  let history = await prisma.urlShortenerHistory.findUnique({
    where: {
      hash,
    },
  });

  if (!history) {
    await prisma.$disconnect();
    return res
      ? res.status(HttpStatusCode.BAD_REQUEST).send({
          errorMessage: 'No URL was found',
          errorCode: 'BAD_REQUEST',
        })
      : null;
  }

  await prisma.urlForwardMeta.upsert({
    where: {
      userAgent_ip_urlShortenerHistoryId: {
        ip,
        userAgent,
        urlShortenerHistoryId: history.id,
      },
    },
    update: {
      countryCode: lookupIp?.country,
      fromClientSide: !!fromClientSide,
    },
    create: {
      ip,
      userAgent,
      urlShortenerHistoryId: history.id,
      countryCode: lookupIp?.country,
      fromClientSide: !!fromClientSide,
    },
  });
  await prisma.$disconnect();

  if (res) {
    // write back to cache
    const hashShortenedLinkKey = getRedisKey(REDIS_KEY.HASH_SHORTEN_BY_HASHED_URL, hash);
    const dataHashShortenLink = ['url', history.url, 'updatedAt', new Date().getTime()];
    await redis.hset(hashShortenedLinkKey, dataHashShortenLink);
    await redis.expire(hashShortenedLinkKey, LIMIT_SHORTENED_SECOND);
    return res.status(HttpStatusCode.OK).json({ history });
  }
};
