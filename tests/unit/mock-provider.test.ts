import { describe, expect, it } from "vitest";
import { MockAIProvider } from "@/lib/ai/mock-provider";
import { createVerifiedProductContext } from "@/lib/product-source/verified-context";
import { lockCharacter } from "@/lib/characters/continuity";

describe("MockAIProvider", () => {
  it("implements the AI provider operations", async () => {
    const provider = new MockAIProvider();

    const product = createVerifiedProductContext({
      name: {
        value: "Demo Washing Machine",
        evidence: "Demo Washing Machine",
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
        title: "Demo Washing Machine",
      },
    });

    const character = lockCharacter({
      name: "Linh",
      description: "Nhân v?t chính",
      appearance: {
        gender: "female",
        age: 25,
        ethnicity: "Vietnamese",
        height: "165 cm",
        bodyType: "balanced",
        face: "friendly",
        hair: "black",
        eyes: "dark brown",
      },
      wardrobe: {
        outfit: "white shirt",
        shoes: "sneakers",
        accessories: null,
      },
      personality: "cheerful",
      voice: "warm",
      behavior: "natural",
      status: "UNLOCKED",
    });

    await expect(
      provider.generateStory({
        product,
        character,
        objective: null,
      }),
    ).resolves.toContain("Demo Washing Machine");

    await expect(
      provider.generatePrompt({
        story: "Story",
        videoNumber: 1,
      }),
    ).resolves.toContain("Mock prompt 1");

    await expect(provider.validatePrompt("Prompt")).resolves.toEqual({
      passed: true,
      findings: [],
    });
  });

  it("extracts a valid product structure from evidence candidates", async () => {
    const provider = new MockAIProvider();

    const result = await provider.extractProduct({
      evidenceCandidates: [
        {
          text: "Máy gi?t Aqua 8 kg",
          sourceUrl: "https://example.com/product",
          context: null,
        },
      ],
      source: {
        url: "https://example.com/product",
        title: "Demo Washing Machine",
      },
    });

    expect(result.source).toEqual({
      url: "https://example.com/product",
      title: "Demo Washing Machine",
    });

    expect(result.name).toEqual({
      value: null,
      evidence: null,
    });

    expect(result.specifications).toEqual([
      {
        key: "mock",
        value: "mock",
        evidence: "Máy gi?t Aqua 8 kg",
      },
    ]);
  });

  it("does not create evidence when no evidence candidates exist", async () => {
    const provider = new MockAIProvider();

    const result = await provider.extractProduct({
      evidenceCandidates: [],
      source: {
        url: "https://example.com/product",
        title: null,
      },
    });

    expect(result.specifications).toEqual([]);
    expect(result.features).toEqual([]);
  });
});
