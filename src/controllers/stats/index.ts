import { Prisma, UrlShortenerHistory, UrlShortenerRecord } from '@prisma/client';
import requestIp from 'request-ip';
import prisma from '../../services/db/prisma';
import { shortenService } from '../../services/shorten';
import { LIMIT_RECENT_HISTORY } from '../../types/constants';
import { Stats } from '../../types/stats';
import { api, errorHandler, successHandler } from '../../utils/axios';
import { decryptS } from '../../utils/crypto';
import { parseIntSafe } from '../../utils/number';
import { withQueryCursor } from '../../utils/requests';
import { validateStatsSchema } from '../../utils/validateMiddleware';

export const handler = api<Stats>(
  async (req, res) => {
    const ip = requestIp.getClientIp(req) as string;
    await validateStatsSchema.parseAsync({
      query: { ...req.query, ip },
    });
    const hash = req.query.h as string;
    const queryCursor = req.query.qc ? parseIntSafe(req.query.qc as string) : undefined;
    const notShowBot = (req.query.noBot as string) === 'true';
    let record;
    let history: (UrlShortenerHistory & { UrlShortenerRecord: UrlShortenerRecord }) | null = null;
    if (!hash) {
      // get recent with ip
      record = await prisma.urlShortenerRecord.findFirst({
        where: {
          ...(req.session?.user?.email ? { User: { email: req.session?.user?.email } } : { ip }),
        },
        include: {
          history: {
            select: { hash: true, url: true },
            orderBy: {
              createdAt: Prisma.SortOrder.desc,
            },
            take: LIMIT_RECENT_HISTORY,
          },
        },
      });
      return successHandler(res, { record: record });
    }
    // get stats with hash
    history = (await shortenService.getUniqueShortenHistory(hash, {
      UrlForwardMeta: {
        ...(notShowBot ? { where: { fromClientSide: true } } : null),
        orderBy: {
          updatedAt: Prisma.SortOrder.desc,
        },
        ...withQueryCursor(queryCursor),
      },
      _count: true,
      UrlShortenerRecord: true,
    })) as any;

    if (history && history?.password) {
      let valid = false;
      const token = req.headers['X-Platform-Auth'.toLowerCase()] as string;
      if (decryptS(token) === history.id.toString()) {
        valid = true;
      }
      if (!valid) {
        return errorHandler(res);
      }
    }
    // hide sensitive data
    // if (history?.email) history.email = '';
    if (history?.password) history.password = '';
    return successHandler(res, { record: history?.UrlShortenerRecord, history: history ? [history] : null });
  },
  ['GET'],
);

export * as geo from './geo';
