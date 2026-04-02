import * as z from "zod";

export const saleItemSchema = z.object({
  body: z.object({
    code: z
      .number()
      .int("Code must be integer")
      .positive("Code must be positive"),
    quantity: z.number("Quantity of a product must be number").default(0),
    priceAtSale: z.number().int("Sale price must be integer").optional(),
  }),
  query: z
    .object({
      // code: z.preprocess((val) => Number(val), z.number().int().positive()),
      // source: z.preprocess(
      //   (val) => (typeof val === "string" ? val.trim() : val),
      //   z.enum(["soviet", "import"]),
      // ),
    })
    .optional(),
  params: z.object({}).optional(),
});
