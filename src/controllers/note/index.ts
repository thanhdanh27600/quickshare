import base64url from 'base64url';
import requestIp from 'request-ip';
import prisma from '../../db/prisma';
import { NoteRs } from '../../types/note';
import { api, successHandler } from '../../utils/axios';
import HttpStatusCode from '../../utils/statusCode';
import { generateRandomString } from '../../utils/text';
import { validateNoteSchema } from '../../utils/validateMiddleware';

export const handler = api<NoteRs>(
  async (req, res) => {
    const ip = requestIp.getClientIp(req) || '';
    let text = (req.body.text as string) || null;
    let hash = (req.body.hash as string) || null;
    await validateNoteSchema.parseAsync({ text, hash, ip });

    if (!text) {
      return res.status(HttpStatusCode.BAD_REQUEST).send({
        errorMessage: 'Wrong note format, please try again',
        errorCode: 'INVALID_NOTE',
      });
    }
    // to do: get & post
    const time = `${new Date().getTime()}`;
    hash = generateRandomString(3);
    const uuid = `${base64url(time.slice(7) + hash)}`; // 12 chars
    let record = await prisma.urlShortenerRecord.findFirst({ where: { ip } });
    if (!record) record = await prisma.urlShortenerRecord.create({ data: { ip } });
    const note = await prisma.note.create({
      data: { hash, text, uuid, urlShortenerRecordId: record.id },
    });
    return successHandler(res, note);
  },
  ['POST'],
);

export * as update from './update';
