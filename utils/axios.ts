import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { Response } from 'types/api';
import { z } from 'zod';
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
  require('./loggerServer').error(error);
  if (error instanceof z.ZodError) {
    return res.status(HttpStatusCode.BAD_REQUEST).json(error.issues);
  }
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
