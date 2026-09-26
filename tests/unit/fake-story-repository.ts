import type {
  StoryCreateRequest,
  StoryUpdateRequest,
} from "@/lib/story/request-schema";
import type {
  StoryRecord,
  StoryRepository,
} from "@/lib/story/repository";

export class FakeStoryRepository implements StoryRepository {
  private readonly records = new Map<string, StoryRecord>();

  async findByProjectId(projectId: string): Promise<StoryRecord[]> {
    return [...this.records.values()].filter(
      (record) => record.projectId === projectId,
    );
  }

  async findById(storyId: string): Promise<StoryRecord | null> {
    return this.records.get(storyId) ?? null;
  }

  async create(
    projectId: string,
    input: StoryCreateRequest,
    productContext: StoryRecord["productContext"],
    character: StoryRecord["character"],
    content: string,
  ): Promise<StoryRecord> {
    const record: StoryRecord = {
      id: `story-${this.records.size + 1}`,
      projectId,
      title: input.title,
      content,
      objective: input.objective,
      productContext,
      character,
      status: "GENERATED",
    };

    this.records.set(record.id, record);

    return record;
  }

  async update(
    storyId: string,
    input: StoryUpdateRequest,
  ): Promise<StoryRecord> {
    const current = this.records.get(storyId);

    if (!current) {
      throw new Error("Story not found.");
    }

    const updated: StoryRecord = {
      ...current,
      ...(input.title !== undefined && { title: input.title }),
      ...(input.objective !== undefined && {
        objective: input.objective,
      }),
    };

    this.records.set(storyId, updated);

    return updated;
  }

  async delete(storyId: string): Promise<void> {
    this.records.delete(storyId);
  }
}
