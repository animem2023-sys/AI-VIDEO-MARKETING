import { z } from "zod";

const characterAppearanceSchema = z.object({
  gender: z.string().nullable(),
  age: z.number().int().positive().nullable(),
  ethnicity: z.string().nullable(),
  height: z.string().nullable(),
  bodyType: z.string().nullable(),
  face: z.string().nullable(),
  hair: z.string().nullable(),
  eyes: z.string().nullable(),
});

const characterWardrobeSchema = z.object({
  outfit: z.string().nullable(),
  shoes: z.string().nullable(),
  accessories: z.string().nullable(),
});

export const characterSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),

  appearance: characterAppearanceSchema.default({
    gender: null,
    age: null,
    ethnicity: null,
    height: null,
    bodyType: null,
    face: null,
    hair: null,
    eyes: null,
  }),

  wardrobe: characterWardrobeSchema.default({
    outfit: null,
    shoes: null,
    accessories: null,
  }),

  personality: z.string().nullable().default(null),
  voice: z.string().nullable().default(null),
  behavior: z.string().nullable().default(null),

  status: z.enum(["LOCKED", "UNLOCKED"]).default("UNLOCKED"),
});

export type Character = z.infer<typeof characterSchema>;
