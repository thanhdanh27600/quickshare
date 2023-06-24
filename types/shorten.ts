import { Response } from './api';

export type ShortenUrl = Response & {
  url?: string;
  hash?: string;
};
