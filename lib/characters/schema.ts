import { z } from "zod";
export const characterSchema = z.object({ name: z.string().min(1), description: z.string().nullable(), status: z.enum(["LOCKED", "UNLOCKED"]).default("UNLOCKED") });
