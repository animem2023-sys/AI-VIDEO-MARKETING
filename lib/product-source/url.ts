import { z } from "zod";

const httpUrlSchema = z
  .string()
  .trim()
  .url()
  .refine(
    (value) => {
      try {
        const protocol = new URL(value).protocol;
        return protocol === "http:" || protocol === "https:";
      } catch {
        return false;
      }
    },
    {
      message: "Chỉ chấp nhận URL http hoặc https.",
    },
  );

export function validateProductSourceUrl(value: string) {
  return httpUrlSchema.safeParse(value);
}
