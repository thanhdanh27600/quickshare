import prisma from '../../db/prisma';
import { noteCacheService } from '../../services/cache';
import { NoteRs } from '../../types/note';
import { api, successHandler } from '../../utils/axios';
import HttpStatusCode from '../../utils/statusCode';
import { validateUpdateNoteSchema } from '../../utils/validateMiddleware';

export const handler = api<NoteRs>(
  async (req, res) => {
    let uid = req.body.uid as string;
    let text = req.body.text as string;
    await validateUpdateNoteSchema.parseAsync({
      uid,
      text,
    });

    let note = await prisma.note.findUnique({ where: { uid } });
    if (!note) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ errorCode: 'NOT_FOUND', errorMessage: 'Uid not found' });
    }

    note = await prisma.note.update({
      where: { id: note.id },
      data: {
        text,
      },
    });
    // flush cache
    noteCacheService.updateNoteHash(note.hash);

    return successHandler(res, { note });
  },
  ['PUT'],
);
