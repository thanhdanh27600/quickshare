import { Prisma } from '@prisma/client';
import prisma from 'db/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import requestIp from 'request-ip';
import { LIMIT_RECENT_HISTORY, PLATFORM_AUTH } from 'types/constants';
import { Stats } from 'types/stats';
import { errorHandler } from 'utils/axios';
import { decryptS, encryptS } from 'utils/crypto';
import { parseIntSafe } from 'utils/number';
import { withQueryCursor } from 'utils/requests';
import HttpStatusCode from 'utils/statusCode';
import { validateStatsSchema } from 'utils/validateMiddleware';
import { z } from 'zod';

export const handler = async (req: NextApiRequest, res: NextApiResponse<Stats>) => {
  try {
    require('utils/loggerServer').info(req);
    const ip = requestIp.getClientIp(req) as string;
    if (req.method !== 'GET') {
      return res.status(HttpStatusCode.METHOD_NOT_ALLOWED).json({ errorMessage: 'Method Not Allowed' });
    }
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
        urlForwardMeta: {
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
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json(error.issues);
    }
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ errorMessage: (error as any).message || 'Something when wrong.' });
  }
};

export * as verify from './verify';
