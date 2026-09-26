import { z } from "zod";

export const storyCreateRequestSchema = z.object({
  title: z.string().trim().min(1).nullable().default(null),
  objective: z.string().trim().min(1).nullable().default(null),
});

export const storyUpdateRequestSchema =
  storyCreateRequestSchema.partial();

export type StoryCreateRequest = z.infer<
  typeof storyCreateRequestSchema
>;

export type StoryUpdateRequest = z.infer<
  typeof storyUpdateRequestSchema
>;
