import { describe, expect, it } from "vitest";
import { productFactSchema } from "@/lib/product-source/product-fact";

describe("productFactSchema", () => {
  it("accepts a fact with value and evidence", () => {
    const result = productFactSchema.safeParse({
      value: "AQUA",
      evidence: "Thýõng hi?u: AQUA",
    });

    expect(result.success).toBe(true);
  });

  it("accepts an unavailable fact", () => {
    const result = productFactSchema.safeParse({
      value: null,
      evidence: null,
    });

    expect(result.success).toBe(true);
  });

  it("rejects empty value or evidence", () => {
    const result = productFactSchema.safeParse({
      value: "",
      evidence: "",
    });

    expect(result.success).toBe(false);
  });
});
