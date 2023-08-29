import { Prisma } from '@prisma/client';
import requestIp from 'request-ip';
import prisma from '../../db/prisma';
import { LIMIT_RECENT_HISTORY, PLATFORM_AUTH } from '../../types/constants';
import { Stats } from '../../types/stats';
import { api, errorHandler } from '../../utils/axios';
import { decryptS, encryptS } from '../../utils/crypto';
import { parseIntSafe } from '../../utils/number';
import { withQueryCursor } from '../../utils/requests';
import HttpStatusCode from '../../utils/statusCode';
import { validateStatsSchema } from '../../utils/validateMiddleware';

export const handler = api<Stats>(
  async (req, res) => {
    const ip = requestIp.getClientIp(req) as string;
    await validateStatsSchema.parseAsync({
      query: { ...req.query, ip },
    });
    const hash = req.query.h as string;
    const email = req.query.e as string;
    const password = req.query.p as string;
    const token = req.headers['X-Platform-Auth'.toLowerCase()] as string;
    const queryCursor = req.query.qc ? parseIntSafe(req.query.qc as string) : undefined;
    let record;
    let history;
    if (!hash) {
      // get recent with ip
      record = await prisma.urlShortenerRecord.findFirst({
        where: { ip },
        include: {
          history: {
            orderBy: {
              createdAt: Prisma.SortOrder.desc,
            },
            take: LIMIT_RECENT_HISTORY,
          },
        },
      });
      history = record?.history;
      return res.status(HttpStatusCode.OK).json({ record: record, history });
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
      if (!token || decryptS(token) !== history.id.toString()) {
        return errorHandler(res);
      }
    }
    if (password && history && !history?.password) {
      // set password
      if (PLATFORM_AUTH) {
        const encryptPassword = encryptS(password);
        await prisma.urlShortenerHistory.update({
          where: { hash },
          data: {
            password: encryptPassword,
            email,
          },
        });
      }
    }
    // hide sensitive data
    if (history?.email) history.email = '';
    if (history?.password) history.password = '';
    return res
      .status(HttpStatusCode.OK)
      .json({ record: history?.UrlShortenerRecord, history: history ? [history] : null });
  },
  ['GET'],
);

export * as verify from './verify';
