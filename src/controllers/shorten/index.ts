import { UrlShortenerRecord } from '@prisma/client';
import requestIp from 'request-ip';
import prisma from '../../db/prisma';
import { shortenCacheService } from '../../services/cacheServices/shorten.service';
import { LIMIT_FEATURE_HOUR, LIMIT_SHORTEN_REQUEST, NUM_CHARACTER_HASH } from '../../types/constants';
import { ShortenUrl } from '../../types/shorten';
import { api, badRequest, successHandler } from '../../utils/axios';
import { decrypt } from '../../utils/crypto';
import HttpStatusCode from '../../utils/statusCode';
import { generateRandomString } from '../../utils/text';
import { validateShortenSchema } from '../../utils/validateMiddleware';

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
      const history = await prisma.urlShortenerHistory.findUnique({ where: { hash } });
      if (!history || !!history.password) {
        return badRequest(res, "No URL was found on your request. Let's shorten one!");
      }
      return successHandler(res, history);
    }
    // check or reset get request limit
    const reachedFeatureLimit = await shortenCacheService.limitFeature(ip);
    if (reachedFeatureLimit) {
      return res.status(HttpStatusCode.TOO_MANY_REQUESTS).send({
        errorMessage: `Exceeded ${LIMIT_SHORTEN_REQUEST} shorten links, please comeback after ${LIMIT_FEATURE_HOUR} hours.`,
        errorCode: 'UNAUTHORIZED',
      });
    }
    shortenCacheService.incLimitIp(ip);

    // generate hash
    let newHash = '';
    let isExist = 1;
    let timesLimit = 0;

    const logger = require('../../utils/loggerServer');
    while (isExist) {
      if (timesLimit > 0) {
        logger.warn('timesLimit shorten occured', timesLimit);
      }
      if (timesLimit++ > 10 /** U better buy lucky ticket */) {
        logger.error('timesLimit shorten reached', timesLimit);
        throw new Error('Bad request after digging our hash, please try again!');
      }
      newHash = generateRandomString(NUM_CHARACTER_HASH);
      isExist = await shortenCacheService.existHash(newHash);
      // also double check db if not collapse in cache
      if (!isExist) {
        isExist = !!(await prisma.urlShortenerHistory.findUnique({ where: { hash: newHash } })) ? 1 : 0;
      }
    }

    // write to db
    let record: UrlShortenerRecord | null = null;
    record = await prisma.urlShortenerRecord.findFirst({ where: { ip } });
    if (!record) {
      record = await prisma.urlShortenerRecord.create({
        data: { ip },
      });
    }
    record = record ?? (await prisma.urlShortenerRecord.findFirst({ where: { ip } }));
    if (!record)
      record = await prisma.urlShortenerRecord.create({
        data: { ip },
      });
    const history = await prisma.urlShortenerHistory.create({
      data: {
        url,
        hash: newHash,
        urlShortenerRecordId: Number(record.id),
      },
    });
    // write hash to cache
    await shortenCacheService.postShortenHash(history);
    return successHandler(res, history);
  },
  ['GET'],
);

export * as update from './update';
