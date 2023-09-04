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

export const validateUpdateShortenSchema = z.object({
  locale: z.string({
    required_error: 'Locale is required',
  }),
  hash: z
    .string({
      required_error: 'Hash is required',
    })
    .refine((value) => (!value ? true : /^.{3}$/.test(value || '')), 'Wrong hash format'),
  ogTitle: z.optional(
    z.string({
      required_error: 'Title is required',
    }),
  ),
  ogDescription: z.optional(z.string({})),
  ogImgSrc: z.optional(z.string({})),
  ogImgPublicId: z.optional(z.string({})),
  mediaId: z.optional(
    z.number({
      invalid_type_error: 'Must be a number',
    }),
  ),
  // ogImgSrc: z.string({
  //   required_error: 'Description is required',
  // }),
  // ogDomain: z.string({
  //   required_error: 'Description is required',
  // }),
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

export const validateMediaSchema = z.object({
  body: z.object({
    url: z.string({
      required_error: 'Url is required',
    }),
  }),
});
