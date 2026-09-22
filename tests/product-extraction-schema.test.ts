import { describe, expect, it } from "vitest";
import { productExtractionSchema } from "@/lib/product-source/extraction-schema";

describe("productExtractionSchema", () => {
  it("accepts a complete extracted product", () => {
    const result = productExtractionSchema.safeParse({
      name: "Máy giặt Aqua 10kg",
      brand: "Aqua",
      model: "AQW-10XX",
      originalPrice: "9.990.000đ",
      salePrice: "8.000.000đ",
      warranty: "2 năm",
      specifications: [
        {
          key: "Khối lượng giặt",
          value: "10 kg",
          evidence: "Khối lượng giặt 10 kg",
        },
      ],
      features: [
        {
          name: "Inverter",
          description: "Tiết kiệm điện",
          evidence: "Động cơ Inverter tiết kiệm điện",
        },
      ],
      source: {
        url: "https://example.com/product",
        title: "Máy giặt Aqua 10kg",
      },
    });

    expect(result.success).toBe(true);
  });

  it("accepts null for facts that are not available", () => {
    const result = productExtractionSchema.safeParse({
      name: "Sản phẩm chưa xác định",
      brand: null,
      model: null,
      originalPrice: null,
      salePrice: null,
      warranty: null,
      specifications: [],
      features: [],
      source: {
        url: "https://example.com/product",
        title: null,
      },
    });

    expect(result.success).toBe(true);
  });

  it("requires evidence for specifications and features", () => {
    const result = productExtractionSchema.safeParse({
      name: "Máy giặt Aqua",
      brand: "Aqua",
      model: "AQW-10XX",
      originalPrice: null,
      salePrice: "8.000.000đ",
      warranty: null,
      specifications: [
        {
          key: "Khối lượng giặt",
          value: "10 kg",
        },
      ],
      features: [],
      source: {
        url: "https://example.com/product",
        title: "Product",
      },
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid source URLs", () => {
    const result = productExtractionSchema.safeParse({
      name: "Máy giặt Aqua",
      brand: "Aqua",
      model: null,
      originalPrice: null,
      salePrice: null,
      warranty: null,
      specifications: [],
      features: [],
      source: {
        url: "not-a-url",
        title: null,
      },
    });

    expect(result.success).toBe(false);
  });

  it("rejects empty factual values", () => {
    const result = productExtractionSchema.safeParse({
      name: "",
      brand: "Aqua",
      model: null,
      originalPrice: null,
      salePrice: null,
      warranty: null,
      specifications: [],
      features: [],
      source: {
        url: "https://example.com/product",
        title: null,
      },
    });

    expect(result.success).toBe(false);
  });
});
