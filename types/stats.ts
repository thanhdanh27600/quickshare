import { UrlForwardMeta, UrlShortenerHistory, UrlShortenerRecord } from '@prisma/client';
import { Response } from './api';

export type Stats = Response & {
  record?: UrlShortenerRecord | null;
  history?: (UrlShortenerHistory & { urlForwardMeta?: UrlForwardMeta[] })[] | null;
};
