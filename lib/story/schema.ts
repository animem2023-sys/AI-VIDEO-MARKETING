import { z } from "zod";
import { characterSchema } from "@/lib/characters/schema";
import { productExtractionSchema } from "@/lib/product-source/extraction-schema";

export const storyStatuses = ["DRAFT", "GENERATED", "LOCKED"] as const;

export const storyStatusSchema = z.enum(storyStatuses);

export const storySchema = z.object({
  id: z.string().min(1),
  projectId: z.string().min(1),

  title: z.string().trim().min(1).nullable(),
  content: z.string().trim().min(1),
  objective: z.string().trim().min(1).nullable(),

  productContext: productExtractionSchema,
  character: characterSchema,

  status: storyStatusSchema.default("DRAFT"),
});

export type StoryStatus = z.infer<typeof storyStatusSchema>;
export type Story = z.infer<typeof storySchema>;
