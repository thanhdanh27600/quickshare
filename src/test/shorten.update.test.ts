import { Media, UrlShortenerHistory } from '@prisma/client';
import { createMocks } from 'node-mocks-http';
import * as controller from '../controllers';
import { redis } from '../redis/client';
import { REDIS_KEY } from '../types/constants';
import HttpStatusCode from '../utils/statusCode';

const ip = '0.0.0.1';
const locale = 'vi';
const key = `${REDIS_KEY.LIMIT_SHORTEN}:${ip}`;
const exampleUrl = 'U2FsdGVkX1+hDFakyw7MPSqI3JDQ6rXZF0vjpJ1ZOLIf5qp+9ByNbpiiJYIE+4ZYSAw1M2fIIfzcn5YaoYVCkA==';

describe('Test /api/shorten/update...', () => {
  describe('Update Shortened URL', () => {
    const handler = controller.shorten.update.handler;

    it('Should throw error with wrong method', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {},
      });
      await handler(req, res);

      expect(res._getStatusCode()).toBe(HttpStatusCode.METHOD_NOT_ALLOWED);
    });

    it('Should throw error with empty query', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
        query: {},
      });
      await handler(req, res);

      expect(res._getStatusCode()).toBe(HttpStatusCode.BAD_REQUEST);
    });

    it('Should throw error with empty locale', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
        query: { hash: 'xx' },
      });
      await handler(req, res);
      expect(res._getStatusCode()).toBe(HttpStatusCode.BAD_REQUEST);
    });

    it('Should throw error with wrong hash format', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
        query: { locale, hash: 'xx' },
      });
      await handler(req, res);
      expect(res._getStatusCode()).toBe(HttpStatusCode.BAD_REQUEST);
    });

    it('Should update shortened URL OK without any addition info ', async () => {
      await redis.expire(key, 0);
      const { req: req1, res: res1 } = createMocks({
        method: 'GET',
        query: { url: exampleUrl },
        headers: { 'x-forwarded-for': ip },
      });
      await controller.shorten.handler(req1, res1);
      const history: UrlShortenerHistory = JSON.parse(res1._getData());
      const { req: req2, res: res2 } = createMocks({
        method: 'PUT',
        body: { hash: history.hash, locale: 'vi' },
        headers: { 'x-forwarded-for': ip },
      });
      await handler(req2, res2);
      expect(res2._getStatusCode()).toBe(HttpStatusCode.OK);
    });

    it('Should update shortened URL OK with og info', async () => {
      await redis.expire(key, 0);
      const { req: req1, res: res1 } = createMocks({
        method: 'GET',
        query: { url: exampleUrl },
        headers: { 'x-forwarded-for': ip },
      });
      await controller.shorten.handler(req1, res1);
      const history: UrlShortenerHistory = JSON.parse(res1._getData());
      const hash = history.hash;
      const ogTitle = `ogTitle ${hash}`;
      const ogDescription = `ogDescription ${hash}`;
      const { req: req2, res: res2 } = createMocks({
        method: 'PUT',
        body: { hash, locale, ogTitle, ogDescription },
        headers: { 'x-forwarded-for': ip },
      });
      await handler(req2, res2);
      expect(res2._getStatusCode()).toBe(HttpStatusCode.OK);
      const data = JSON.parse(res2._getData());
      expect(data?.ogTitle).toBe(ogTitle);
      expect(data?.ogDescription).toBe(ogDescription);
    });

    it('Should update shortened URL OK with custom og image', async () => {
      await redis.expire(key, 0);
      const { req: req1, res: res1 } = createMocks({
        method: 'GET',
        query: { url: exampleUrl },
        headers: { 'x-forwarded-for': ip },
      });
      await controller.shorten.handler(req1, res1);
      const history: UrlShortenerHistory = JSON.parse(res1._getData());
      const hash = history.hash;

      const { req: req2, res: res2 } = createMocks({
        method: 'POST',
        body: { url: `ogImgSrc ${hash}` },
        headers: { 'x-forwarded-for': ip },
      });
      await controller.i.handler(req2, res2);
      const media: Media = JSON.parse(res2._getData());

      const { req: req3, res: res3 } = createMocks({
        method: 'PUT',
        body: { hash, locale, mediaId: media.id },
        headers: { 'x-forwarded-for': ip },
      });
      await handler(req3, res3);
      expect(res3._getStatusCode()).toBe(HttpStatusCode.OK);
    });
  });
});
