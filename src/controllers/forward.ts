import { NextApiResponse } from 'next';
import prisma from '../db/prisma';
import { redis } from '../redis/client';
import { LIMIT_SHORTENED_SECOND, REDIS_KEY, getRedisKey } from '../types/constants';
import { Forward, ForwardMeta } from '../types/forward';
import { ipLookup } from '../utils/agent';
import { api, badRequest } from '../utils/axios';
import HttpStatusCode from '../utils/statusCode';

export const handler = api(
  async (req, res) => {
    const hash = req.body.hash as string;
    const userAgent = req.body.userAgent as string;
    const ip = req.body.ip as string;
    const fromClientSide = !!req.body.fromClientSide;
    if (!hash) return badRequest(res);
    const lookupIp = ipLookup(ip) || undefined;
    const data = { hash, ip, userAgent, fromClientSide, lookupIp };
    const hashKey = getRedisKey(REDIS_KEY.MAP_SHORTEN_BY_HASH, hash);
    const shortenedUrlCache = await redis.hget(hashKey, 'url');
    if (shortenedUrlCache) {
      // cache hit
      postProcessForward(data); // bypass process
      return res.status(HttpStatusCode.OK).json({ history: shortenedUrlCache as any });
    }
    // cache missed
    await postProcessForward(data, res);
  },
  ['POST'],
);

export const postProcessForward = async (payload: ForwardMeta, res?: NextApiResponse<Forward>) => {
  const cacheMissed = !!res;
  const { hash, ip, userAgent, fromClientSide, lookupIp } = payload;
  let history = await prisma.urlShortenerHistory.findUnique({
    where: {
      hash,
    },
  });

  if (!history) {
    return cacheMissed ? badRequest(res) : null;
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
      fromClientSide,
    },
    create: {
      ip,
      userAgent,
      urlShortenerHistoryId: history.id,
      countryCode: lookupIp?.country,
      fromClientSide,
    },
  });

  if (cacheMissed) {
    // write back to cache
    const hashShortenedLinkKey = getRedisKey(REDIS_KEY.MAP_SHORTEN_BY_HASH, hash);
    const dataHashShortenLink = ['url', history.url, 'updatedAt', new Date().getTime()];
    await redis.hset(hashShortenedLinkKey, dataHashShortenLink);
    await redis.expire(hashShortenedLinkKey, LIMIT_SHORTENED_SECOND);
    return res.status(HttpStatusCode.OK).json({ history });
  }
};
