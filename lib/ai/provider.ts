import type { EvidenceCandidate } from "@/lib/product-source/evidence-candidate";

export type StoryRequest = {
  productName: string | null;
  objective: string | null;
};

export type PromptRequest = {
  story: string;
  videoNumber: number;
};

export type PromptValidation = {
  passed: boolean;
  findings: string[];
};

export type ProductExtractionRequest = {
  evidenceCandidates: EvidenceCandidate[];
  source: {
    url: string;
    title: string | null;
  };
};

export interface AIProvider {
  generateStory(input: StoryRequest): Promise<string>;
  generatePrompt(input: PromptRequest): Promise<string>;
  validatePrompt(prompt: string): Promise<PromptValidation>;
  extractProduct(
    input: ProductExtractionRequest,
  ): Promise<unknown>;
}
