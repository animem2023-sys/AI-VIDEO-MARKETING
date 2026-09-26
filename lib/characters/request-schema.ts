import { z } from "zod";

const characterAppearanceInputSchema = z.object({
  gender: z.string().trim().nullable().default(null),
  age: z.number().int().positive().nullable().default(null),
  ethnicity: z.string().trim().nullable().default(null),
  height: z.string().trim().nullable().default(null),
  bodyType: z.string().trim().nullable().default(null),
  face: z.string().trim().nullable().default(null),
  hair: z.string().trim().nullable().default(null),
  eyes: z.string().trim().nullable().default(null),
});

const characterWardrobeInputSchema = z.object({
  outfit: z.string().trim().nullable().default(null),
  shoes: z.string().trim().nullable().default(null),
  accessories: z.string().trim().nullable().default(null),
});

export const characterCreateRequestSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().nullable().default(null),
  appearance: characterAppearanceInputSchema.default({
    gender: null,
    age: null,
    ethnicity: null,
    height: null,
    bodyType: null,
    face: null,
    hair: null,
    eyes: null,
  }),
  wardrobe: characterWardrobeInputSchema.default({
    outfit: null,
    shoes: null,
    accessories: null,
  }),
  personality: z.string().trim().nullable().default(null),
  voice: z.string().trim().nullable().default(null),
  behavior: z.string().trim().nullable().default(null),
});

export const characterUpdateRequestSchema =
  characterCreateRequestSchema.partial();

export type CharacterCreateRequest = z.infer<
  typeof characterCreateRequestSchema
>;

export type CharacterUpdateRequest = z.infer<
  typeof characterUpdateRequestSchema
>;
