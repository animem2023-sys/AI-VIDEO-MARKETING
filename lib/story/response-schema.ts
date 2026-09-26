import { z } from "zod";
import { storyStatusSchema } from "@/lib/story/schema";

export const storyResponseSchema = z.object({
  id: z.string().min(1),
  projectId: z.string().min(1),
  title: z.string().nullable(),
  content: z.string().min(1),
  objective: z.string().nullable(),
  status: storyStatusSchema,
});

export type StoryResponse = z.infer<
  typeof storyResponseSchema
>;
