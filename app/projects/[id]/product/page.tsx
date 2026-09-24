"use client";

import { useState } from "react";

type ProductFact = {
  value: string | null;
  evidence: string | null;
};

type ProductExtraction = {
  name: ProductFact;
  brand: ProductFact;
  model: ProductFact;
  originalPrice: ProductFact;
  salePrice: ProductFact;
  warranty: ProductFact;
  specifications: Array<{
    key: string;
    value: string;
    evidence: string;
  }>;
  features: Array<{
    name: string;
    description: string | null;
    evidence: string;
  }>;
  source: {
    url: string;
    title: string | null;
  };
};

type ProductSourceResponse = {
  source: {
    url: string;
    status: number;
    contentType: string;
    title: string | null;
  };
  content: {
    text: string;
  };
  evidenceCandidates: Array<{
    text: string;
    sourceUrl: string;
    context: string | null;
  }>;
  product: ProductExtraction;
};

const factFields = [
  ["Product Name", "name"],
  ["Brand", "brand"],
  ["Model", "model"],
  ["Original Price", "originalPrice"],
  ["Sale Price", "salePrice"],
  ["Warranty", "warranty"],
] as const;

function displayValue(value: string | null) {
  return value ?? "Chưa xác định";
}

export default function ProductPage() {
  const [sourceUrl, setSourceUrl] = useState("");
  const [data, setData] = useState<ProductSourceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFetch() {
    setLoading(true);
    setError("");
    setData(null);

    try {
      const response = await fetch("/api/product-source/fetch", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sourceUrl,
        }),
      });

      const body = await response.json();

      if (!response.ok) {
        throw new Error(
          body.error ?? "Không thể đọc nguồn sản phẩm.",
        );
      }

      setData(body as ProductSourceResponse);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Không thể đọc nguồn sản phẩm.",
      );
    } finally {
      setLoading(false);
    }
  }

  const product = data?.product;

  return (
    <section className="max-w-5xl">
      <p className="text-sm font-semibold text-indigo-600">PRODUCT</p>

      <h1 className="mt-1 text-3xl font-bold">Product Source</h1>

      <div className="mt-7 rounded-xl bg-white p-6 shadow-sm">
        <label className="block text-sm font-medium text-slate-800">
          Dán URL sản phẩm
          <input
            className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="https://..."
            type="url"
            value={sourceUrl}
            onChange={(event) => setSourceUrl(event.target.value)}
            disabled={loading}
          />
        </label>

        <button
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          type="button"
          onClick={handleFetch}
          disabled={loading || !sourceUrl.trim()}
        >
          {loading
            ? "ĐANG ĐỌC THÔNG TIN..."
            : "ĐỌC THÔNG TIN SẢN PHẨM"}
        </button>

        <p className="mt-3 text-sm text-slate-500">
          Dữ liệu factual chỉ được hiển thị khi có nguồn bằng chứng.
          Thông tin chưa xác định sẽ không được tự tạo.
        </p>

        {error ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}
      </div>

      {data && product ? (
        <>
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-semibold text-emerald-800">
              Đã đọc nguồn sản phẩm
            </p>
            <p className="mt-1 break-all text-sm text-emerald-700">
              {data.source.url}
            </p>
            <p className="mt-1 text-sm text-emerald-700">
              HTTP {data.source.status} · {data.source.contentType}
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {factFields.map(([label, key]) => {
              const fact = product[key];

              return (
                <div
                  className="rounded-lg border border-slate-200 bg-white p-4"
                  key={key}
                >
                  <dt className="text-xs font-semibold uppercase text-slate-500">
                    {label}
                  </dt>

                  <dd className="mt-2 font-medium text-slate-800">
                    {displayValue(fact.value)}
                  </dd>

                  {fact.evidence ? (
                    <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
                      Evidence: {fact.evidence}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold">Specifications</h2>

            {product.specifications.length > 0 ? (
              <div className="mt-4 space-y-3">
                {product.specifications.map((specification, index) => (
                  <div
                    className="rounded-lg border border-slate-100 bg-slate-50 p-4"
                    key={`${specification.key}-${index}`}
                  >
                    <p className="font-medium text-slate-800">
                      {specification.key}
                    </p>
                    <p className="mt-1 text-sm text-slate-700">
                      {specification.value}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Evidence: {specification.evidence}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">
                Chưa xác định
              </p>
            )}
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold">Features</h2>

            {product.features.length > 0 ? (
              <div className="mt-4 space-y-3">
                {product.features.map((feature, index) => (
                  <div
                    className="rounded-lg border border-slate-100 bg-slate-50 p-4"
                    key={`${feature.name}-${index}`}
                  >
                    <p className="font-medium text-slate-800">
                      {feature.name}
                    </p>

                    {feature.description ? (
                      <p className="mt-1 text-sm text-slate-700">
                        {feature.description}
                      </p>
                    ) : null}

                    <p className="mt-2 text-xs text-slate-500">
                      Evidence: {feature.evidence}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">
                Chưa xác định
              </p>
            )}
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold">Source</h2>

            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="font-semibold text-slate-500">
                  URL
                </dt>
                <dd className="mt-1 break-all text-slate-800">
                  {product.source.url}
                </dd>
              </div>

              <div>
                <dt className="font-semibold text-slate-500">
                  Title
                </dt>
                <dd className="mt-1 text-slate-800">
                  {displayValue(product.source.title)}
                </dd>
              </div>

              <div>
                <dt className="font-semibold text-slate-500">
                  Evidence Candidates
                </dt>
                <dd className="mt-1 text-slate-800">
                  {data.evidenceCandidates.length}
                </dd>
              </div>
            </dl>
          </div>
        </>
      ) : null}
    </section>
  );
}
