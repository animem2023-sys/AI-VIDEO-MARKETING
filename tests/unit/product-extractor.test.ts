import { describe, expect, it } from "vitest";
import { MockAIProvider } from "@/lib/ai/mock-provider";
import { MockAITextGenerator } from "@/lib/ai/mock-text-generator";
import { ProductExtractionProvider } from "@/lib/ai/product-extraction-provider";
import { extractProduct } from "@/lib/product-source/product-extractor";

describe("extractProduct", () => {
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
      title: "Demo Washing Machine",
    },
  };

  it("returns a validated product extraction", async () => {
    const provider = new MockAIProvider();

    await expect(extractProduct(provider, input)).resolves.toEqual({
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
      specifications: [
        {
          key: "mock",
          value: "mock",
          evidence: "Máy giặt Aqua 8 kg",
        },
      ],
      features: [],
      source: {
        url: "https://example.com/product",
        title: "Demo Washing Machine",
      },
    });
  });

  it("rejects invalid extraction returned by a provider", async () => {
    const invalidProvider = {
      extractProduct: async () => ({
        name: {
          value: "Máy giặt Aqua",
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
          url: "https://example.com/product",
          title: null,
        },
      }),
    };

    await expect(
      extractProduct(invalidProvider, input),
    ).rejects.toThrow();
  });

  it("rejects evidence that does not exist in the source candidates", async () => {
    const provider = {
      extractProduct: async () => ({
        name: {
          value: "Máy giặt Aqua",
          evidence: "Thông tin không có trong nguồn",
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
        source: input.source,
      }),
    };

    await expect(
      extractProduct(provider, input),
    ).rejects.toThrow(
      "Product extraction chứa evidence không hợp lệ: name.evidence",
    );
  });

  it("validates raw JSON from ProductExtractionProvider", async () => {
    const generator = new MockAITextGenerator(
      JSON.stringify({
        name: {
          value: "Máy giặt Aqua",
          evidence: "Máy giặt Aqua 8 kg",
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
        source: input.source,
      }),
    );

    const provider = new ProductExtractionProvider(generator);

    await expect(
      extractProduct(provider, input),
    ).resolves.toEqual({
      name: {
        value: "Máy giặt Aqua",
        evidence: "Máy giặt Aqua 8 kg",
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
      source: input.source,
    });
  });

  it("rejects fabricated evidence from ProductExtractionProvider", async () => {
    const generator = new MockAITextGenerator(
      JSON.stringify({
        name: {
          value: "Máy giặt Aqua",
          evidence: "Giá bán ảo do AI tự tạo",
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
        source: input.source,
      }),
    );

    const provider = new ProductExtractionProvider(generator);

    await expect(
      extractProduct(provider, input),
    ).rejects.toThrow(
      "Product extraction chứa evidence không hợp lệ: name.evidence",
    );
  });
});
