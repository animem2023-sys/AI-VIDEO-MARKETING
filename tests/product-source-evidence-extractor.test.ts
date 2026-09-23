import { describe, expect, it } from "vitest";
import { extractEvidenceCandidates } from "@/lib/product-source/evidence-extractor";

describe("extractEvidenceCandidates", () => {
  const sourceUrl = "https://example.com/product";

  it("extracts evidence candidates from product text", () => {
    const result = extractEvidenceCandidates(
      "Tủ lạnh AQUA 480L. Công nghệ Inverter tiết kiệm điện. Bảo hành 2 năm.",
      sourceUrl,
    );

    expect(result).toHaveLength(3);
    expect(result[0]).toMatchObject({
      text: "Tủ lạnh AQUA 480L",
      sourceUrl,
      context: null,
    });
  });

  it("normalizes whitespace", () => {
    const result = extractEvidenceCandidates(
      "Tủ lạnh    AQUA 480L.\nCông nghệ    Inverter tiết kiệm điện.",
      sourceUrl,
    );

    expect(result.map((item) => item.text)).toEqual([
      "Tủ lạnh AQUA 480L",
      "Công nghệ Inverter tiết kiệm điện",
    ]);
  });

  it("removes segments that are too short", () => {
    const result = extractEvidenceCandidates(
      "AQUA. Tủ lạnh AQUA 480L.",
      sourceUrl,
    );

    expect(result.map((item) => item.text)).toEqual([
      "Tủ lạnh AQUA 480L",
    ]);
  });

  it("removes duplicate evidence segments", () => {
    const result = extractEvidenceCandidates(
      "Tủ lạnh AQUA 480L. Công nghệ Inverter. Tủ lạnh AQUA 480L.",
      sourceUrl,
    );

    expect(result.map((item) => item.text)).toEqual([
      "Tủ lạnh AQUA 480L",
      "Công nghệ Inverter",
    ]);
  });
});
