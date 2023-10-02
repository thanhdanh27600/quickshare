import { redis } from '../redis';
import { SERVER_AUTH } from '../types/constants';
import { api, badRequest, successHandler } from '../utils/axios';
import { decryptS } from '../utils/crypto';

export const handler = api(
  async (req, res) => {
    let rs = {};
    const f = req.body.f;
    const params = req.body.params;
    const key = req.body.key;

    if (!f) return badRequest(res);

    const token = req.headers['X-Platform-Auth'.toLowerCase()] as string;
    const decryptToken = decryptS(token);
    if (decryptToken !== SERVER_AUTH) return badRequest(res);

    switch (f) {
      case 'ping':
        rs = { data: await redis.ping() };
        break;
      case 'get':
        rs = { data: await redis.get(key) };
        break;
      case 'set':
        rs = { data: await redis.set(key, params) };
        break;
      case 'expire':
        rs = { data: await redis.expire(key, params) };
        break;
      case 'incrby':
        rs = { data: await redis.incrby(key, params) };
        break;
      case 'exists':
        rs = { data: await redis.exists(key) };
        break;
      case 'hgetall':
        rs = await redis.hgetall(key);
        break;
      case 'keys':
        rs = { data: await redis.keys(key) };
        break;
      case 'hget':
        rs = { data: await redis.hget(key, params) };
        break;
      case 'hexists':
        rs = { data: await redis.hexists(key, params) };
        break;
      case 'ttl':
        rs = { data: await redis.ttl(key) };
        break;
      case 'flushdb':
        rs = { data: await redis.flushdb() };
        break;
      case 'del':
        rs = { data: await redis.del(params) };
        break;
      case 'flushall':
        rs = { data: await redis.flushall() };
        break;
      default:
        break;
    }
    return successHandler(res, rs);
  },
  ['POST'],
);
