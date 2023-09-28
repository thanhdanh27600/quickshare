import { Prisma } from '@prisma/client';
import requestIp from 'request-ip';
import prisma from '../../services/db/prisma';
import { LIMIT_RECENT_HISTORY } from '../../types/constants';
import { Stats, UrlHistoryWithMeta } from '../../types/stats';
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
    let record;
    let history;
    if (!hash) {
      // get recent with ip
      record = await prisma.urlShortenerRecord.findFirst({
        where: { ip },
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
      history = record?.history as UrlHistoryWithMeta[];
      return successHandler(res, { record: record, history });
    }
    // get stats with hash
    history = await prisma.urlShortenerHistory.findUnique({
      where: {
        hash,
      },
      include: {
        UrlForwardMeta: {
          orderBy: {
            updatedAt: Prisma.SortOrder.desc,
          },
          ...withQueryCursor(queryCursor),
        },
        _count: true,
        UrlShortenerRecord: true,
      },
    });
    if (history && history?.password) {
      const token = req.headers['X-Platform-Auth'.toLowerCase()] as string;
      if (!token || decryptS(token) !== history.id.toString()) {
        return errorHandler(res);
      }
    }
    // hide sensitive data
    if (history?.email) history.email = '';
    if (history?.password) history.password = '';
    return successHandler(res, { record: history?.UrlShortenerRecord, history: history ? [history] : null });
  },
  ['GET'],
);
