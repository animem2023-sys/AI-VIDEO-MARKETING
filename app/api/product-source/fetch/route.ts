import { NextResponse } from "next/server";
import { MockAIProvider } from "@/lib/ai/mock-provider";
import { extractEvidenceCandidates } from "@/lib/product-source/evidence-extractor";
import { fetchProductSource } from "@/lib/product-source/fetch";
import { cleanProductHtml } from "@/lib/product-source/html-cleaner";
import { extractProduct } from "@/lib/product-source/product-extractor";
import { productSourceFetchRequestSchema } from "@/lib/product-source/fetch-request-schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = productSourceFetchRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Dữ liệu yêu cầu không hợp lệ.",
        },
        { status: 400 },
      );
    }

    const fetched = await fetchProductSource(validation.data.sourceUrl);
    const cleaned = cleanProductHtml(fetched.html);
    const evidenceCandidates = extractEvidenceCandidates(
      cleaned.text,
      fetched.url,
    );

    const provider = new MockAIProvider();

    const product = await extractProduct(provider, {
      evidenceCandidates,
      source: {
        url: fetched.url,
        title: cleaned.title,
      },
    });

    return NextResponse.json({
      source: {
        url: fetched.url,
        status: fetched.status,
        contentType: fetched.contentType,
        title: cleaned.title,
      },
      content: {
        text: cleaned.text,
      },
      evidenceCandidates,
      product,
    });
  } catch {
    return NextResponse.json(
      {
        error: "Không thể đọc nguồn sản phẩm.",
      },
      { status: 422 },
    );
  }
}
