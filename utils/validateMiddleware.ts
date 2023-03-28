import { isProduction } from 'types/constants';
import { z } from 'zod';

export const validateOgSchema = z.object({
  query: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
  }),
});

export const validateStatsSchema = z.object({
  query: z.object({
    ...(isProduction
      ? {
          h: z.string({
            required_error: 'Hash is required',
          }),
        }
      : null),
    ip: z.string({
      required_error: 'IP is required',
    }),
  }),
});

export const validateStatsTokenSchema = z.object({ h: z.string(), p: z.string() });

export const validateQrSchema = z.object({
  query: z.object({
    text: z
      .string({
        required_error: 'text is required',
      })
      .min(5)
      .max(100),
  }),
});
