import type {
  AIProvider,
  ProductExtractionRequest,
} from "@/lib/ai/provider";
import type { ProductExtraction } from "./extraction-schema";
import { productExtractionSchema } from "./extraction-schema";
import { validateProductEvidence } from "./evidence-validator";

export async function extractProduct(
  provider: Pick<AIProvider, "extractProduct">,
  input: ProductExtractionRequest,
): Promise<ProductExtraction> {
  const result = await provider.extractProduct(input);
  const extraction = productExtractionSchema.parse(result);
  if (
    extraction.source.url !== input.source.url ||
    extraction.source.title !== input.source.title
  ) {
    throw new Error(
      "Product extraction chứa source không khớp với server source",
    );
  }
  const evidenceFindings = validateProductEvidence(
    extraction,
    input.evidenceCandidates,
  );

  if (evidenceFindings.length > 0) {
    throw new Error(
      `Product extraction chứa evidence không hợp lệ: ${evidenceFindings
        .map((finding) => finding.path)
        .join(", ")}`,
    );
  }

  return extraction;
}
