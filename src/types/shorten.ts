import { UrlShortenerHistory } from '@prisma/client';
import { Response } from './api';

export type ShortenUrl = Response & Partial<UrlShortenerHistory>;
