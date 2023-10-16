import requestIp from 'request-ip';
import prisma from '../../services/db/prisma';
import { shortenService } from '../../services/shorten';
import { HASH } from '../../types/constants';
import { StatsGeo } from '../../types/stats';
import { api, badRequest, successHandler } from '../../utils/axios';
import { validateStatsSchema } from '../../utils/validateMiddleware';

export const handler = api<StatsGeo>(
  async (req, res) => {
    const ip = requestIp.getClientIp(req) as string;
    await validateStatsSchema.parseAsync({
      query: { ...req.query, ip },
    });
    const hash = req.query.h as string;
    if (!hash || hash.trim().length < HASH.Length) {
      return badRequest(res, "No URL was found on your request. Let's shorten one!");
    }

    let history;

    history = await shortenService.getUniqueShortenHistory(hash);
    if (!history) return badRequest(res, "No URL was found on your request. Let's shorten one!");

    // get stats with hash
    history = await prisma.urlForwardMeta.groupBy({
      by: ['countryCode'],
      where: {
        urlShortenerHistoryId: history.id,
      },
      _count: { countryCode: true },
    });

    return successHandler(res, { history });
  },
  ['GET'],
);
