import { UrlShortenerHistory } from '@prisma/client';
import prisma from 'db/prisma';
import geoIp from 'geoip-country';
import { NextApiRequest, NextApiResponse } from 'next';
import { Response } from 'types/api';
import { UAParser } from 'ua-parser-js';
import { detectCrawler, detectReferer } from 'utils/agent';
import { log } from 'utils/clg';
import HttpStatusCode from 'utils/statusCode';

export type ForwardRs = Response & {
  history?: UrlShortenerHistory | null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ForwardRs>) {
  try {
    if (req.method !== 'POST') {
      await prisma.$disconnect();
      return res.status(HttpStatusCode.METHOD_NOT_ALLOWED).json({ errorMessage: 'Method Not Allowed' });
    }
    const hash = req.body.hash as string;
    const userAgent = req.body.userAgent as string;
    const ip = req.body.ip as string;
    const fromClientSide = req.body.fromClientSide as string;
    console.log(`===FORWARD${fromClientSide ? '-FROM CLIENT' : ''}===`);
    console.log('forward hash', hash);
    if (!hash) {
      console.log('NO HASH FOUND');
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
      console.log('NO HISTORY');
      await prisma.$disconnect();
      return res.status(HttpStatusCode.BAD_REQUEST).send({
        errorMessage: 'No URL was found',
        errorCode: 'BAD_REQUEST',
      });
    }

    const meta = await prisma.urlForwardMeta.upsert({
      where: {
        userAgent_ip_urlShortenerHistoryId: {
          ip,
          userAgent,
          urlShortenerHistoryId: history.id,
        },
      },
      update: {
        countryCode: lookupIp?.country,
        fromClientSide: !!fromClientSide,
      },
      create: {
        ip,
        userAgent,
        urlShortenerHistoryId: history.id,
        countryCode: lookupIp?.country,
        fromClientSide: !!fromClientSide,
      },
    });

    log(['history forward', JSON.stringify(history, null, 2)]);
    log(['meta forward', JSON.stringify(meta, null, 2)], 'G');
    log(['ua parser', JSON.stringify(UAParser(userAgent), null, 2)], 'Y');
    log(['crawler', detectCrawler(userAgent), 'referer', detectReferer(userAgent)], 'B');
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
