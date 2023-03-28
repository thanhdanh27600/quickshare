import { NextApiResponse } from 'next';
import { Response } from 'types/api';
import HttpStatusCode from './statusCode';

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
