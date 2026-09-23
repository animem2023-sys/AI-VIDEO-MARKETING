import { z } from "zod";

export const productFactSchema = z
  .object({
    value: z.string().trim().min(1).nullable(),
    evidence: z.string().trim().min(1).nullable(),
  })
  .refine(
    (fact) =>
      (fact.value === null && fact.evidence === null) ||
      (fact.value !== null && fact.evidence !== null),
    {
      message: "Fact phải có cả value và evidence, hoặc cả hai đều null.",
      path: ["evidence"],
    },
  );

export type ProductFact = z.infer<typeof productFactSchema>;
