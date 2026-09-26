import { describe, expect, it } from "vitest";
import {
  characterCreateRequestSchema,
  characterUpdateRequestSchema,
} from "@/lib/characters/request-schema";

describe("character request schema", () => {
  it("accepts a valid create request", () => {
    const result = characterCreateRequestSchema.parse({
      name: "Test Character",
    });

    expect(result.name).toBe("Test Character");
    expect(result.appearance.gender).toBeNull();
    expect(result.wardrobe.outfit).toBeNull();
  });

  it("accepts a partial update request", () => {
    const result = characterUpdateRequestSchema.parse({
      description: "Mô tả mới.",
    });

    expect(result.description).toBe("Mô tả mới.");
  });

  it("does not allow status to be supplied by the request", () => {
    const result = characterUpdateRequestSchema.parse({
      status: "LOCKED",
      description: "Mô tả mới.",
    });

    expect(result).not.toHaveProperty("status");
    expect(result.description).toBe("Mô tả mới.");
  });

  it("rejects an empty character name", () => {
    expect(() =>
      characterCreateRequestSchema.parse({
        name: "",
      }),
    ).toThrow();
  });
});
