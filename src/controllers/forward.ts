import geoIp from 'geoip-country';
import { NextApiResponse } from 'next';
import { isEmpty } from 'ramda';
import prisma from '../db/prisma';
import { redis } from '../redis/client';
import { LIMIT_SHORTENED_SECOND, REDIS_KEY, getRedisKey } from '../types/constants';
import { Forward } from '../types/forward';
import { api, badRequest } from '../utils/axios';
import { logger } from '../utils/logger';
import HttpStatusCode from '../utils/statusCode';

export const handler = api(
  async (req, res) => {
    const hash = req.body.hash as string;
    const userAgent = req.body.userAgent as string;
    const ip = req.body.ip as string;
    const fromClientSide = req.body.fromClientSide as string;
    if (!hash) {
      return badRequest(res);
    }
    let lookupIp;
    if (ip) {
      lookupIp = geoIp.lookup(ip);
    }

    if (!lookupIp) {
      logger.warn(!ip ? 'ip not found' : `geoIp cannot determined ${ip}`);
    }
    const data = { hash, ip, userAgent, fromClientSide, lookupIp };
    const hashShortenedLinkKey = getRedisKey(REDIS_KEY.HASH_SHORTEN_BY_HASH_URL, hash);
    const shortenedUrlCache = await redis.hgetall(hashShortenedLinkKey);
    if (!isEmpty(shortenedUrlCache)) {
      // cache hit
      postProcessForward(data); // bypass process
      return res.status(HttpStatusCode.OK).json({ history: shortenedUrlCache as any });
    }
    // cache missed
    await postProcessForward(data, res);
  },
  ['POST'],
);

export const postProcessForward = async (payload: any, res?: NextApiResponse<Forward>) => {
  const { hash, ip, userAgent, fromClientSide, lookupIp } = payload;
  let history = await prisma.urlShortenerHistory.findUnique({
    where: {
      hash,
    },
  });

  if (!history) {
    return res ? badRequest(res) : null;
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

  if (res) {
    // write back to cache
    const hashShortenedLinkKey = getRedisKey(REDIS_KEY.HASH_SHORTEN_BY_HASH_URL, hash);
    const dataHashShortenLink = [
      'url',
      history.url,
      'ogTitle',
      history.ogTitle,
      'ogDescription',
      history.ogDescription,
      'updatedAt',
      new Date().getTime(),
    ];
    await redis.hset(hashShortenedLinkKey, dataHashShortenLink);
    await redis.expire(hashShortenedLinkKey, LIMIT_SHORTENED_SECOND);
    return res.status(HttpStatusCode.OK).json({ history });
  }
};
