import { beforeEach, describe, expect, it, vi } from "vitest";

const { fetchProductSourceMock } = vi.hoisted(() => ({
  fetchProductSourceMock: vi.fn(),
}));

vi.mock("@/lib/product-source/fetch", () => ({
  fetchProductSource: fetchProductSourceMock,
}));

import { POST } from "@/app/api/product-source/fetch/route";

describe("POST /api/product-source/fetch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns cleaned source data, evidence candidates, and extracted product for a valid request", async () => {
    fetchProductSourceMock.mockResolvedValue({
      url: "https://example.com/product",
      status: 200,
      contentType: "text/html; charset=utf-8",
      html: `
        <html>
          <head><title>Test Product</title></head>
          <body>
            <h1>Máy giặt Aqua</h1>
            <p>Khối lượng giặt 8 kg.</p>
            <p>Bảo hành 24 tháng.</p>
            <script>window.secret = "remove-me";</script>
          </body>
        </html>
      `,
    });

    const request = new Request(
      "http://localhost/api/product-source/fetch",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sourceUrl: "https://example.com/product",
        }),
      },
    );

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.source.url).toBe("https://example.com/product");
    expect(body.source.status).toBe(200);
    expect(body.source.title).toBe("Test Product");
    expect(body.content.text).toContain("Máy giặt Aqua");
    expect(body.content.text).not.toContain("remove-me");

    expect(body.evidenceCandidates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          text: "Máy giặt Aqua",
          sourceUrl: "https://example.com/product",
        }),
        expect.objectContaining({
          text: "Khối lượng giặt 8 kg",
          sourceUrl: "https://example.com/product",
        }),
      ]),
    );

    expect(body.product).toEqual(
      expect.objectContaining({
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
        specifications: [
          {
            key: "mock",
            value: "mock",
            evidence: expect.any(String),
          },
        ],
        features: [],
        source: {
          url: "https://example.com/product",
          title: "Test Product",
        },
      }),
    );

    expect(fetchProductSourceMock).toHaveBeenCalledWith(
      "https://example.com/product",
    );
  });

  it("returns 400 for an invalid request body", async () => {
    const request = new Request(
      "http://localhost/api/product-source/fetch",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sourceUrl: "not-a-valid-url",
        }),
      },
    );

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      error: "Dữ liệu yêu cầu không hợp lệ.",
    });

    expect(fetchProductSourceMock).not.toHaveBeenCalled();
  });

  it("returns 422 when the request body is invalid JSON", async () => {
    const request = new Request(
      "http://localhost/api/product-source/fetch",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: "{invalid-json",
      },
    );

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(422);
    expect(body).toEqual({
      error: "Không thể đọc nguồn sản phẩm.",
    });

    expect(fetchProductSourceMock).not.toHaveBeenCalled();
  });

  it("returns 422 when fetching the product source fails", async () => {
    fetchProductSourceMock.mockRejectedValue(
      new Error("Nguồn sản phẩm không truy cập được."),
    );

    const request = new Request(
      "http://localhost/api/product-source/fetch",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sourceUrl: "https://example.com/product",
        }),
      },
    );

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(422);
    expect(body).toEqual({
      error: "Không thể đọc nguồn sản phẩm.",
    });
  });
});
