import { describe, expect, it } from "vitest";
import { productExtractionSchema } from "@/lib/product-source/extraction-schema";
import { validateProductEvidence } from "@/lib/product-source/evidence-validator";

describe("validateProductEvidence", () => {
  const sourceUrl = "https://example.com/product";

  const baseExtraction = productExtractionSchema.parse({
    name: {
      value: "Máy giặt Aqua",
      evidence: "Máy giặt Aqua",
    },
    brand: {
      value: null,
      evidence: null,
    },
    model: {
      value: null,
      evidence: null,
    },
    originalPrice: {
      value: null,
      evidence: null,
    },
    salePrice: {
      value: null,
      evidence: null,
    },
    warranty: {
      value: null,
      evidence: null,
    },
    specifications: [],
    features: [],
    source: {
      url: sourceUrl,
      title: "Demo",
    },
  });

  it("accepts evidence that exists in candidates", () => {
    const findings = validateProductEvidence(baseExtraction, [
      {
        text: "Máy giặt Aqua",
        sourceUrl,
        context: null,
      },
    ]);

    expect(findings).toEqual([]);
  });

  it("rejects evidence that does not exist in candidates", () => {
    const findings = validateProductEvidence(baseExtraction, [
      {
        text: "Máy giặt Aqua 8 kg",
        sourceUrl,
        context: null,
      },
    ]);

    expect(findings).toEqual([
      {
        path: "name.evidence",
        message: "Evidence không tồn tại trong Evidence Candidates.",
      },
    ]);
  });

  it("allows extraction with no evidence", () => {
    const extraction = productExtractionSchema.parse({
      name: {
        value: null,
        evidence: null,
      },
      brand: {
        value: null,
        evidence: null,
      },
      model: {
        value: null,
        evidence: null,
      },
      originalPrice: {
        value: null,
        evidence: null,
      },
      salePrice: {
        value: null,
        evidence: null,
      },
      warranty: {
        value: null,
        evidence: null,
      },
      specifications: [],
      features: [],
      source: {
        url: sourceUrl,
        title: null,
      },
    });

    expect(validateProductEvidence(extraction, [])).toEqual([]);
  });
});
