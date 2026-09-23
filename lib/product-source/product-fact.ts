import { z } from "zod";

export const productFactSchema = z.object({
  value: z.string().trim().min(1).nullable(),
  evidence: z.string().trim().min(1).nullable(),
});

export type ProductFact = z.infer<typeof productFactSchema>;
