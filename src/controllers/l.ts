import requestIp from 'request-ip';
import { ipLookup } from '../utils/agent';
import { api, originGuard } from '../utils/axios';

export const handler = api(
  async (req, res) => {
    originGuard(req, res);
    const ip = requestIp.getClientIp(req) || '';
    const lookupIp = ipLookup(ip) || undefined;
    return res.send({ country: lookupIp?.country || '' });
  },
  ['POST'],
);
