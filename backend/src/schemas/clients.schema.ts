import * as z from "zod";

const phoneField = z
  .union([z.string(), z.null()])
  .transform((val) => (!val || !String(val).trim() ? null : String(val).trim()))
  .nullable()
  .optional();

const idParam = z.preprocess(
  (val) => Number(val),
  z.number().int().positive(),
);

export const createClientSchema = z.object({
  body: z.object({
    name: z
      .string("Name must be a string")
      .trim()
      .min(1, "Name cannot be empty"),
    phone: phoneField,
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateClientSchema = z.object({
  body: z.object({
    name: z
      .string("Name must be a string")
      .trim()
      .min(1, "Name cannot be empty")
      .optional(),
    phone: phoneField,
  }),
  query: z.object({}).optional(),
  params: z.object({
    id: idParam,
  }),
});

export const clientIdParamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    id: idParam,
  }),
});

export const cartBonusPaidSchema = z.object({
  body: z.object({
    bonusPaid: z.boolean("bonusPaid must be a boolean"),
  }),
  query: z.object({}).optional(),
  params: z.object({
    cartId: idParam,
  }),
});
