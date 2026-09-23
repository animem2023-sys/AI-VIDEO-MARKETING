import { describe, expect, it } from "vitest";
import { MockAITextGenerator } from "@/lib/ai/mock-text-generator";

describe("MockAITextGenerator", () => {
  it("returns the configured response", async () => {
    const generator = new MockAITextGenerator('{"name":"Máy giặt Aqua"}');

    await expect(
      generator.generateText({
        prompt: "Extract product data",
      }),
    ).resolves.toBe('{"name":"Máy giặt Aqua"}');
  });

  it("records the last generation request", async () => {
    const generator = new MockAITextGenerator("mock response");

    const request = {
      prompt: "Test extraction prompt",
    };

    await generator.generateText(request);

    expect(generator.lastRequest).toEqual(request);
  });
});
