import prisma from '../../db/prisma';
import { redis } from '../../redis/client';
import { REDIS_KEY, getRedisKey } from '../../types/constants';
import { Locale } from '../../types/locale';
import { ShortenUrl } from '../../types/shorten';
import { api, badRequest, successHandler } from '../../utils/axios';
import { validateUpdateShortenSchema } from '../../utils/validateMiddleware';

export const handler = api<ShortenUrl>(
  async (req, res) => {
    let hash = req.body.hash as string;
    let locale = req.body.locale as string;
    let ogTitle = req.body.ogTitle as string;
    let ogDescription = req.body.ogDescription as string;
    await validateUpdateShortenSchema.parseAsync({
      hash,
      locale,
      ogTitle,
      ogDescription,
    });
    const history = await prisma.urlShortenerHistory.findUnique({ where: { hash } });
    if (!history) return badRequest(res, "No URL was found on your request. Let's shorten one!");
    const rs = await prisma.urlShortenerHistory.update({
      where: { id: history.id },
      data: {
        ogTitle,
        ogDescription,
      },
    });
    const ogKey = getRedisKey(REDIS_KEY.OG_BY_HASH, `${hash}-${locale || Locale.Vietnamese}`);
    const hashShortenedLinkKey = getRedisKey(REDIS_KEY.HASH_SHORTEN_BY_HASH_URL, hash);
    await Promise.all([redis.expire(ogKey, -1), redis.expire(hashShortenedLinkKey, -1)]);
    return successHandler(res, rs);
  },
  ['PUT'],
);
