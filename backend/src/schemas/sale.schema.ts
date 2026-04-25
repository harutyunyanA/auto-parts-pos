import * as z from "zod";

export const cartItemSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),

  params: z.object({
    cartId: z.preprocess((val) => Number(val), z.number().int().positive()),
    code: z.preprocess((val) => Number(val), z.number().int().positive()),
  }),
});

export const getProductHistorySchema = z.object({
  body: z.object({
    code: z
      .preprocess((val) => Number(val), z.number().int().positive())
      .optional(),
    oem: z.string().optional(),
  }),
  query: z.object({}),
  params: z.object({}).optional(),
});
