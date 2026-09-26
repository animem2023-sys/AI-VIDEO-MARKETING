import { describe, expect, it } from "vitest";
import { MockAIProvider } from "@/lib/ai/mock-provider";
import { extractProduct } from "@/lib/product-source/product-extractor";
import { createVerifiedProductContext } from "@/lib/product-source/verified-context";

describe("VerifiedProductContext", () => {
  it("creates a context from a validated product extraction", async () => {
    const input = {
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
    };

    const extraction = await extractProduct(new MockAIProvider(), input);
    const context = createVerifiedProductContext(extraction);

    expect(context).toEqual(extraction);
    expect(context.source).toEqual(input.source);
  });

  it("does not expose a mutable product status", async () => {
    const input = {
      evidenceCandidates: [],
      source: {
        url: "https://example.com/product",
        title: "Demo Washing Machine",
      },
    };

    const extraction = await extractProduct(new MockAIProvider(), input);
    const context = createVerifiedProductContext(extraction);

    expect(context).not.toHaveProperty("status");
  });
});
