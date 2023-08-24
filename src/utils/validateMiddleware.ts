import { z } from 'zod';
import { isProduction } from '../types/constants';

export const validateShortenSchema = z.object({
  query: z.object({
    ip: z.string({
      required_error: 'IP is required',
    }),
    url: z
      .string({
        description: 'Url is required',
      })
      .nullable(),
    hash: z.nullable(
      z
        .string({
          required_error: 'Hash is required',
        })
        .refine((value) => (!value ? true : /^.{3}$/.test(value || '')), 'Wrong hash format'),
    ),
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
