import HttpStatusCode from '../utils/statusCode';
import prisma from '../db/prisma';
import { api, badRequest } from '../utils/axios';

export const handler = api(
  async (req, res) => {
    const hash = req.body.hash as string;
    if (!hash) {
      return badRequest(res);
    }
    const history = await prisma.urlShortenerHistory.findUnique({
      where: {
        hash,
      },
    });
    if (!history) {
      return badRequest(res);
    }
    return res.status(HttpStatusCode.OK).json({ history });
  },
  ['POST'],
);
