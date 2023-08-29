import prisma from '../db/prisma';
import { api, successHandler } from '../utils/axios';
import { validateMediaSchema } from '../utils/validateMiddleware';

export const handler = api(
  async (req, res) => {
    await validateMediaSchema.parseAsync({
      body: req.body,
    });
    const url = req.body.url;
    const rs = await prisma.media.upsert({
      where: {
        url,
      },
      update: {
        url,
      },
      create: {
        url,
      },
    });
    return successHandler(res, rs);
  },
  ['POST'],
);
