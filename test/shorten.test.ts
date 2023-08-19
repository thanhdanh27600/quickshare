import { createMocks } from 'node-mocks-http';
import * as controller from '../controllers';
import { redis } from '../redis/client';
import { NUM_CHARACTER_HASH } from '../types/constants';
import HttpStatusCode from '../utils/statusCode';

const ip = '0.0.0.0';
const key = `limit:${ip}`;

describe('Test /api/shorten...', () => {
  describe('Shortened URL', () => {
    it('Should throw error with wrong method', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {},
      });
      await controller.shorten.handler(req, res);

      expect(res._getStatusCode()).toBe(HttpStatusCode.METHOD_NOT_ALLOWED);
    });

    it('Should throw error with missing query', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: {},
      });
      await controller.shorten.handler(req, res);

      expect(res._getStatusCode()).toBe(HttpStatusCode.BAD_REQUEST);
    });

    it('Should throw error with url not encoded', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: { url: 'https://example.com' },
      });
      await controller.shorten.handler(req, res);
      expect(res._getStatusCode()).toBe(HttpStatusCode.BAD_REQUEST);
      expect(res._getData()).toEqual({
        errorMessage: 'Wrong URL format, please try again',
        errorCode: 'INVALID_URL',
      });
    });

    it('Should throw error with url not encoded', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: { url: 'U2FsdGVkX19lPT7tc2v+EAQ+ q+S+QmgedQXJPLAhhjZDskrGAPv+kdWEm624npUtHaEGmCTcJHbFaYeZAv+FQw==' },
      });
      await controller.shorten.handler(req, res);
      expect(res._getStatusCode()).toBe(HttpStatusCode.BAD_REQUEST);
      expect(res._getData()).toEqual({
        errorMessage: 'Wrong URL format, please try again',
        errorCode: 'INVALID_URL',
      });
    });

    it('Should throw error when reached limit request', async () => {
      await redis.expire(key, 0);
      const requests = [];

      for (let i = 0; i < 5; i++) {
        let { req, res } = createMocks({
          method: 'GET',
          query: {
            url: 'U2FsdGVkX19lPT7tc2v+EAQ+q+S+QmgedQXJPLAhhjZDskrGAPv+kdWEm624npUtHaEGmCTcJHbFaYeZAv+FQw==',
          },
          headers: { 'x-forwarded-for': ip },
        });
        requests.push(controller.shorten.handler(req, res));
      }
      await Promise.all(requests);
      const { req, res } = createMocks({
        method: 'GET',
        query: { url: 'U2FsdGVkX19lPT7tc2v+EAQ+q+S+QmgedQXJPLAhhjZDskrGAPv+kdWEm624npUtHaEGmCTcJHbFaYeZAv+FQw==' },
        headers: { 'x-forwarded-for': ip },
      });
      await controller.shorten.handler(req, res);
      expect(res._getStatusCode()).toBe(HttpStatusCode.TOO_MANY_REQUESTS);
    });

    it('Should shortened URL OK', async () => {
      await redis.expire(key, 0);

      const { req, res } = createMocks({
        method: 'GET',
        query: { url: 'U2FsdGVkX19lPT7tc2v+EAQ+q+S+QmgedQXJPLAhhjZDskrGAPv+kdWEm624npUtHaEGmCTcJHbFaYeZAv+FQw==' },
        headers: { 'x-forwarded-for': ip },
      });
      await controller.shorten.handler(req, res);
      expect(res._getStatusCode()).toBe(HttpStatusCode.OK);
      const data = JSON.parse(res._getData());
      expect(data['url']).toBe('https://example.com');
      expect(data['hash'].length).toBe(NUM_CHARACTER_HASH);
    });
  });
});
