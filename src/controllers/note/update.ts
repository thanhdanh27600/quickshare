import prisma from '../../db/prisma';
import { noteCacheService } from '../../services/cacheServices';
import { ShortenUrl } from '../../types/shorten';
import { api, successHandler } from '../../utils/axios';
import HttpStatusCode from '../../utils/statusCode';
import { validateUpdateNoteSchema } from '../../utils/validateMiddleware';

export const handler = api<ShortenUrl>(
  async (req, res) => {
    let uid = req.body.uid as string;
    let text = req.body.text as string;
    await validateUpdateNoteSchema.parseAsync({
      uid,
      text,
    });

    const note = await prisma.note.findUnique({ where: { uid } });
    if (!note) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ errorCode: 'NOT_FOUND', errorMessage: 'Uid not found' });
    }

    const rs = await prisma.note.update({
      where: { id: note.id },
      data: {
        text,
      },
    });

    noteCacheService.updateNoteHash(note.hash);

    return successHandler(res, rs);
  },
  ['PUT'],
);
