import { z } from "zod";
import { characterSchema } from "@/lib/characters/schema";

export const characterResponseSchema = characterSchema.extend({
  id: z.string().min(1),
  projectId: z.string().min(1),
});

export const characterListResponseSchema = z.object({
  characters: z.array(characterResponseSchema),
});

export type CharacterResponse = z.infer<typeof characterResponseSchema>;
export type CharacterListResponse = z.infer<
  typeof characterListResponseSchema
>;
