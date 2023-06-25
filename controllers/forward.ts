import geoIp from 'geoip-country';
import { NextApiRequest, NextApiResponse } from 'next';
import { Forward } from 'types/forward';
import prisma from '../db/prisma';
import { logger } from '../utils/logger';
import HttpStatusCode from '../utils/statusCode';

export const handler = async (req: NextApiRequest, res: NextApiResponse<Forward>) => {
  try {
    require('utils/loggerServer').info(req);
    if (req.method !== 'POST') {
      return res.status(HttpStatusCode.METHOD_NOT_ALLOWED).json({ errorMessage: 'Method Not Allowed' });
    }
    const hash = req.body.hash as string;
    const userAgent = req.body.userAgent as string;
    const ip = req.body.ip as string;
    const fromClientSide = req.body.fromClientSide as string;
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
      logger.warn(!ip ? 'ip not found' : `geoIp cannot determined ${ip}`);
    }

    let history = await prisma.urlShortenerHistory.findUnique({
      where: {
        hash,
      },
    });

    if (!history) {
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
    await prisma.$disconnect();
    return res.status(HttpStatusCode.OK).json({ history });
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    return res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ errorMessage: (error as any).message || 'Something when wrong.' });
  }
};
