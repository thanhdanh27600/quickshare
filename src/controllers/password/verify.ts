import prisma from '../../db/prisma';
import { Stats } from '../../types/stats';
import { api, errorHandler, successHandler } from '../../utils/axios';
import { decryptS, encryptS } from '../../utils/crypto';
import { validateVerifyPasswordSchema } from '../../utils/validateMiddleware';

export const handler = api<Stats>(
  async (req, res) => {
    await validateVerifyPasswordSchema.parseAsync(req.body);
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
        return successHandler(res, { token: encryptS(history.id.toString()) } as any);
      }
    }
    return errorHandler(res);
  },
  ['POST'],
);