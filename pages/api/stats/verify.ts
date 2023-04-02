import { UrlForwardMeta, UrlShortenerHistory, UrlShortenerRecord } from '@prisma/client';
import prisma from 'db/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { Response } from 'types/api';
import { errorHandler } from 'utils/axios';
import { decryptS, encryptS } from 'utils/crypto';
import HttpStatusCode from 'utils/statusCode';
import { validateStatsTokenSchema } from 'utils/validateMiddleware';
import { z } from 'zod';

export type Stats = Response & {
  record?: UrlShortenerRecord | null;
  history?: (UrlShortenerHistory & { urlForwardMeta?: UrlForwardMeta[] })[] | null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Stats>) {
  try {
    require('utils/loggerServer').info(req);
    if (req.method !== 'POST') {
      return res.status(HttpStatusCode.METHOD_NOT_ALLOWED).json({ errorMessage: 'Method Not Allowed' });
    }
    await validateStatsTokenSchema.parseAsync(req.body);
    const hash = req.body.h as string;
    const password = req.body.p as string;
    let history;
    // get stats with hash
    history = await prisma.urlShortenerHistory.findUnique({
      where: {
        hash,
      },
    });
    if (history && history?.password) {
      const decryptPassword = decryptS(history?.password);
      if (decryptPassword === password) {
        return res.status(HttpStatusCode.OK).json({ token: encryptS(history.id.toString()) } as any);
      }
    }
    return errorHandler(res);
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