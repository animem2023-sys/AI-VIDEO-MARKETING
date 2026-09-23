import { evidenceCandidateSchema, type EvidenceCandidate } from "./evidence-candidate";

const MIN_SEGMENT_LENGTH = 8;

export function extractEvidenceCandidates(
  text: string,
  sourceUrl: string,
): EvidenceCandidate[] {
  const segments = text
    .split(/(?:\n|[.!?]\s+|(?<=\d)\s*[|•]\s*)/)
    .map((segment) =>
      segment
        .replace(/\s+/g, " ")
        .trim()
        .replace(/[.!?]+$/, "")
        .trim(),
    )
    .filter((segment) => segment.length >= MIN_SEGMENT_LENGTH);

  const uniqueSegments = Array.from(new Set(segments));

  return uniqueSegments.map((segment) =>
    evidenceCandidateSchema.parse({
      text: segment,
      sourceUrl,
      context: null,
    }),
  );
}
