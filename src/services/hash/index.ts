import { noteCacheService, shortenCacheService } from '../../services/cache';
import { HASH, RESERVED_HASH } from '../../types/constants';
import { generateRandomString } from '../../utils/text';
import prisma from '../db/prisma';

const existCache = async ({ generateFor, hash }: { hash: string; generateFor: string }) =>
  generateFor === 'note'
    ? await noteCacheService.existHash(hash)
    : generateFor === 'shorten'
    ? await shortenCacheService.existHash(hash)
    : 1;

const existDb = async ({ generateFor, hash }: { hash: string; generateFor: string }) =>
  generateFor === 'shorten'
    ? await prisma.urlShortenerHistory.findUnique({ where: { hash } })
    : generateFor === 'note'
    ? await prisma.note.findUnique({ where: { hash } })
    : generateFor === 'file'
    ? await prisma.file.findUnique({ where: { hash } })
    : 1;

export const generateHash = async (generateFor: 'shorten' | 'note' | 'file') => {
  let hash = '';
  let isExist = 1;
  let timesLimit = 0;

  const logger = require('../../utils/loggerServer');
  while (isExist) {
    if (timesLimit > 0) {
      logger.warn(`timesLimit ${generateFor} occured`, timesLimit);
    }
    if (timesLimit++ > 10 /** U better buy lucky ticket */) {
      logger.error(`timesLimit ${generateFor} reached`, timesLimit);
      throw new Error('Bad request after digging our hash, please try again!');
    }

    hash = generateRandomString(HASH.Length);

    // check reserved hash
    if (RESERVED_HASH.has(hash)) continue;

    // check from cache
    // isExist = await existCache({ generateFor, hash });

    //  check from db
    // if (!isExist) {
    isExist = !!(await existDb({ generateFor, hash })) ? 1 : 0;
    // }

    // inc counter
    timesLimit++;
  }
  return hash;
};
