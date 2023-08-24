import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { Response } from '../types/api';
import { isProduction } from '../types/constants';
import HttpStatusCode from './statusCode';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export function errorHandler<T extends Response>(
  res: NextApiResponse<T>,
  code: HttpStatusCode = HttpStatusCode.UNAUTHORIZED,
) {
  switch (code) {
    case HttpStatusCode.UNAUTHORIZED:
      return res.status(HttpStatusCode.UNAUTHORIZED).json({ errorMessage: 'UNAUTHORIZED' } as any);
  }
  return res.status(HttpStatusCode.NOT_FOUND).json({ errorMessage: 'Not found' } as any);
}

export const catchErrorHandler = (res: NextApiResponse, error?: any) => {
  if (!isProduction) console.error('[Error]', error);
  if (error instanceof z.ZodError) {
    require('./loggerServer').warn(error);
    return res.status(HttpStatusCode.BAD_REQUEST).json(error.issues);
  }
  require('./loggerServer').error(error);
  return res
    .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
    .json({ errorMessage: error.message || 'Something when wrong.' });
};

export const api =
  <T extends Response = any>(f: NextApiHandler<T>, allowMethods?: HttpMethod[]) =>
  async (req: NextApiRequest, res: NextApiResponse<T | Response>) => {
    require('./loggerServer').info(req);
    if (allowMethods && !allowMethods.includes(req.method as HttpMethod)) {
      return res.status(HttpStatusCode.METHOD_NOT_ALLOWED).json({ errorMessage: 'Method Not Allowed' });
    }
    try {
      await f(req, res);
    } catch (error: any) {
      return catchErrorHandler(res, error);
    }
  };

export const successHandler = <T = any>(res: NextApiResponse<T>, data: T) => {
  return res.status(HttpStatusCode.OK).json(data);
};

export const badRequest = (res: NextApiResponse, message?: string) =>
  res.status(HttpStatusCode.BAD_REQUEST).send({
    errorMessage: message ?? 'You have submitted wrong data, please try again',
    errorCode: 'BAD_REQUEST',
  });
