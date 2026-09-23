import { describe, expect, it } from "vitest";
import { productSourceFetchRequestSchema } from "@/lib/product-source/fetch-request-schema";

describe("productSourceFetchRequestSchema", () => {
  it("accepts a valid HTTPS URL", () => {
    expect(
      productSourceFetchRequestSchema.parse({
        sourceUrl: "https://example.com/product",
      }),
    ).toEqual({
      sourceUrl: "https://example.com/product",
    });
  });

  it("accepts a valid HTTP URL", () => {
    expect(
      productSourceFetchRequestSchema.parse({
        sourceUrl: "http://example.com/product",
      }),
    ).toEqual({
      sourceUrl: "http://example.com/product",
    });
  });

  it("rejects an empty URL", () => {
    expect(() =>
      productSourceFetchRequestSchema.parse({
        sourceUrl: "",
      }),
    ).toThrow();
  });

  it("rejects an invalid URL", () => {
    expect(() =>
      productSourceFetchRequestSchema.parse({
        sourceUrl: "not-a-url",
      }),
    ).toThrow();
  });

  it("rejects a missing sourceUrl", () => {
    expect(() =>
      productSourceFetchRequestSchema.parse({}),
    ).toThrow();
  });
});
