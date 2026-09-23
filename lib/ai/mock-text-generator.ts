import type {
  AITextGenerationRequest,
  AITextGenerator,
} from "./text-generator";

export class MockAITextGenerator implements AITextGenerator {
  lastRequest: AITextGenerationRequest | null = null;

  constructor(private readonly response: string) {}

  async generateText(
    input: AITextGenerationRequest,
  ): Promise<string> {
    this.lastRequest = input;
    return this.response;
  }
}
