import requestIp from 'request-ip';
import prisma from '../services/db/prisma';
import { recordService } from '../services/record';
import { api, successHandler } from '../utils/axios';
import { validateMediaSchema } from '../utils/validateMiddleware';

export const handler = api(
  async (req, res) => {
    const ip = requestIp.getClientIp(req)!;
    await validateMediaSchema.parseAsync({
      body: req.body,
    });
    const url = req.body.url;
    const externalId = req.body.externalId;
    const provider = req.body.provider;
    const name = req.body.name;
    const type = req.body.type;
    const record = await recordService.getOrCreate(ip);
    const rs = await prisma.media.create({
      data: {
        url,
        name,
        type,
        externalId,
        provider,
        urlShortenerHistoryId: record?.id,
      },
    });
    return successHandler(res, rs);
  },
  ['POST'],
);
