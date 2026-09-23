import { z } from "zod";
import { validateProductSourceUrl } from "./url";

export const productSourceFetchRequestSchema = z.object({
  sourceUrl: z
    .string()
    .trim()
    .min(1)
    .refine((value) => validateProductSourceUrl(value).success, {
      message: "URL sản phẩm không hợp lệ.",
    }),
});

export type ProductSourceFetchRequest = z.infer<
  typeof productSourceFetchRequestSchema
>;
