import type { StoryRepository } from "@/lib/story/repository";

class UnconfiguredStoryRepository implements StoryRepository {
  async findByProjectId(): Promise<never> {
    throw new Error("Story repository chýa ðý?c c?u h?nh.");
  }

  async findById(): Promise<never> {
    throw new Error("Story repository chýa ðý?c c?u h?nh.");
  }

  async create(): Promise<never> {
    throw new Error("Story repository chýa ðý?c c?u h?nh.");
  }

  async update(): Promise<never> {
    throw new Error("Story repository chýa ðý?c c?u h?nh.");
  }

  async delete(): Promise<void> {
    throw new Error("Story repository chýa ðý?c c?u h?nh.");
  }
}

let storyRepository: StoryRepository =
  new UnconfiguredStoryRepository();

export function getStoryRepository(): StoryRepository {
  return storyRepository;
}

export function setStoryRepositoryForTests(
  repository: StoryRepository,
): void {
  storyRepository = repository;
}

export function resetStoryRepository(): void {
  storyRepository = new UnconfiguredStoryRepository();
}
