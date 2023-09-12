import { UrlShortenerHistory } from '@prisma/client';
import { createMocks } from 'node-mocks-http';
import * as controller from '../controllers';
import { redis } from '../redis/client';
import { REDIS_KEY } from '../types/constants';
import HttpStatusCode from '../utils/statusCode';

const ip = '0.0.0.1';
const userAgent = 'localhost';
const key = `${REDIS_KEY.LIMIT_SHORTEN}:${ip}`;
const exampleUrl = 'U2FsdGVkX1+hDFakyw7MPSqI3JDQ6rXZF0vjpJ1ZOLIf5qp+9ByNbpiiJYIE+4ZYSAw1M2fIIfzcn5YaoYVCkA==';

describe('Test /api/forward...', () => {
  describe('Forward shorten url', () => {
    const handler = controller.forward.handler;

    it('Should throw error with wrong method', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: {},
      });
      await handler(req, res);

      expect(res._getStatusCode()).toBe(HttpStatusCode.METHOD_NOT_ALLOWED);
    });

    it('Should throw error with empty query', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {},
      });
      await handler(req, res);

      expect(res._getStatusCode()).toBe(HttpStatusCode.BAD_REQUEST);
    });

    it('Should throw error with wrong hash format', async () => {
      const { req: req1, res: res1 } = createMocks({
        method: 'POST',
        body: { userAgent, hash: 'xx' },
        headers: { 'x-forwarded-for': ip },
      });
      await handler(req1, res1);
      expect(res1._getStatusCode()).toBe(HttpStatusCode.BAD_REQUEST);
      const { req: req2, res: res2 } = createMocks({
        method: 'POST',
        body: { userAgent, ip, hash: '!@#' },
      });
      await handler(req2, res2);
      expect(res2._getStatusCode()).toBe(HttpStatusCode.BAD_REQUEST);
    });

    it('Should throw error with no ip address', async () => {
      await redis.expire(key, 0);
      const { req: req1, res: res1 } = createMocks({
        method: 'GET',
        query: { url: exampleUrl },
        headers: { 'x-forwarded-for': ip },
      });
      await controller.shorten.handler(req1, res1);
      const history: UrlShortenerHistory = JSON.parse(res1._getData());
      const { req, res } = createMocks({
        method: 'POST',
        body: { userAgent, hash: history.hash },
      });
      await handler(req, res);
      expect(res._getStatusCode()).toBe(HttpStatusCode.BAD_REQUEST);
    });

    it('Should forward shortened URL ', async () => {
      await redis.expire(key, 0);
      const { req: req1, res: res1 } = createMocks({
        method: 'GET',
        query: { url: exampleUrl },
        headers: { 'x-forwarded-for': ip },
      });
      await controller.shorten.handler(req1, res1);
      const history1: UrlShortenerHistory = JSON.parse(res1._getData());
      const { req: req2, res: res2 } = createMocks({
        method: 'POST',
        body: { hash: history1.hash, userAgent, ip },
      });
      await handler(req2, res2);
      expect(res2._getStatusCode()).toBe(HttpStatusCode.OK);
      const history2: UrlShortenerHistory = JSON.parse(res2._getData()).history;
      expect(history2.url).toEqual(history1.url);
    });
  });
});
