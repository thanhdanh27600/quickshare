import { UrlShortenerHistory } from '@prisma/client';
import prisma from 'db/prisma';
import geoIp from 'geoip-country';
import { NextApiRequest, NextApiResponse } from 'next';
import requestIp from 'request-ip';
import { Response } from 'types/api';
import { log } from 'utils/clg';
import HttpStatusCode from 'utils/statusCode';

export type ForwardRs = Response & {
  history?: UrlShortenerHistory | null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ForwardRs>) {
  try {
    const ip = requestIp.getClientIp(req);
    if (req.method !== 'POST') {
      await prisma.$disconnect();
      return res.status(HttpStatusCode.METHOD_NOT_ALLOWED).json({ errorMessage: 'Method Not Allowed' });
    }
    const hash = req.body.hash as string;
    const userAgent = req.body.userAgent as string;
    console.log('forward hash', hash);
    if (!hash) {
      return res.status(HttpStatusCode.BAD_REQUEST).send({
        errorMessage: 'You have submitted wrong data, please try again',
        errorCode: 'BAD_REQUEST',
      });
    }
    let lookupIp;
    if (ip) {
      lookupIp = geoIp.lookup(ip);
    }

    if (!lookupIp) {
      console.log(!ip ? 'ip not found' : `geoIp cannot determined ${ip}`);
    } else {
      console.log('lookupIp', lookupIp);
    }

    let history = await prisma.urlShortenerHistory.findUnique({
      where: {
        hash,
      },
    });

    if (!history) {
      await prisma.$disconnect();
      return res.status(HttpStatusCode.BAD_REQUEST).send({
        errorMessage: 'You have submitted wrong data, please try again',
        errorCode: 'BAD_REQUEST',
      });
    }

    const meta = await prisma.urlForwardMeta.create({
      data: {
        countryCode: lookupIp?.country,
        userAgent,
        urlShortenerHistoryId: history.id,
      },
    });
    log(['history forward', JSON.stringify(history, null, 2)]);
    log(['meta forward', JSON.stringify(meta, null, 2)], 'G');
    await prisma.$disconnect();
    res.status(HttpStatusCode.OK).json({ history });
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ errorMessage: (error as any).message || 'Something when wrong.' });
  }
}
