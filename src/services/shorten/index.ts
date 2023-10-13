import { Prisma, UrlShortenerHistory } from '@prisma/client';
import { decryptS } from '../../utils/crypto';
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
  async verifyPassword(history: UrlShortenerHistory | null, password: string) {
    if (!history) return false;
    if (!history.password) return true;
    const decryptPassword = decryptS(history.password);
    return decryptPassword === password;
  }
  verifyToken(history: UrlShortenerHistory | null, token: string) {
    if (!history) return false;
    if (!history.password) return true;
    if (!history.usePasswordForward) return true;
    if (!token) return false;
    if (decryptS(token) !== history.id.toString()) {
      return false;
    }
    return true;
  }
}

export const shortenService = new ShortenService();
