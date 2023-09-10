import base64url from 'base64url';
import { NextApiHandler, NextApiResponse } from 'next';
import requestIp from 'request-ip';
import prisma from '../../db/prisma';
import { redis } from '../../redis/client';
import { noteCacheService } from '../../services/cacheServices';
import {
  LIMIT_FEATURE_HOUR,
  LIMIT_NOTE_REQUEST,
  NUM_CHARACTER_HASH,
  REDIS_KEY,
  getRedisKey,
} from '../../types/constants';
import { Forward, ForwardMeta } from '../../types/forward';
import { NoteRs } from '../../types/note';
import { ipLookup } from '../../utils/agent';
import { api, badRequest, successHandler } from '../../utils/axios';
import HttpStatusCode from '../../utils/statusCode';
import { generateRandomString } from '../../utils/text';
import { validateForwardSchema, validateNoteSchema } from '../../utils/validateMiddleware';

export const handler = api<NoteRs>(
  async (req, res) => {
    const ip = requestIp.getClientIp(req)!;
    let text = (req.body.text as string) || null;
    let hash = (req.body.hash as string) || null;

    if (!!hash) return await getNote(req, res);

    await validateNoteSchema.parseAsync({ text, hash, ip });

    if (!text) {
      return res.status(HttpStatusCode.BAD_REQUEST).send({
        errorMessage: 'Wrong note format, please try again',
        errorCode: 'INVALID_NOTE',
      });
    }
    // check or reset get request limit
    const reachedFeatureLimit = await noteCacheService.limitFeature(ip);
    if (reachedFeatureLimit) {
      return res.status(HttpStatusCode.TOO_MANY_REQUESTS).send({
        errorMessage: `Exceeded ${LIMIT_NOTE_REQUEST} notes, please comeback after ${LIMIT_FEATURE_HOUR} hours.`,
        errorCode: 'UNAUTHORIZED',
      });
    }
    noteCacheService.incLimitIp(ip);

    // generate hash
    let newHash = '';
    let isExist = 1;
    let timesLimit = 0;

    const logger = require('../../utils/loggerServer');
    while (isExist) {
      if (timesLimit > 0) {
        logger.warn('timesLimit note occured', timesLimit);
      }
      if (timesLimit++ > 10 /** U better buy lucky ticket */) {
        logger.error('timesLimit note reached', timesLimit);
        throw new Error('Bad request after digging our hash, please try again!');
      }
      newHash = generateRandomString(NUM_CHARACTER_HASH);
      isExist = await noteCacheService.existHash(newHash);
      // also double check db if not collapse in cache
      if (!isExist) {
        isExist = !!(await prisma.note.findUnique({ where: { hash: newHash } })) ? 1 : 0;
      }
    }

    const time = `${new Date().getTime()}`;
    // 12 chars : ex. time = 1694179884653 -> base64url('884653xxx') -> 12 chars
    const uuid = `${base64url(time.slice(10 - NUM_CHARACTER_HASH) + newHash)}`;

    // write hash to cache
    const dataHashNote = ['text', text, 'uuid', uuid, 'updatedAt', new Date().getTime()];
    await noteCacheService.postNoteHash({ ip, hash: newHash, data: dataHashNote });

    // write to db
    let record = await prisma.urlShortenerRecord.findFirst({ where: { ip } });
    if (!record) record = await prisma.urlShortenerRecord.create({ data: { ip } });
    const note = await prisma.note.create({
      data: { hash: newHash, text, uuid, urlShortenerRecordId: record.id },
    });
    return successHandler(res, { note });
  },
  ['POST'],
);

const getNote: NextApiHandler<NoteRs> = async (req, res) => {
  let hash = req.body.hash as string;
  const userAgent = req.body.userAgent as string;
  const ip = requestIp.getClientIp(req)!;
  const fromClientSide = !!req.body.fromClientSide;
  await validateForwardSchema.parseAsync({
    hash,
    userAgent,
    ip,
  });
  if (!hash) return badRequest(res);
  const lookupIp = ipLookup(ip) || undefined;
  const hashKey = getRedisKey(REDIS_KEY.MAP_NOTE_BY_HASH, hash);
  const noteCacheText = await redis.hget(hashKey, 'text');
  const noteCacheUuid = await redis.hget(hashKey, 'uuid');
  const data = { hash, ip, userAgent, fromClientSide, lookupIp };
  if (noteCacheText && noteCacheUuid) {
    // cache hit
    postProcessForward(data); // bypass process
    return res.status(HttpStatusCode.OK).json({ note: { text: noteCacheText, uuid: noteCacheUuid } });
  }
  // cache missed
  await postProcessForward(data, res as any);
};

export const postProcessForward = async (payload: ForwardMeta, res?: NextApiResponse<Forward>) => {
  const cacheMissed = !!res;
  const { hash, ip, userAgent, fromClientSide, lookupIp } = payload;
  let note = await prisma.note.findUnique({
    where: {
      hash,
    },
  });

  if (!note) {
    return cacheMissed ? badRequest(res) : null;
  }

  await prisma.urlForwardMeta.upsert({
    where: {
      userAgent_ip_noteId: {
        ip,
        userAgent,
        noteId: note.id,
      },
    },
    update: {
      countryCode: lookupIp?.country,
      fromClientSide,
    },
    create: {
      ip,
      userAgent,
      noteId: note.id,
      countryCode: lookupIp?.country,
      fromClientSide,
    },
  });

  if (cacheMissed) {
    // write back to cache
    const dataHashNote = ['text', note.text, 'uuid', note.uuid, 'updatedAt', new Date().getTime()];
    await noteCacheService.postNoteHash({ ip, hash, data: dataHashNote });

    return res.status(HttpStatusCode.OK).json({ note });
  }
};

export * as update from './update';
