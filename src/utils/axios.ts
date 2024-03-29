import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { Session, getServerSession } from 'next-auth';
import { z } from 'zod';
import { allowedDomains, isDebug, isProduction, isTest } from '../types/constants';
import HttpStatusCode from './statusCode';

export type Response =
  | Partial<z.ZodIssue>[]
  | {
      errorMessage?: string;
      errorCode?: string | number;
    };

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export type ErrorResponse = { code?: HttpStatusCode; mesesage?: string };

export function errorHandler<T extends Response>(res: NextApiResponse<T>, error?: ErrorResponse) {
  const { code, mesesage } = error || { code: HttpStatusCode.UNAUTHORIZED, mesesage: '' };
  switch (code) {
    case HttpStatusCode.NOT_FOUND:
      return res.status(HttpStatusCode.NOT_FOUND).json({ errorMessage: mesesage || 'Request not found' } as any);
    case HttpStatusCode.UNAUTHORIZED:
    default:
      return res.status(HttpStatusCode.UNAUTHORIZED).json({ errorMessage: mesesage || 'UNAUTHORIZED' } as any);
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
  <T extends Response = any>(f: NextApiHandler<T & { session?: Session }>, allowMethods?: HttpMethod[]) =>
  async (req: NextApiRequest, res: NextApiResponse<T | Response>) => {
    if (isDebug) require('./loggerServer').info(req);
    if (allowMethods && !allowMethods.includes(req.method as HttpMethod)) {
      return res.status(HttpStatusCode.METHOD_NOT_ALLOWED).json({ errorMessage: 'Method Not Allowed' });
    }
    try {
      if (!isTest) {
        const authOptions = (await import('../pages/api/auth/[...nextauth]')).authOptions;
        const session = await getServerSession(req, res, authOptions);
        req.session = session;
      }
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

export const originGuard = (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.headers.origin || !allowedDomains.includes(req.headers.origin)) {
    return res.status(HttpStatusCode.FORBIDDEN).json({ errorMessage: 'Origin Not Allowed' });
  }
};
