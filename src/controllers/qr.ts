import { api } from '../utils/axios';
import { validateQrSchema } from '../utils/validateMiddleware';

export const handler = api(
  async (req, res) => {
    await validateQrSchema.parseAsync({
      query: req.query,
    });
    const text = req.query.text as string;
    const QRCode = require('qrcode');
    let qr = '';
    qr = await QRCode.toDataURL(text, { width: 300, margin: 1 });
    return res.send(qr);
  },
  ['GET'],
);
