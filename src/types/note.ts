import { Note } from '@prisma/client';
import { Response } from 'utils/axios';

export type NoteRs = Response & { note?: Partial<Note> };
