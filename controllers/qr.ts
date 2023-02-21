import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { QR } from '../types/qr';
import { errorHandler } from '../utils/axios';
import { decrypt } from '../utils/crypto';
import HttpStatusCode from '../utils/statusCode';
import { validateQrSchema } from '../utils/validateMiddleware';

export const handler = async (req: NextApiRequest, res: NextApiResponse<QR>) => {
  try {
    require('utils/loggerServer').info(req);
    if (req.method !== 'GET') {
      return res.status(HttpStatusCode.METHOD_NOT_ALLOWED).json({ errorMessage: 'Method Not Allowed' });
    }
    await validateQrSchema.parseAsync({
      query: req.query,
    });
    const text = req.query.text as string;
    const token = req.headers['X-Platform-Auth'.toLowerCase()] as string;
    const decrypted = decrypt(token);
    if (!decrypted) {
      return errorHandler(res);
    }
    const QRCode = require('qrcode');
    let qr = '';
    qr = await QRCode.toDataURL(text, { width: 300, margin: 1 });
    return res.status(HttpStatusCode.OK).json({ qr });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json(error.issues);
    }
    res
      .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ errorMessage: (error as any).message || 'Something when wrong.' });
  }
};
