import { describe, expect, it } from "vitest";
import { evidenceCandidateSchema } from "@/lib/product-source/evidence-candidate";

describe("evidenceCandidateSchema", () => {
  it("accepts a valid evidence candidate", () => {
    const result = evidenceCandidateSchema.safeParse({
      text: "Thýõng hi?u: AQUA",
      sourceUrl: "https://example.com/product",
      context: "Thông tin s?n ph?m",
    });

    expect(result.success).toBe(true);
  });

  it("accepts evidence without context", () => {
    const result = evidenceCandidateSchema.safeParse({
      text: "Giá bán: 5.990.000ð",
      sourceUrl: "https://example.com/product",
      context: null,
    });

    expect(result.success).toBe(true);
  });

  it("rejects empty evidence text", () => {
    const result = evidenceCandidateSchema.safeParse({
      text: "",
      sourceUrl: "https://example.com/product",
      context: "Giá s?n ph?m",
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid source URLs", () => {
    const result = evidenceCandidateSchema.safeParse({
      text: "Thýõng hi?u: AQUA",
      sourceUrl: "not-a-url",
      context: "Thông tin s?n ph?m",
    });

    expect(result.success).toBe(false);
  });
});
