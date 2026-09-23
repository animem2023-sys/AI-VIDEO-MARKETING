import type {
  AIProvider,
  ProductExtractionRequest,
  PromptRequest,
  PromptValidation,
  StoryRequest,
} from "./provider";
import type { ProductExtraction } from "@/lib/product-source/extraction-schema";

export class MockAIProvider implements AIProvider {
  async generateStory(input: StoryRequest) {
    return `Mock story for ${input.productName ?? "unknown product"}.`;
  }

  async generatePrompt(input: PromptRequest) {
    return `Mock prompt ${input.videoNumber}: ${input.story}`;
  }

  async validatePrompt(_prompt: string): Promise<PromptValidation> {
    return { passed: true, findings: [] };
  }

  async extractProduct(
    input: ProductExtractionRequest,
  ): Promise<ProductExtraction> {
    const firstEvidence = input.evidenceCandidates[0]?.text ?? null;

    return {
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
      specifications: firstEvidence
        ? [
            {
              key: "mock",
              value: "mock",
              evidence: firstEvidence,
            },
          ]
        : [],
      features: [],
      source: input.source,
    };
  }
}
