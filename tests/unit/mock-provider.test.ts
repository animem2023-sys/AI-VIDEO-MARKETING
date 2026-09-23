import { describe, expect, it } from "vitest";
import { MockAIProvider } from "@/lib/ai/mock-provider";

describe("MockAIProvider", () => {
  it("implements the AI provider operations", async () => {
    const provider = new MockAIProvider();

    await expect(
      provider.generateStory({
        productName: "Demo Washing Machine",
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
          text: "Máy giặt Aqua 8 kg",
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
        evidence: "Máy giặt Aqua 8 kg",
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
