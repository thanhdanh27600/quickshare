import { UrlShortenerHistory, UrlShortenerRecord } from '@prisma/client';
import prisma from 'db/prisma';
import geoIp from 'geoip-country';
import { NextApiRequest, NextApiResponse } from 'next';
import requestIp from 'request-ip';
import { Response } from 'types/api';
import HttpStatusCode from 'utils/statusCode';
type Stat = Response & {
  record?:
    | (UrlShortenerRecord & {
        history: UrlShortenerHistory[];
      })
    | null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Stat>) {
  try {
    const ip = requestIp.getClientIp(req);
    if (req.method !== 'GET') {
      return res.status(HttpStatusCode.METHOD_NOT_ALLOWED).json({ errorMessage: 'Method Not Allowed' });
    }
    if (!ip) {
      return res.status(HttpStatusCode.BAD_REQUEST).send({
        errorMessage: 'You have submitted wrong data, please try again',
        errorCode: 'BAD_REQUEST',
      });
    }
    console.log('====STATS===');
    console.log('ip', ip);
    console.log('geoIp', geoIp.lookup(ip));
    const record = await prisma.urlShortenerRecord.findFirst({
      where: { ip },
      include: {
        history: {
          include: {
            urlForwardMeta: true,
          },
        },
      },
    });

    res.status(HttpStatusCode.OK).json({ record: record });
  } catch (error) {
    console.error(error);
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ errorMessage: (error as any).message || 'Something when wrong.' });
  }
}
