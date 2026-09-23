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
  const evidenceTexts = new Set(
    evidenceCandidates.map((candidate) => candidate.text),
  );

  const findings: EvidenceValidationFinding[] = [];

  const checkEvidence = (path: string, evidence: string | null) => {
    if (evidence !== null && !evidenceTexts.has(evidence)) {
      findings.push({
        path,
        message: "Evidence không tồn tại trong Evidence Candidates.",
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
