import { describe, expect, it } from "vitest";
import { MockAITextGenerator } from "@/lib/ai/mock-text-generator";
import { ProductExtractionProvider } from "@/lib/ai/product-extraction-provider";

describe("ProductExtractionProvider", () => {
  const input = {
    evidenceCandidates: [
      {
        text: "Máy giặt Aqua 8 kg",
        sourceUrl: "https://example.com/product",
        context: null,
      },
    ],
    source: {
      url: "https://example.com/product",
      title: "Máy giặt Aqua",
    },
  };

  it("builds the extraction prompt and parses valid JSON", async () => {
    const generator = new MockAITextGenerator(
      '{"name":{"value":"Máy giặt Aqua","evidence":"Máy giặt Aqua 8 kg"}}',
    );

    const provider = new ProductExtractionProvider(generator);

    const result = await provider.extractProduct(input);

    expect(result).toEqual({
      name: {
        value: "Máy giặt Aqua",
        evidence: "Máy giặt Aqua 8 kg",
      },
    });

    expect(generator.lastRequest?.prompt).toContain(
      "Chỉ trích xuất thông tin sản phẩm được hỗ trợ trực tiếp bởi Evidence Candidates.",
    );

    expect(generator.lastRequest?.prompt).toContain(
      "Máy giặt Aqua 8 kg",
    );
  });

  it("rejects a non-JSON AI response", async () => {
    const generator = new MockAITextGenerator(
      "Đây không phải JSON",
    );

    const provider = new ProductExtractionProvider(generator);

    await expect(
      provider.extractProduct(input),
    ).rejects.toThrow(
      "AI product extraction trả về dữ liệu không phải JSON hợp lệ.",
    );
  });
});
