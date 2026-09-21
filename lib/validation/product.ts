import { z } from "zod";
export const productStatusSchema = z.enum(["DRAFT", "EXTRACTED", "VERIFIED", "LOCKED"]);
export const productFeatureSchema = z.object({ label: z.string().min(1), verified: z.boolean().default(false) });
export const productSpecificationSchema = z.object({ name: z.string().min(1), value: z.string().nullable(), unit: z.string().nullable(), verified: z.boolean().default(false) });
export const productSchema = z.object({ name: z.string().nullable(), brand: z.string().nullable(), model: z.string().nullable(), originalPrice: z.string().nullable(), salePrice: z.string().nullable(), warranty: z.string().nullable(), sourceUrl: z.string().url().nullable(), status: productStatusSchema.default("DRAFT"), specifications: z.array(productSpecificationSchema).default([]), features: z.array(productFeatureSchema).default([]), });
export type ProductInput = z.infer<typeof productSchema>;
