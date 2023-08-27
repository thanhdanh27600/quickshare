import { Response } from './api';

export type ShortenUrl = Response & {
  url?: string;
  hash?: string;
};

export interface ShareUrlMeta {
  hash?: string;
  ogDomain?: string;
  ogTitle?: string;
  ogDescription?: string;
}
