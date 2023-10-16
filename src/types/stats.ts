import { UrlForwardMeta, UrlShortenerHistory, UrlShortenerRecord } from '@prisma/client';
import { Response } from 'utils/axios';

export type UrlHistoryWithMeta = UrlShortenerHistory & { UrlForwardMeta?: UrlForwardMeta[] };

export type Stats = Response & {
  record?: (UrlShortenerRecord & { history?: { url: string; hash: string }[] }) | null;
  history?: UrlHistoryWithMeta[] | null;
};

export interface HistoryGeoItem {
  _count: {
    countryCode: number;
  };
  countryCode: string | null;
}

export type StatsGeo = Response & {
  history?: HistoryGeoItem[];
};
