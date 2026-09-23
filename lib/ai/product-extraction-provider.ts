import type { ProductExtractionRequest } from "./provider";
import type { AITextGenerator } from "./text-generator";
import { buildProductExtractionPrompt } from "./product-extraction-prompt";

export class ProductExtractionProvider {
  constructor(private readonly textGenerator: AITextGenerator) {}

  async extractProduct(
    input: ProductExtractionRequest,
  ): Promise<unknown> {
    const prompt = buildProductExtractionPrompt(input);

    const response = await this.textGenerator.generateText({
      prompt,
    });

    try {
      return JSON.parse(response) as unknown;
    } catch {
      throw new Error(
        "AI product extraction trả về dữ liệu không phải JSON hợp lệ.",
      );
    }
  }
}
