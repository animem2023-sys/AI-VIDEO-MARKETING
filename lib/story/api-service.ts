import type {
  StoryCreateRequest,
  StoryUpdateRequest,
} from "@/lib/story/request-schema";
import type {
  StoryRecord,
  StoryRepository,
} from "@/lib/story/repository";

export class StoryNotFoundError extends Error {
  constructor() {
    super("Story not found.");
    this.name = "StoryNotFoundError";
  }
}

export class StoryProjectMismatchError extends Error {
  constructor() {
    super("Story does not belong to project.");
    this.name = "StoryProjectMismatchError";
  }
}

export async function createProjectStory(
  repository: StoryRepository,
  projectId: string,
  input: StoryCreateRequest,
  productContext: StoryRecord["productContext"],
  character: StoryRecord["character"],
  content: string,
): Promise<StoryRecord> {
  return repository.create(
    projectId,
    input,
    productContext,
    character,
    content,
  );
}

export async function getProjectStory(
  repository: StoryRepository,
  projectId: string,
  storyId: string,
): Promise<StoryRecord> {
  const story = await repository.findById(storyId);

  if (!story) {
    throw new StoryNotFoundError();
  }

  if (story.projectId !== projectId) {
    throw new StoryProjectMismatchError();
  }

  return story;
}

export async function listProjectStories(
  repository: StoryRepository,
  projectId: string,
): Promise<StoryRecord[]> {
  return repository.findByProjectId(projectId);
}

export async function updateProjectStory(
  repository: StoryRepository,
  projectId: string,
  storyId: string,
  input: StoryUpdateRequest,
): Promise<StoryRecord> {
  await getProjectStory(repository, projectId, storyId);

  return repository.update(storyId, input);
}

export async function deleteProjectStory(
  repository: StoryRepository,
  projectId: string,
  storyId: string,
): Promise<void> {
  await getProjectStory(repository, projectId, storyId);

  await repository.delete(storyId);
}
