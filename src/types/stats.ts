import { UrlForwardMeta, UrlShortenerHistory, UrlShortenerRecord } from '@prisma/client';
import { Response } from './api';

export type UrlHistoryWithMeta = UrlShortenerHistory & { UrlForwardMeta?: UrlForwardMeta[] };

export type Stats = Response & {
  record?: UrlShortenerRecord | null;
  history?: UrlHistoryWithMeta[] | null;
};
