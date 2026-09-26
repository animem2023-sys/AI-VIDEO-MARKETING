import type { Story } from "@/lib/story/schema";
import type {
  StoryCreateRequest,
  StoryUpdateRequest,
} from "@/lib/story/request-schema";

export type StoryRecord = Story & {
  id: string;
  projectId: string;
};

export interface StoryRepository {
  findByProjectId(projectId: string): Promise<StoryRecord[]>;
  findById(storyId: string): Promise<StoryRecord | null>;
  create(
    projectId: string,
    input: StoryCreateRequest,
    productContext: Story["productContext"],
    character: Story["character"],
    content: string,
  ): Promise<StoryRecord>;
  update(
    storyId: string,
    input: StoryUpdateRequest,
  ): Promise<StoryRecord>;
  delete(storyId: string): Promise<void>;
}
