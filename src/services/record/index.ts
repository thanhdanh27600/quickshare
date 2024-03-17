import prisma from '../db/prisma';

export class RecordService {
  async getOrCreate(ip: string) {
    let record = await prisma.urlShortenerRecord.findFirst({ where: { ip } });
    if (!record) record = await prisma.urlShortenerRecord.create({ data: { ip } });
    return record;
  }
}

export const recordService = new RecordService();
