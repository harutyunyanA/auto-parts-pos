import * as z from "zod";

const phoneField = z
  .union([z.string(), z.null()])
  .transform((val) => (!val || !String(val).trim() ? null : String(val).trim()))
  .nullable()
  .optional();

export const createSupplierSchema = z.object({
  body: z.object({
    name: z.string("Name must be a string").trim().min(1, "Name cannot be empty"),
    phone: phoneField,
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateSupplierSchema = z.object({
  body: z.object({
    name: z.string("Name must be a string").trim().min(1, "Name cannot be empty").optional(),
    phone: phoneField,
  }),
  query: z.object({}).optional(),
  params: z.object({
    id: z.preprocess((val) => Number(val), z.number().int().positive()),
  }),
});

export const supplierIdParamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    id: z.preprocess((val) => Number(val), z.number().int().positive()),
  }),
});
