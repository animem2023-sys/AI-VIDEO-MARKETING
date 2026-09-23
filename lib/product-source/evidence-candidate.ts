import { z } from "zod";

export const evidenceCandidateSchema = z.object({
  text: z.string().trim().min(1),
  sourceUrl: z.string().url(),
  context: z.string().trim().min(1).nullable(),
});

export type EvidenceCandidate = z.infer<typeof evidenceCandidateSchema>;
