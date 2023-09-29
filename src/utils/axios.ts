import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { isDebug, isProduction, isTest } from '../types/constants';
import HttpStatusCode from './statusCode';

export type Response =
  | Partial<z.ZodIssue>[]
  | {
      errorMessage?: string;
      errorCode?: string;
    };

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export type ErrorResponse = { code?: HttpStatusCode; mesesage?: string };

export function errorHandler<T extends Response>(res: NextApiResponse<T>, error?: ErrorResponse) {
  const { code, mesesage } = error || { code: HttpStatusCode.UNAUTHORIZED, mesesage: '' };
  switch (code) {
    case HttpStatusCode.UNAUTHORIZED:
      return res.status(HttpStatusCode.UNAUTHORIZED).json({ errorMessage: mesesage || 'UNAUTHORIZED' } as any);
    case HttpStatusCode.NOT_FOUND:
    default:
      return res.status(HttpStatusCode.NOT_FOUND).json({ errorMessage: mesesage || 'Request not found' } as any);
  }
}

export const catchErrorHandler = (res: NextApiResponse, error?: any) => {
  if (!isProduction && !isTest) console.error('catchErrorHandler [Error]', error);
  if (error instanceof z.ZodError) {
    // require('./loggerServer').warn(error);
    if (isProduction) return badRequest(res);
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
    if (isDebug) require('./loggerServer').info(req);
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
