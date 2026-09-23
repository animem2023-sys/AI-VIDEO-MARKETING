import { describe, expect, it } from "vitest";
import { productFactSchema } from "@/lib/product-source/product-fact";

describe("productFactSchema", () => {
  it("accepts a fact with value and evidence", () => {
    expect(
      productFactSchema.parse({
        value: "480L",
        evidence: "Dung tích 480L",
      }),
    ).toEqual({
      value: "480L",
      evidence: "Dung tích 480L",
    });
  });

  it("accepts an unavailable fact", () => {
    expect(
      productFactSchema.parse({
        value: null,
        evidence: null,
      }),
    ).toEqual({
      value: null,
      evidence: null,
    });
  });

  it("rejects an empty value or evidence", () => {
    expect(() =>
      productFactSchema.parse({
        value: "",
        evidence: "Dung tích 480L",
      }),
    ).toThrow();

    expect(() =>
      productFactSchema.parse({
        value: "480L",
        evidence: "",
      }),
    ).toThrow();
  });

  it("rejects a value without evidence", () => {
    expect(() =>
      productFactSchema.parse({
        value: "480L",
        evidence: null,
      }),
    ).toThrow();
  });

  it("rejects evidence without a value", () => {
    expect(() =>
      productFactSchema.parse({
        value: null,
        evidence: "Dung tích 480L",
      }),
    ).toThrow();
  });
});
