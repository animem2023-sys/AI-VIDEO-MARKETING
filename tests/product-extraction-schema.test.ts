import { describe, expect, it } from "vitest";
import { productExtractionSchema } from "@/lib/product-source/extraction-schema";

describe("productExtractionSchema", () => {
  it("accepts a complete extracted product", () => {
    const result = productExtractionSchema.safeParse({
      name: {
        value: "Máy gi?t Aqua 8kg",
        evidence: "Tên s?n ph?m: Máy gi?t Aqua 8kg",
      },
      brand: {
        value: "AQUA",
        evidence: "Thýõng hi?u: AQUA",
      },
      model: {
        value: "AQW-800",
        evidence: "Model: AQW-800",
      },
      originalPrice: {
        value: "6.990.000ð",
        evidence: "Giá niêm y?t: 6.990.000ð",
      },
      salePrice: {
        value: "5.990.000ð",
        evidence: "Giá bán: 5.990.000ð",
      },
      warranty: {
        value: "2 nãm",
        evidence: "B?o hành: 2 nãm",
      },
      specifications: [
        {
          key: "Kh?i lý?ng gi?t",
          value: "8 kg",
          evidence: "Kh?i lý?ng gi?t 8 kg",
        },
      ],
      features: [
        {
          name: "Gi?t nhanh",
          description: "Chýõng tr?nh gi?t nhanh",
          evidence: "Chýõng tr?nh gi?t nhanh",
        },
      ],
      source: {
        url: "https://example.com/product",
        title: "Máy gi?t Aqua 8kg",
      },
    });

    expect(result.success).toBe(true);
  });

  it("accepts null for facts that are not available", () => {
    const result = productExtractionSchema.safeParse({
      name: {
        value: null,
        evidence: null,
      },
      brand: {
        value: null,
        evidence: null,
      },
      model: {
        value: null,
        evidence: null,
      },
      originalPrice: {
        value: null,
        evidence: null,
      },
      salePrice: {
        value: null,
        evidence: null,
      },
      warranty: {
        value: null,
        evidence: null,
      },
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
      name: {
        value: "S?n ph?m",
        evidence: "Tên s?n ph?m",
      },
      brand: {
        value: "AQUA",
        evidence: "Thýõng hi?u AQUA",
      },
      model: {
        value: "MODEL-01",
        evidence: "Model MODEL-01",
      },
      originalPrice: {
        value: null,
        evidence: null,
      },
      salePrice: {
        value: null,
        evidence: null,
      },
      warranty: {
        value: null,
        evidence: null,
      },
      specifications: [
        {
          key: "Công su?t",
          value: "1000W",
          evidence: "",
        },
      ],
      features: [
        {
          name: "Tính nãng",
          description: null,
          evidence: "",
        },
      ],
      source: {
        url: "https://example.com/product",
        title: "Product",
      },
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid source URLs", () => {
    const result = productExtractionSchema.safeParse({
      name: {
        value: "S?n ph?m",
        evidence: "Tên s?n ph?m",
      },
      brand: {
        value: null,
        evidence: null,
      },
      model: {
        value: null,
        evidence: null,
      },
      originalPrice: {
        value: null,
        evidence: null,
      },
      salePrice: {
        value: null,
        evidence: null,
      },
      warranty: {
        value: null,
        evidence: null,
      },
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
      name: {
        value: "",
        evidence: "Tên s?n ph?m",
      },
      brand: {
        value: null,
        evidence: null,
      },
      model: {
        value: null,
        evidence: null,
      },
      originalPrice: {
        value: null,
        evidence: null,
      },
      salePrice: {
        value: null,
        evidence: null,
      },
      warranty: {
        value: null,
        evidence: null,
      },
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
