import type { StoryResponse } from "@/lib/story/response-schema";
import type { StoryRecord } from "@/lib/story/repository";

export type { StoryRecord };

export function toStoryResponse(
  record: StoryRecord,
): StoryResponse {
  return {
    id: record.id,
    projectId: record.projectId,
    title: record.title,
    content: record.content,
    objective: record.objective,
    status: record.status,
  };
}
