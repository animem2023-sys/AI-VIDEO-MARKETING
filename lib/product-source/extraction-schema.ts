import { z } from "zod";

const nullableString = z.string().trim().min(1).nullable();

export const productExtractionSchema = z.object({
  name: nullableString,
  brand: nullableString,
  model: nullableString,
  originalPrice: nullableString,
  salePrice: nullableString,
  warranty: nullableString,

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
      description: nullableString,
      evidence: z.string().trim().min(1),
    }),
  ),

  source: z.object({
    url: z.string().url(),
    title: nullableString,
  }),
});

export type ProductExtraction = z.infer<typeof productExtractionSchema>;
