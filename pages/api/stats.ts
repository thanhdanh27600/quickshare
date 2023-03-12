import { UrlForwardMeta, UrlShortenerHistory, UrlShortenerRecord } from '@prisma/client';
import prisma from 'db/prisma';
import geoIp from 'geoip-country';
import { NextApiRequest, NextApiResponse } from 'next';
import requestIp from 'request-ip';
import { Response } from 'types/api';
import HttpStatusCode from 'utils/statusCode';
import { validateStatsSchema } from 'utils/validateMiddleware';
import { z } from 'zod';

export type Stats = Response & {
  record?: UrlShortenerRecord | null;
  history?: (UrlShortenerHistory & { urlForwardMeta: UrlForwardMeta[] })[] | null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Stats>) {
  try {
    const ip = requestIp.getClientIp(req) as string;
    if (req.method !== 'GET') {
      return res.status(HttpStatusCode.METHOD_NOT_ALLOWED).json({ errorMessage: 'Method Not Allowed' });
    }
    await validateStatsSchema.parseAsync({
      query: { ...req.query, ip },
    });
    console.log('====STATS===');
    console.log('ip', ip);
    console.log('geoIp', geoIp.lookup(ip));
    const hash = req.query.hash as string;
    let record;
    let history;
    if (!hash) {
      record = await prisma.urlShortenerRecord.findFirst({
        where: { ip },
        include: {
          history: {
            include: {
              urlForwardMeta: true,
            },
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
          urlForwardMeta: true,
          UrlShortenerRecord: true,
        },
      });
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
