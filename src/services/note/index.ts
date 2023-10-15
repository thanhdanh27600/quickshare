import prisma from '../db/prisma';

export class NoteService {
  async getNote(hash: string) {
    return prisma.note.findUnique({
      where: {
        hash,
      },
      include: { Media: true, UrlShortenerHistory: true },
    });
  }
}

export const noteService = new NoteService();
