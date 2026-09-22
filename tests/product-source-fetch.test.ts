import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchProductSource } from "@/lib/product-source/fetch";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("fetchProductSource", () => {
  it("fetches HTML successfully", async () => {
    const mockFetch = vi.fn().mockResolvedValue(
      new Response("<html><body>Product</body></html>", {
        status: 200,
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
      }),
    );

    vi.stubGlobal("fetch", mockFetch);

    await expect(
      fetchProductSource("https://example.com/product"),
    ).resolves.toMatchObject({
      url: "https://example.com/product",
      status: 200,
      contentType: "text/html; charset=utf-8",
      html: "<html><body>Product</body></html>",
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://example.com/product",
      expect.objectContaining({
        method: "GET",
        redirect: "error",
        headers: expect.objectContaining({
          Accept: "text/html,application/xhtml+xml",
        }),
      }),
    );
  });

  it("rejects invalid URLs", async () => {
    await expect(
      fetchProductSource("not-a-url"),
    ).rejects.toThrow("URL sản phẩm không hợp lệ.");
  });

  it("rejects non-success HTTP responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("<html>Not found</html>", {
          status: 404,
          headers: {
            "content-type": "text/html",
          },
        }),
      ),
    );

    await expect(
      fetchProductSource("https://example.com/product"),
    ).rejects.toThrow("HTTP 404");
  });

  it("rejects non-HTML content", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response('{"name":"Product"}', {
          status: 200,
          headers: {
            "content-type": "application/json",
          },
        }),
      ),
    );

    await expect(
      fetchProductSource("https://example.com/product"),
    ).rejects.toThrow("Nguồn sản phẩm không trả về nội dung HTML.");
  });

  it("rejects responses that exceed the content-length limit", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("<html>Product</html>", {
          status: 200,
          headers: {
            "content-type": "text/html",
            "content-length": "2000001",
          },
        }),
      ),
    );

    await expect(
      fetchProductSource("https://example.com/product"),
    ).rejects.toThrow("vượt quá giới hạn kích thước cho phép");
  });

  it("rejects HTML bodies that exceed the size limit", async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      headers: {
        get: vi.fn().mockReturnValue("text/html"),
      },
      text: vi.fn().mockResolvedValue("x".repeat(2_000_001)),
    };

    mockResponse.headers.get.mockImplementation((name: string) => {
      if (name === "content-type") {
        return "text/html";
      }

      if (name === "content-length") {
        return null;
      }

      return null;
    });

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(mockResponse),
    );

    await expect(
      fetchProductSource("https://example.com/product"),
    ).rejects.toThrow("vượt quá giới hạn cho phép");
  });
});
