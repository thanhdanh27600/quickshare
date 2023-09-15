import prisma from '../db/prisma';
import { api, successHandler } from '../utils/axios';
import { validateMediaSchema } from '../utils/validateMiddleware';

export const handler = api(
  async (req, res) => {
    await validateMediaSchema.parseAsync({
      body: req.body,
    });
    const url = req.body.url;
    const externalId = req.body.externalId;
    const provider = req.body.provider;
    const name = req.body.name;
    const type = req.body.type;
    const rs = await prisma.media.create({
      data: {
        url,
        name,
        type,
        externalId,
        provider,
      },
    });
    return successHandler(res, rs);
  },
  ['POST'],
);
