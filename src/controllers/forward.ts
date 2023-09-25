import { isEmpty } from 'ramda';
import { redis } from '../redis/client';
import { shortenCacheService } from '../services/cache';
import { forwardCacheService } from '../services/cache/forward.service';
import { sendMessageToQueue } from '../services/queue/sendMessage';
import { shortenService } from '../services/shorten';
import { LIMIT_FORWARD_HOUR, LIMIT_FORWARD_REQUEST, REDIS_KEY, getRedisKey } from '../types/constants';
import { Forward, ForwardMeta } from '../types/forward';
import { ipLookup } from '../utils/agent';
import { api, badRequest, successHandler } from '../utils/axios';
import HttpStatusCode from '../utils/statusCode';
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

    const reachedFeatureLimit = await forwardCacheService.limitFeature(ip);
    if (reachedFeatureLimit) {
      return res.status(HttpStatusCode.TOO_MANY_REQUESTS).send({
        errorMessage: `Exceeded ${LIMIT_FORWARD_REQUEST} forwards, please comeback after ${
          LIMIT_FORWARD_HOUR * 60
        } minutes.`,
        errorCode: 'UNAUTHORIZED',
      });
    }
    forwardCacheService.incLimitIp(ip);

    const lookupIp = ipLookup(ip) || undefined;
    const data: ForwardMeta = {
      hash,
      ip,
      userAgent,
      fromClientSide,
      countryCode: lookupIp?.country || '',
      updatedAt: new Date(),
    };
    const hashKey = getRedisKey(REDIS_KEY.MAP_SHORTEN_BY_HASH, hash);
    const shortenedUrlCache = await redis.hgetall(hashKey);
    if (!isEmpty(shortenedUrlCache)) {
      // cache hit
      sendMessageToQueue([{ subject: 'forward', body: data }]);
      return successHandler(res, { history: shortenedUrlCache });
    }
    // cache missed write back to cache
    const history = await shortenService.getShortenHistory(hash);
    if (!history) {
      return badRequest(res);
    }
    sendMessageToQueue([{ subject: 'forward', body: data }]);
    shortenCacheService.postShortenHash(history);
    return successHandler(res, { history });
  },
  ['POST'],
);
