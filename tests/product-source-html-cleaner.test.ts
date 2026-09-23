import { describe, expect, it } from "vitest";
import { cleanProductHtml } from "@/lib/product-source/html-cleaner";

describe("cleanProductHtml", () => {
  it("extracts title and visible body text", () => {
    const html = `
      <html>
        <head>
          <title>Máy giặt Aqua 10kg</title>
        </head>
        <body>
          <h1>Máy giặt Aqua 10kg</h1>
          <p>Động cơ Inverter</p>
          <p>Giá bán: 8.000.000đ</p>
        </body>
      </html>
    `;

    const result = cleanProductHtml(html);

    expect(result.title).toBe("Máy giặt Aqua 10kg");
    expect(result.text).toContain("Máy giặt Aqua 10kg");
    expect(result.text).toContain("Động cơ Inverter");
    expect(result.text).toContain("8.000.000đ");
  });

  it("removes non-content elements", () => {
    const html = `
      <html>
        <head>
          <title>Product</title>
          <style>.price { color: red; }</style>
        </head>
        <body>
          <h1>Product</h1>
          <script>alert("ignore");</script>
          <noscript>Ignore this too</noscript>
          <svg><text>Ignore SVG</text></svg>
          <iframe>Ignore iframe</iframe>
          <p>Real product information</p>
        </body>
      </html>
    `;

    const result = cleanProductHtml(html);

    expect(result.text).toContain("Product");
    expect(result.text).toContain("Real product information");
    expect(result.text).not.toContain("alert");
    expect(result.text).not.toContain("Ignore this too");
    expect(result.text).not.toContain("Ignore SVG");
    expect(result.text).not.toContain("Ignore iframe");
  });

  it("normalizes excessive whitespace", () => {
    const html = `
      <html>
        <body>
          <p>Máy giặt</p>
          <p>
            Công nghệ
            Inverter
          </p>
        </body>
      </html>
    `;

    const result = cleanProductHtml(html);

    expect(result.text).toBe("Máy giặt\nCông nghệ\nInverter");
  });

  it("returns null title when the page has no title", () => {
    const html = `
      <html>
        <body>
          <p>Product information</p>
        </body>
      </html>
    `;

    const result = cleanProductHtml(html);

    expect(result.title).toBeNull();
    expect(result.text).toBe("Product information");
  });
});
