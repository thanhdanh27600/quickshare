import prisma from '../../db/prisma';
import { ShortenUrl } from '../../types/shorten';
import { api, successHandler } from '../../utils/axios';
import HttpStatusCode from '../../utils/statusCode';
import { validateNoteUpdateSchema } from '../../utils/validateMiddleware';

export const handler = api<ShortenUrl>(
  async (req, res) => {
    let uuid = req.body.uuid as string;
    let text = req.body.text as string;
    await validateNoteUpdateSchema.parseAsync({
      uuid,
      text,
    });

    const note = await prisma.note.findUnique({ where: { uuid } });
    if (!note) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ errorCode: 'NOT_FOUND', errorMessage: 'Uuid not found' });
    }

    const rs = await prisma.note.update({
      where: { id: note.id },
      data: {
        text,
      },
    });

    return successHandler(res, rs);
  },
  ['PUT'],
);
