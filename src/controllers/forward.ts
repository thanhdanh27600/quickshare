import { isEmpty } from 'ramda';
import prisma from '../db/prisma';
import { redis } from '../redis/client';
import { shortenCacheService } from '../services/cache';
import { sendMessageToQueue } from '../services/queue';
import { REDIS_KEY, getRedisKey } from '../types/constants';
import { Forward } from '../types/forward';
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
      sendMessageToQueue(JSON.stringify({ type: 'forward', payload: data }));
      return successHandler(res, { history: shortenedUrlCache });
    }
    // cache missed write back to cache
    const history = await prisma.urlShortenerHistory.findUnique({
      where: {
        hash,
      },
    });
    if (!history) {
      return badRequest(res);
    }
    sendMessageToQueue(JSON.stringify({ type: 'forward', payload: data }));
    shortenCacheService.postShortenHash(history);
    return successHandler(res, { history });
  },
  ['POST'],
);
