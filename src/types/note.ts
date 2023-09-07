import { Note } from '@prisma/client';
import { Response } from './api';

export type NoteRs = Response & Partial<Note>;
