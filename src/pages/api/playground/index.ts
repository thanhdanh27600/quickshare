import { SERVER_AUTH } from '../../../types/constants';
import { api, errorHandler } from '../../../utils/axios';
import { decryptS } from '../../../utils/crypto';

export const handler = api(
  async (req, res) => {
    const token = req.headers['X-Platform-Auth'.toLowerCase()] as string;
    if (!token || decryptS(token) !== SERVER_AUTH) {
      return errorHandler(res);
    }
    // TODO
    res.send('OK');
  },
  ['POST'],
);
