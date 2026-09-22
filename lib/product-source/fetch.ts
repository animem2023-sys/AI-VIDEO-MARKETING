import { validateProductSourceUrl } from "./url";

const DEFAULT_TIMEOUT_MS = 10_000;
const MAX_RESPONSE_BYTES = 2_000_000;

export type ProductSourceFetchResult = {
  url: string;
  status: number;
  contentType: string;
  html: string;
};

export async function fetchProductSource(
  sourceUrl: string,
): Promise<ProductSourceFetchResult> {
  const validation = validateProductSourceUrl(sourceUrl);

  if (!validation.success) {
    throw new Error("URL sản phẩm không hợp lệ.");
  }

  const url = validation.data;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "error",
      signal: controller.signal,
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "AI-Video-Prompt-Studio/0.1",
      },
    });

    if (!response.ok) {
      throw new Error(`Không thể đọc trang sản phẩm. HTTP ${response.status}.`);
    }

    const contentType = response.headers.get("content-type") ?? "";

    if (
      !contentType.includes("text/html") &&
      !contentType.includes("application/xhtml+xml")
    ) {
      throw new Error("Nguồn sản phẩm không trả về nội dung HTML.");
    }

    const contentLength = response.headers.get("content-length");

    if (contentLength && Number(contentLength) > MAX_RESPONSE_BYTES) {
      throw new Error("Trang sản phẩm vượt quá giới hạn kích thước cho phép.");
    }

    const html = await response.text();

    if (new TextEncoder().encode(html).byteLength > MAX_RESPONSE_BYTES) {
      throw new Error("Nội dung trang sản phẩm vượt quá giới hạn cho phép.");
    }

    return {
      url,
      status: response.status,
      contentType,
      html,
    };
  } finally {
    clearTimeout(timeout);
  }
}
