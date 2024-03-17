import { File, Media, UrlShortenerHistory } from '@prisma/client';
import { Response } from 'utils/axios';

export type FileWithData = Partial<File & { Media: Partial<Media>; UrlShortenerHistory: UrlShortenerHistory | null }>;

export type FileRs = Response & {
  file?: FileWithData;
};
