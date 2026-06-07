import * as z from "zod";

export const getProductQuerySchema = z.object({
  body: z.object({}).optional(),
  query: z.object({
    code: z.preprocess((val) => Number(val), z.number().int().positive()),
    source: z.preprocess(
      (val) => (typeof val === "string" ? val.trim() : val),
      z.enum(["soviet", "import"]),
    ),
  }),
  params: z.object({}).optional(),
});

export const addProductSchema = z.object({
  body: z.object({
    name: z
      .string("Name must be a string")
      .trim()
      .min(1, "Name cannot be empty"),

    type: z
      .union([z.string(), z.number()])
      .transform((val) => String(val).trim())
      .default("-"),

    code: z
      .number("code must be a number")
      .int("Code must be an integer")
      .nonnegative("code must be non-negative")
      .optional(),

    oem: z
      .union([z.string(), z.number(), z.null()])
      .transform((val) =>
        !val || !String(val).trim() ? null : String(val).trim(),
      )
      .nullable()
      .default(null),

    WXQP: z
      .union([z.string(), z.number(), z.null()])
      .transform((val) =>
        !val || !String(val).trim() ? null : String(val).trim(),
      )
      .nullable()
      .default(null),

    // source: z.enum(["soviet", "import"], "Source must be 'soviet' or 'import'"),

    quantity: z
      .number("Quantity must be a number")
      .int("Quantity must be an integer")
      .nonnegative("Quantity must be non-negative"),

    minimum_quantity: z
      .number("Minimum quantity must be a number")
      .int("Minimum quantity must be an integer")
      .nonnegative("Minimum quantity must be non-negative")
      .nullable()
      .default(null),

    purchase_price: z
      .number("Purchase price must be a number")
      .nonnegative("Purchase price must be non-negative"),

    sale_price: z
      .number("Sale price must be a number")
      .nonnegative("Sale price must be non-negative"),

    weight: z
      .number("Weight must be a number")
      .nonnegative("Weight must be non-negative")
      .nullable()
      .optional(),

    supplier_id: z.number("Supplier ID must be a number").nullable().optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).optional(),
    type: z
      .union([z.string(), z.number()])
      .transform((val) => String(val).trim())
      .optional(),
    code: z.number().int().nonnegative().optional(),
    oem: z
      .union([z.string(), z.number(), z.null()])
      .transform((val) =>
        !val || !String(val).trim() ? null : String(val).trim(),
      )
      .nullable()
      .optional(),
    WXQP: z
      .union([z.string(), z.number(), z.null()])
      .transform((val) =>
        !val || !String(val).trim() ? null : String(val).trim(),
      )
      .nullable()
      .optional(),
    quantity: z.number().int().nonnegative().optional(),
    minimum_quantity: z.number().int().nonnegative().nullable().optional(),
    purchase_price: z.number().nonnegative().optional(),
    sale_price: z.number().nonnegative().optional(),
    discount: z
      .number("Discount must be a number")
      .min(0, "Discount cannot be negative")
      .max(100, "Discount cannot exceed 100%")
      .optional(),
    weight: z.number().nonnegative().nullable().optional(),
    supplier_id: z.number().nullable().optional(),
  }),
  query: z.object({
    code: z.preprocess((val) => Number(val), z.number().int().positive()),
    source: z.preprocess(
      (val) => (typeof val === "string" ? val.trim() : val),
      z.enum(["soviet", "import"]),
    ),
  }),
  params: z.object({}).optional(),
});

export const paginationQuerySchema = z.object({
  body: z.object({}).optional(),
  query: z.object({
    oem: z.string().optional(),
    WXQP: z.string().optional(),
    code: z
      .preprocess(
        (val) => (val === "" || val === undefined ? undefined : Number(val)),
        z.number().int().positive().optional(),
      )
      .optional(),
    type: z.string().optional(),
    name: z.string().optional(),
    page: z
      .preprocess((val) => Number(val), z.number().int().positive())
      .optional()
      .default(1),
    limit: z
      .preprocess((val) => Number(val), z.number().int().positive())
      .optional()
      .default(100),
  }),
  params: z.object({}).optional(),
});

export const getProductHistorySchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    code: z
      .preprocess((val) => Number(val), z.number().int().positive())
      .optional(),
    oem: z.string().optional(),
    from: z.string(),
    to: z.string(),
  }),
});
