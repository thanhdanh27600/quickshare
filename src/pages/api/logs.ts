import { readFile } from 'fs/promises';
import { api, successHandler } from '../../utils/axios';

const handler = api(
  async (req, res) => {
    const logs = await readFile('logs/pino.log', { encoding: 'utf8', flag: 'r' });
    return successHandler(res, logs);
  },
  ['GET'],
);

export default handler;
