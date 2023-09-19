import { SERVER_AUTH } from '../../../types/constants';
import { api, errorHandler } from '../../../utils/axios';
import { decryptS } from '../../../utils/crypto';

const handler = api(
  async (req, res) => {
    const token = req.headers['X-Platform-Auth'.toLowerCase()] as string;
    if (!token || decryptS(token) !== SERVER_AUTH) {
      return errorHandler(res);
    }
    // TODO
    // call the main function
    // sendMessageToQueue([{ body: { danh: 1 }, subject: 'forward' }]).catch((err) => {
    //   console.log('Error send test occurred: ', err);
    // });
    res.send('OK');
  },
  ['POST'],
);

export default handler;
