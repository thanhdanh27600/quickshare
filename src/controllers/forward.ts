import { NextApiResponse } from 'next';
import { isEmpty } from 'ramda';
import prisma from '../db/prisma';
import { redis } from '../redis/client';
import { shortenCacheService } from '../services/cache';
import { REDIS_KEY, getRedisKey } from '../types/constants';
import { Forward, ForwardMeta } from '../types/forward';
import { ipLookup } from '../utils/agent';
import { api, badRequest, successHandler } from '../utils/axios';
import { validateForwardSchema } from '../utils/validateMiddleware';

export const handler = api<Forward>(
  async (req, res) => {
    const hash = req.body.hash as string;
    const userAgent = req.body.userAgent as string;
    const ip = req.body.ip as string;
    const fromClientSide = !!req.body.fromClientSide;

    await validateForwardSchema.parseAsync({
      hash,
      userAgent,
      ip,
      fromClientSide,
    });

    const lookupIp = ipLookup(ip) || undefined;
    const data = { hash, ip, userAgent, fromClientSide, lookupIp };
    const hashKey = getRedisKey(REDIS_KEY.MAP_SHORTEN_BY_HASH, hash);
    const shortenedUrlCache = await redis.hgetall(hashKey);
    if (!isEmpty(shortenedUrlCache)) {
      // cache hit
      postProcessForward(data); // bypass process
      return successHandler(res, { history: shortenedUrlCache });
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
    shortenCacheService.postShortenHash(history);
    return successHandler(res, { history });
  }
};
