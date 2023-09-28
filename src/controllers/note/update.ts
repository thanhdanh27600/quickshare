import { Media } from '@prisma/client';
import { noteCacheService } from '../../services/cache';
import prisma from '../../services/db/prisma';
import { NoteRs } from '../../types/note';
import { api, successHandler } from '../../utils/axios';
import HttpStatusCode from '../../utils/statusCode';
import { validateUpdateNoteSchema } from '../../utils/validateMiddleware';

export const handler = api<NoteRs>(
  async (req, res) => {
    let uid = req.body.uid as string;
    let text = req.body.text as string;
    let title = (req.body.title || '') as string;
    let medias = req.body.medias as Media[];

    await validateUpdateNoteSchema.parseAsync({
      uid,
      text,
      title,
      medias,
    });

    let note = await prisma.note.findUnique({ where: { uid } });
    if (!note) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ errorCode: 'NOT_FOUND', errorMessage: 'Uid not found' });
    }

    await prisma.$transaction([
      prisma.media.updateMany({
        where: { noteId: note.id },
        data: { noteId: null },
      }),
      prisma.note.update({
        where: { id: note.id },
        data: {
          text,
          title,
          Media: {
            connect: medias.map((m) => ({ id: m.id })),
          },
        },
      }),
    ]);
    // flush cache
    noteCacheService.updateNoteHash(note.hash);
    return successHandler(res, { note: { ...note, text } });
  },
  ['PUT'],
);
