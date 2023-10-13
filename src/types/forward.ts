import { Note, UrlShortenerHistory } from '@prisma/client';
import { Response } from 'utils/axios';

export type Forward = Response & {
  history?: Partial<UrlShortenerHistory> | null;
  note?: Partial<Note> | null;
  token?: string;
};

export type ForwardMeta = {
  hash: string;
  ip: string;
  userAgent: string;
  fromClientSide: boolean;
  countryCode: string;
  updatedAt: Date;
};
