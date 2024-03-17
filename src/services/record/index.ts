import { UrlShortenerRecord, User } from '@prisma/client';
import { NextApiRequest } from 'next/types';
import prisma from '../db/prisma';

export class RecordService {
  async getOrCreate(req: NextApiRequest, ip: string) {
    let record: (UrlShortenerRecord & { User?: User | null }) | null = null;
    // if logged in, get by email
    if (!!req.session?.user?.email) {
      record = await prisma.urlShortenerRecord.findFirst({
        where: {
          User: {
            email: req.session.user.email,
          },
        },
        include: { User: true },
      });
    }
    // get by ip
    if (!record) {
      record = await prisma.urlShortenerRecord.findFirst({ where: { ip }, include: { User: true } });
    }

    // update record's user
    if (!!record && !record.User && !!req.session?.user?.email) {
      record = await prisma.urlShortenerRecord.update({
        where: { id: record.id },
        data: {
          User: {
            connect: { email: req.session?.user?.email },
          },
        },
      });
    }
    // create record
    if (!record) {
      record = await prisma.urlShortenerRecord.create({
        data: {
          ip,
          ...(req.session?.user?.email
            ? {
                User: {
                  connect: { email: req.session?.user?.email },
                },
              }
            : null),
        },
      });
    }

    return record;
  }
}

export const recordService = new RecordService();
