import { UrlShortenerHistory } from '@prisma/client';
import { Response } from 'utils/axios';

export type ShortenUrl = Response & Partial<UrlShortenerHistory>;
