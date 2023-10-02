import { Prisma } from '@prisma/client';
import prisma from '../db/prisma';

export class ShortenService {
  async getShortenHistory(hash: string, args?: Prisma.UrlShortenerHistoryFindFirstArgs) {
    return prisma.urlShortenerHistory.findFirst({
      where: {
        hash,
        isBanned: false,
      },
      ...args,
    });
  }
}

export const shortenService = new ShortenService();
