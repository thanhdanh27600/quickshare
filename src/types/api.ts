import { z } from 'zod';

export type Response =
  | Partial<z.ZodIssue>[]
  | {
      errorMessage?: string;
      errorCode?: string;
    };
