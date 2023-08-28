import prisma from '../../db/prisma';
import { ShortenUrl } from '../../types/shorten';
import { api, badRequest, successHandler } from '../../utils/axios';
import { validateUpdateShortenSchema } from '../../utils/validateMiddleware';

export const handler = api<ShortenUrl>(
  async (req, res) => {
    let hash = req.body.hash as string;
    let ogTitle = req.body.ogTitle as string;
    let ogDescription = req.body.ogDescription as string;
    await validateUpdateShortenSchema.parseAsync({
      hash,
      ogTitle,
      ogDescription,
    });
    const history = await prisma.urlShortenerHistory.findUnique({ where: { hash } });
    if (!history) return badRequest(res, "No URL was found on your request. Let's shorten one!");
    const rs = await prisma.urlShortenerHistory.update({
      where: { id: history.id },
      data: {
        ogTitle,
        ogDescription,
      },
    });
    successHandler(res, rs);
  },
  ['PUT'],
);
