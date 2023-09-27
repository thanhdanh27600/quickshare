import { UrlShortenerRecord } from '@prisma/client';
import axios from 'axios';
import requestIp from 'request-ip';
import prisma from '../../db/prisma';
import { shortenCacheService } from '../../services/cache/shorten.service';
import { generateHash } from '../../services/hash';
import { shortenService } from '../../services/shorten';
import { ShortenUrl } from '../../types/shorten';
import { api, badRequest, successHandler } from '../../utils/axios';
import { decrypt, decryptS } from '../../utils/crypto';
import { extractBaseUrl, extractOgMetaTags } from '../../utils/dom';
import HttpStatusCode from '../../utils/statusCode';
import { validateShortenSchema } from '../../utils/validateMiddleware';

const messageNotFound = "No URL was found on your request. Let's shorten one!";

export const handler = api<ShortenUrl>(
  async (req, res) => {
    const ip = requestIp.getClientIp(req) || '';
    let url = (req.query.url as string) || null;
    url = decrypt(decodeURI(url || ''));
    let hash = (req.query.hash as string) || null;

    if (!url && !hash) {
      return res.status(HttpStatusCode.BAD_REQUEST).send({
        errorMessage: 'Wrong shorten format, please try again',
        errorCode: 'INVALID_URL',
      });
    }
    await validateShortenSchema.parseAsync({
      query: { url: url || null, hash, ip },
    });

    // if hash then retrieve from cache & db
    if (hash) {
      const history = await shortenService.getShortenHistory(hash);
      if (!history) return badRequest(res, messageNotFound);
      if (!!history.password) {
        const token = req.headers['X-Platform-Auth'.toLowerCase()] as string;
        console.log('decryptS(token', decryptS(token));
        if (!token || decryptS(token) !== history.id.toString()) {
          return badRequest(res, messageNotFound);
        }
      }
      return successHandler(res, history);
    }
    // check or reset get request limit
    const reachedFeatureLimit = await shortenCacheService.limitFeature(ip);
    if (reachedFeatureLimit) {
      return res.status(HttpStatusCode.TOO_MANY_REQUESTS).send({
        errorMessage: 'EXCEEDED_SHORT',
        errorCode: 'UNAUTHORIZED',
      });
    }
    shortenCacheService.incLimitIp(ip);

    // create shorten url
    const shortHash = await generateHash('shorten');

    // extract og metas
    let htmlString = '';
    try {
      htmlString = (await axios.get(url)).data;
    } catch (error) {}

    const baseUrl = extractBaseUrl(url);
    const socialMetaTags = extractOgMetaTags(htmlString, baseUrl);

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
        ogTitle: socialMetaTags.title,
        ogDescription: socialMetaTags.description,
        ogImgSrc: socialMetaTags.image,
        hash: shortHash,
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
