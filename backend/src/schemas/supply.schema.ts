import { z } from "zod";

// export const createSupplySchema = z.object({
//   body: z.object({
//     supplierId: z.number().int().positive().optional(),

//     items: z
//       .array(
//         z.object({
//           code: z.number().int().positive(),
//           quantity: z.number().int().positive(),
//           purchasePrice: z.number().positive(),
//           salePrice: z.number().positive().optional(),
//           minQuantity: z.number().int().nonnegative().optional(),
//         }),
//       )
//       .min(1, "At least one item is required"),
//   }),

//   query: z.object({}).optional(),
//   params: z.object({}).optional(),
// });

export const createSupplyItemSchema = z.object({
  body: z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().nonnegative(),
    purchasePrice: z.number().nonnegative(),
    salePrice: z.number().nonnegative(),
    minQuantity: z.number().int().nonnegative().optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
export const updateSupplyItemSchema = z.object({
  body: z.object({
    quantity: z.number().int().nonnegative().optional(),
    purchasePrice: z.number().nonnegative().optional(),
    salePrice: z.number().nonnegative().optional(),
    minQuantity: z.number().int().nonnegative().optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
