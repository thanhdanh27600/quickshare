import prisma from '../../db/prisma';
import { Stats } from '../../types/stats';
import { api, errorHandler } from '../../utils/axios';
import { decryptS, encryptS } from '../../utils/crypto';
import HttpStatusCode from '../../utils/statusCode';
import { validateStatsTokenSchema } from '../../utils/validateMiddleware';

export const handler = api<Stats>(
  async (req, res) => {
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
  },
  ['POST'],
);
