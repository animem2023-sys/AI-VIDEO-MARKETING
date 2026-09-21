import { describe, expect, it } from "vitest";
import { productStatusSchema } from "@/lib/validation/product";
describe("ProductStatus", () => { it.each(["DRAFT", "EXTRACTED", "VERIFIED", "LOCKED"])("accepts %s", (status) => expect(productStatusSchema.parse(status)).toBe(status)); });
