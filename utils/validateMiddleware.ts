import { isProduction } from 'types/constants';
import { z } from 'zod';

export const validateShortenSchema = z.object({
  query: z.object({
    ip: z.string({
      required_error: 'IP is required',
    }),
    url: z.string({
      required_error: 'Url is required',
    }),
  }),
});

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
        required_error: 'Text is required',
      })
      .min(5)
      .max(100),
  }),
});
