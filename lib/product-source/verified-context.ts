import type { ProductExtraction } from "./extraction-schema";

export type VerifiedProductContext = ProductExtraction & {
  readonly __verifiedProductContext: unique symbol;
};

export function createVerifiedProductContext(
  extraction: ProductExtraction,
): VerifiedProductContext {
  return extraction as VerifiedProductContext;
}
