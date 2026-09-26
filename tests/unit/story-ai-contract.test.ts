import { describe, expect, it } from "vitest";
import { MockAIProvider } from "@/lib/ai/mock-provider";
import { extractProduct } from "@/lib/product-source/product-extractor";
import { createVerifiedProductContext } from "@/lib/product-source/verified-context";
import { lockCharacter } from "@/lib/characters/continuity";
import type { Character } from "@/lib/characters/schema";
import { generateStory } from "@/lib/story/service";

const baseCharacter: Character = {
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
};

describe("Story AI contract", () => {
  it("passes verified product context and locked character to the AI provider", async () => {
    const extraction = await extractProduct(new MockAIProvider(), {
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

    const product = createVerifiedProductContext(extraction);
    const character = lockCharacter(baseCharacter);

    const calls: unknown[] = [];

    const provider = {
      generateStory: async (input: unknown) => {
        calls.push(input);
        return "Story result";
      },
    };

    await generateStory(provider, {
      product,
      character,
      objective: "T?o câu chuy?n video ng?n h?p d?n",
    });

    expect(calls).toHaveLength(1);

    expect(calls[0]).toMatchObject({
      product,
      character,
      objective: "T?o câu chuy?n video ng?n h?p d?n",
    });
  });
});
