import type { EvidenceCandidate } from "./evidence-candidate";
import type { ProductExtraction } from "./extraction-schema";

export type EvidenceValidationFinding = {
  path: string;
  message: string;
};

export function validateProductEvidence(
  extraction: ProductExtraction,
  evidenceCandidates: EvidenceCandidate[],
): EvidenceValidationFinding[] {
  const findings: EvidenceValidationFinding[] = [];

  const checkEvidence = (path: string, evidence: string | null) => {
    if (evidence === null) {
      return;
    }

    const matchingCandidates = evidenceCandidates.filter(
      (candidate) => candidate.text === evidence,
    );

    if (matchingCandidates.length === 0) {
      findings.push({
        path,
        message:
          "Evidence kh\u00f4ng t\u1ed3n t\u1ea1i trong Evidence Candidates.",
      });
      return;
    }

    const hasMatchingSource = matchingCandidates.some(
      (candidate) => candidate.sourceUrl === extraction.source.url,
    );

    if (!hasMatchingSource) {
      findings.push({
        path,
        message:
          "Evidence thu\u1ed9c ngu\u1ed3n URL kh\u00f4ng kh\u1edbp v\u1edbi Server Source.",
      });
    }
  };

  checkEvidence("name.evidence", extraction.name.evidence);
  checkEvidence("brand.evidence", extraction.brand.evidence);
  checkEvidence("model.evidence", extraction.model.evidence);
  checkEvidence("originalPrice.evidence", extraction.originalPrice.evidence);
  checkEvidence("salePrice.evidence", extraction.salePrice.evidence);
  checkEvidence("warranty.evidence", extraction.warranty.evidence);

  extraction.specifications.forEach((specification, index) => {
    checkEvidence(
      `specifications.${index}.evidence`,
      specification.evidence,
    );
  });

  extraction.features.forEach((feature, index) => {
    checkEvidence(`features.${index}.evidence`, feature.evidence);
  });

  return findings;
}
