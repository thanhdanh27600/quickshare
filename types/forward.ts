import { UrlShortenerHistory } from '@prisma/client';
import { Response } from './api';

export type Forward = Response & {
  history?: UrlShortenerHistory | null;
};
