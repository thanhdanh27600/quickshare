import { Media } from '@prisma/client';
import base64url from 'base64url';
import { NextApiHandler } from 'next';
import requestIp from 'request-ip';
import { redis } from '../../redis';
import { noteCacheService } from '../../services/cache';
import prisma from '../../services/db/prisma';
import { generateHash } from '../../services/hash';
import { noteService } from '../../services/note';
import { recordService } from '../../services/record';
import { shortenService } from '../../services/shorten';
import { BASE_URL, HASH, REDIS_KEY, getRedisKey } from '../../types/constants';
import { NoteRs } from '../../types/note';
import { api, badRequest, errorHandler, successHandler } from '../../utils/axios';
import { decodeBase64 } from '../../utils/crypto';
import { parseIntSafe } from '../../utils/number';
import HttpStatusCode from '../../utils/statusCode';
import { validateNoteSchema } from '../../utils/validateMiddleware';

export const handler = api<NoteRs>(
  async (req, res) => {
    const ip = requestIp.getClientIp(req)!;
    let text = (req.body.text as string) || null;
    let title = (req.body.title as string) || null;
    let hash = (req.query.hash as string) || null;
    let uid = (req.body.uid as string) || null;
    let medias = req.body.medias as Media[];

    // retrive note for update if uid
    if (!!uid && req.method === 'POST') return await getNoteForUpdateHandler(req, res);
    // retrive note for view if hash
    if (!!hash && req.method === 'GET') return await getNoteHandler(req, res);

    await validateNoteSchema.parseAsync({ text, title, hash, ip, uid, medias });

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
        errorMessage: 'EXCEEDED_NOTE',
        errorCode: 'UNAUTHORIZED',
      });
    }
    noteCacheService.incLimitIp(ip);

    const record = await recordService.getOrCreate(req, ip);
    // generate hash
    const noteHash = await generateHash('note');

    // create shorten url
    const shortHash = await generateHash('shorten');
    const history = await prisma.urlShortenerHistory.create({
      data: {
        url: `${BASE_URL}/n/${noteHash}`,
        hash: shortHash,
        urlShortenerRecordId: record.id,
      },
    });

    // generate note uid
    const time = `${new Date().getTime()}`;
    // 12 chars : ex. time = 1694179884653 -> base64url('884653xxx') -> 12 chars
    const targetUid = `${base64url(time.slice(10 - HASH.Length) + noteHash)}`;

    // write to note db
    const note = await prisma.note.create({
      data: {
        hash: noteHash,
        text,
        title,
        uid: targetUid,
        urlShortenerRecordId: record.id,
        urlShortenerHistoryId: history.id,
        Media: {
          connect: medias.map((m) => ({ id: m.id })),
        },
      },
    });
    // write note to cache
    const dataHashNote = [
      'id',
      note.id,
      'title',
      note.title,
      'text',
      text,
      'uid',
      targetUid,
      'updatedAt',
      new Date().getTime(),
    ];
    noteCacheService.postNoteHash({ hash: noteHash, data: dataHashNote });

    return successHandler(res, { note: { ...note, UrlShortenerHistory: history } });
  },
  ['POST', 'GET'],
);

const getNoteHandler: NextApiHandler<NoteRs> = async (req, res) => {
  let hash = req.query.hash as string;
  let token = decodeBase64(req.query.token as string);
  let valid = false;

  if (!hash || hash.trim().length < HASH.Length) return badRequest(res);

  // get from cache
  const hashKey = getRedisKey(REDIS_KEY.MAP_NOTE_BY_HASH, hash);
  const noteCacheId = await redis.hget(hashKey, 'id');
  const noteCacheText = await redis.hget(hashKey, 'text');
  const noteCacheTitle = await redis.hget(hashKey, 'title');
  const noteCachePassword = await redis.hget(hashKey, 'password');
  const urlShortenerHistoryId = await redis.hget(hashKey, 'urlShortenerHistoryId');

  if (noteCachePassword) {
    valid = shortenService.verifyToken(
      { id: parseIntSafe(urlShortenerHistoryId), password: noteCachePassword, usePasswordForward: true } as any,
      token,
    );
    if (!valid) return errorHandler(res);
  }

  if (noteCacheId && noteCacheText) {
    // cache hit
    const medias = await prisma.media.findMany({ where: { noteId: Number(noteCacheId) } });
    return successHandler(res, { note: { text: noteCacheText, title: noteCacheTitle, Media: medias } });
  }
  // cache missed
  const note = await noteService.getNote(hash);
  if (!note) return badRequest(res);

  if (note.password) {
    valid = shortenService.verifyToken(note.UrlShortenerHistory, token);
    if (!valid) return errorHandler(res);
  }

  const dataHashNote = [
    'id',
    note.id,
    'title',
    note.title,
    'text',
    note.text,
    'password',
    note.password,
    'urlShortenerHistoryId',
    note.urlShortenerHistoryId,
    'uid',
    note.uid,
    'updatedAt',
    new Date().getTime(),
  ];
  // update cache
  noteCacheService.postNoteHash({ hash, data: dataHashNote });
  return successHandler(res, { note: { text: note.text, Media: note.Media, title: note.title } });
};

const getNoteForUpdateHandler: NextApiHandler<NoteRs> = async (req, res) => {
  let uid = req.body.uid as string;
  if (!uid) return badRequest(res);
  const note = await prisma.note.findUnique({
    where: {
      uid,
    },
    include: { UrlShortenerHistory: true, Media: { orderBy: { id: 'asc' } } },
  });

  if (!note) {
    return badRequest(res, "No note was found on your request. Let's create one!");
  }
  // write hash to cache
  return successHandler(res, { note });
};

export * as update from './update';
