import { describe, expect, it } from "vitest";
import { validateProductSourceUrl } from "@/lib/product-source/url";

describe("validateProductSourceUrl", () => {
  it("accepts HTTPS URLs", () => {
    expect(
      validateProductSourceUrl("https://example.com/product"),
    ).toEqual({
      success: true,
      data: "https://example.com/product",
    });
  });

  it("accepts HTTP URLs", () => {
    expect(
      validateProductSourceUrl("http://example.com/product"),
    ).toEqual({
      success: true,
      data: "http://example.com/product",
    });
  });

  it("rejects invalid URLs", () => {
    expect(validateProductSourceUrl("not-a-url").success).toBe(false);
  });

  it("rejects non-HTTP protocols", () => {
    expect(
      validateProductSourceUrl("ftp://example.com/product").success,
    ).toBe(false);
  });
});
