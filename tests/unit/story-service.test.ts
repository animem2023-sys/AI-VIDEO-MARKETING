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

describe("Story service", () => {
  it("generates story from verified product context and locked character", async () => {
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

    const story = await generateStory(new MockAIProvider(), {
      product,
      character,
      objective: "T?o câu chuy?n video ng?n h?p d?n",
    });

    expect(story).toContain("unknown product");
    expect(character.status).toBe("LOCKED");
  });

  it("rejects story generation when character is not LOCKED", async () => {
    const extraction = await extractProduct(new MockAIProvider(), {
      evidenceCandidates: [],
      source: {
        url: "https://example.com/product",
        title: "Demo Washing Machine",
      },
    });

    const product = createVerifiedProductContext(extraction);

    await expect(
      generateStory(new MockAIProvider(), {
        product,
        character: baseCharacter,
        objective: "T?o câu chuy?n video ng?n h?p d?n",
      }),
    ).rejects.toThrow("Character ph?i ðý?c LOCKED");
  });
});
