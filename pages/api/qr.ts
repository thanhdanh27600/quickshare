import CryptoJS from 'crypto-js';
import { NextApiRequest, NextApiResponse } from 'next';
import { Response } from 'types/api';
import { PLATFORM_AUTH } from 'types/constants';
import HttpStatusCode from 'utils/statusCode';
import { validateQrSchema } from 'utils/validateMiddleware';
import { z } from 'zod';

export type QR = Response & {
  qr?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<QR>) {
  try {
    if (req.method !== 'GET') {
      return res.status(HttpStatusCode.METHOD_NOT_ALLOWED).json({ errorMessage: 'Method Not Allowed' });
    }
    await validateQrSchema.parseAsync({
      query: req.query,
    });
    console.log('====QR===');
    const text = req.query.text as string;
    const token = req.headers['X-Platform-Auth'.toLowerCase()] as string;
    let decrypt = '';
    // Decrypt
    if (PLATFORM_AUTH && token) {
      const bytes = CryptoJS.AES.decrypt(token, PLATFORM_AUTH);
      decrypt = bytes.toString(CryptoJS.enc.Utf8);
    }
    if (!decrypt) {
      return res.status(HttpStatusCode.UNAUTHORIZED).json({ errorMessage: 'UNAUTHORIZED' });
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
}
