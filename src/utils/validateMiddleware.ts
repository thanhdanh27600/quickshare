import { keys } from 'ramda';
import { z } from 'zod';
import { isProduction } from '../types/constants';
import { Theme, Themes } from '../types/og';

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
  theme: z.optional(
    z.string().refine((t) => {
      return keys(Themes).includes(t as Theme);
    }, 'Invalid theme'),
  ),
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

export const validateForwardSchema = z.object({
  ip: z.string({
    required_error: 'IP is required',
  }),
  userAgent: z.string({
    required_error: 'Agent is required',
  }),
  fromClientSide: z.boolean({
    required_error: 'From Client Side is required',
  }),
  hash: z.nullable(
    z
      .string({
        required_error: 'Hash is required',
      })
      .refine((value) => (!value ? true : /^.{3}$/.test(value || '')), 'Wrong hash format'),
  ),
});
export type ForwardSchema = z.infer<typeof validateForwardSchema>;

export const validateMediaSchema = z.object({
  body: z.object({
    url: z.string({
      required_error: 'Url is required',
    }),
  }),
});

export const validateNoteSchema = z.object({
  ip: z.string({
    required_error: 'IP is required',
  }),
  text: z.string({
    description: 'Text is required',
  }),
  hash: z.nullable(
    z
      .string({
        required_error: 'Hash is required',
      })
      .refine((value) => (!value ? true : /^.{3}$/.test(value || '')), 'Wrong hash format'),
  ),
});
export type NoteSchema = z.infer<typeof validateNoteSchema>;

export const validateUpdateNoteSchema = z.object({
  uuid: z.string({
    required_error: 'Uuid is required',
  }),
  text: z.string({
    required_error: 'Text is required',
  }),
});
export type CreateUpdateSchema = z.infer<typeof validateUpdateNoteSchema>;
