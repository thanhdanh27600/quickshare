import { Prisma, UrlForwardMeta, UrlShortenerHistory, UrlShortenerRecord } from '@prisma/client';
import CryptoJS from 'crypto-js';
import prisma from 'db/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import requestIp from 'request-ip';
import { Response } from 'types/api';
import { PLATFORM_AUTH } from 'types/constants';
import { parseIntSafe } from 'utils/number';
import { withQueryCursor } from 'utils/requests';
import HttpStatusCode from 'utils/statusCode';
import { validateStatsSchema } from 'utils/validateMiddleware';
import { z } from 'zod';

export type Stats = Response & {
  record?: UrlShortenerRecord | null;
  history?: (UrlShortenerHistory & { urlForwardMeta?: UrlForwardMeta[] })[] | null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Stats>) {
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
    const queryCursor = req.query.qc ? parseIntSafe(req.query.qc as string) : undefined;
    let record;
    let history;
    if (!hash) {
      record = await prisma.urlShortenerRecord.findFirst({
        where: { ip },
        include: {
          history: {
            orderBy: {
              createdAt: Prisma.SortOrder.desc,
            },
            take: 5,
          },
        },
      });
      history = record?.history;
      return res.status(HttpStatusCode.OK).json({ record: record, history });
    } else {
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
      if (password && history && !history?.password) {
        if (PLATFORM_AUTH) {
          const encryptPassword = CryptoJS.AES.encrypt(password, PLATFORM_AUTH).toString();
          await prisma.urlShortenerHistory.update({
            where: { hash },
            data: {
              password: encryptPassword,
              email,
            },
          });
          history.password = encryptPassword;
        }
      }
      // hide recovery email
      if (history?.email) history.email = '';
      return res
        .status(HttpStatusCode.OK)
        .json({ record: history?.UrlShortenerRecord, history: history ? [history] : null });
    }
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json(error.issues);
    }
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ errorMessage: (error as any).message || 'Something when wrong.' });
  }
}
