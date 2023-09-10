import { Note, UrlShortenerHistory } from '@prisma/client';
import { Lookup } from 'geoip-country';
import { Response } from './api';

export type Forward = Response & {
  history?: Partial<UrlShortenerHistory> | null;
  note?: Partial<Note> | null;
};

export type ForwardMeta = { hash: string; ip: string; userAgent: string; fromClientSide: boolean; lookupIp?: Lookup };
