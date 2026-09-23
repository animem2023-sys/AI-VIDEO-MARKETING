import { z } from "zod";
import { productFactSchema } from "./product-fact";

export const productExtractionSchema = z.object({
  name: productFactSchema,
  brand: productFactSchema,
  model: productFactSchema,
  originalPrice: productFactSchema,
  salePrice: productFactSchema,
  warranty: productFactSchema,

  specifications: z.array(
    z.object({
      key: z.string().trim().min(1),
      value: z.string().trim().min(1),
      evidence: z.string().trim().min(1),
    }),
  ),

  features: z.array(
    z.object({
      name: z.string().trim().min(1),
      description: z.string().trim().min(1).nullable(),
      evidence: z.string().trim().min(1),
    }),
  ),

  source: z.object({
    url: z.string().url(),
    title: z.string().trim().min(1).nullable(),
  }),
});

export type ProductExtraction = z.infer<typeof productExtractionSchema>;
