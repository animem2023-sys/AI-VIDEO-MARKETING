import type { Character } from "@/lib/characters/schema";
import type { EvidenceCandidate } from "@/lib/product-source/evidence-candidate";
import type { VerifiedProductContext } from "@/lib/product-source/verified-context";

export type StoryRequest = {
  product: VerifiedProductContext;
  character: Character;
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
