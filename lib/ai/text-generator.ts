export type AITextGenerationRequest = {
  prompt: string;
};

export interface AITextGenerator {
  generateText(input: AITextGenerationRequest): Promise<string>;
}
