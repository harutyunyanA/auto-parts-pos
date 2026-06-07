import * as z from "zod";

export const bulkDiscountSchema = z.object({
  body: z.object({
    rules: z
      .array(
        z
          .object({
            minProfit: z
              .number("minProfit must be a number")
              .min(0, "minProfit cannot be negative"),
            maxProfit: z
              .number("maxProfit must be a number")
              .min(0, "maxProfit cannot be negative")
              .nullable(),
            discount: z
              .number("discount must be a number")
              .min(0, "discount cannot be negative")
              .max(100, "discount cannot exceed 100%"),
          })
          .refine((r) => r.maxProfit === null || r.minProfit <= r.maxProfit, {
            message: "minProfit must be <= maxProfit",
          }),
      )
      .min(1, "At least one rule is required"),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
