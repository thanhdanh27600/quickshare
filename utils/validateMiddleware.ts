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
    // hash: z.string({
    //   required_error: 'Hash is required',
    // }),
    ip: z.string({
      required_error: 'IP is required',
    }),
  }),
});

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
