import prisma from '../db/prisma';

export class FileService {
  async getFile(hash: string) {
    return prisma.file.findUnique({
      where: {
        hash,
      },
      include: { Media: true },
    });
  }
}

export const fileService = new FileService();
