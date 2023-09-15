import { Media, Note, UrlShortenerHistory } from '@prisma/client';
import { Response } from 'utils/axios';

export type NoteWithMedia = Partial<Note & { UrlShortenerHistory: UrlShortenerHistory | null; Media: Media[] | null }>;

export type NoteRs = Response & {
  note?: NoteWithMedia;
};
