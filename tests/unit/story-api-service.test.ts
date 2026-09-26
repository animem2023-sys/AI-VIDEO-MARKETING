import { describe, expect, it } from "vitest";
import { MockAIProvider } from "@/lib/ai/mock-provider";
import { extractProduct } from "@/lib/product-source/product-extractor";
import { createVerifiedProductContext } from "@/lib/product-source/verified-context";
import { lockCharacter } from "@/lib/characters/continuity";
import type { Character } from "@/lib/characters/schema";
import {
  createProjectStory,
  deleteProjectStory,
  getProjectStory,
  listProjectStories,
  StoryNotFoundError,
  StoryProjectMismatchError,
  updateProjectStory,
} from "@/lib/story/api-service";
import { FakeStoryRepository } from "./fake-story-repository";

const baseCharacter: Character = {
  name: "Linh",
  description: "Nhân v?t chính",
  appearance: {
    gender: "female",
    age: 25,
    ethnicity: "Vietnamese",
    height: "165 cm",
    bodyType: "balanced",
    face: "friendly",
    hair: "black",
    eyes: "dark brown",
  },
  wardrobe: {
    outfit: "white shirt",
    shoes: "sneakers",
    accessories: null,
  },
  personality: "cheerful",
  voice: "warm",
  behavior: "natural",
  status: "UNLOCKED",
};

async function createStoryFixture() {
  const extraction = await extractProduct(new MockAIProvider(), {
    evidenceCandidates: [
      {
        text: "Máy gi?t Aqua 8 kg",
        sourceUrl: "https://example.com/product",
        context: null,
      },
    ],
    source: {
      url: "https://example.com/product",
      title: "Demo Washing Machine",
    },
  });

  return {
    product: createVerifiedProductContext(extraction),
    character: lockCharacter(baseCharacter),
  };
}

describe("Story API service", () => {
  it("creates and lists stories within a project", async () => {
    const repository = new FakeStoryRepository();
    const { product, character } = await createStoryFixture();

    const created = await createProjectStory(
      repository,
      "project-1",
      {
        title: "Câu chuy?n ð?u tiên",
        objective: "T?o video ng?n h?p d?n",
      },
      product,
      character,
      "N?i dung câu chuy?n m?u.",
    );

    expect(created.projectId).toBe("project-1");
    expect(created.status).toBe("GENERATED");

    const stories = await listProjectStories(repository, "project-1");

    expect(stories).toHaveLength(1);
    expect(stories[0].id).toBe(created.id);
  });

  it("rejects access to a story from another project", async () => {
    const repository = new FakeStoryRepository();
    const { product, character } = await createStoryFixture();

    const created = await createProjectStory(
      repository,
      "project-1",
      {
        title: "Story",
        objective: null,
      },
      product,
      character,
      "Story content",
    );

    await expect(
      getProjectStory(repository, "project-2", created.id),
    ).rejects.toBeInstanceOf(StoryProjectMismatchError);
  });

  it("rejects access to a missing story", async () => {
    const repository = new FakeStoryRepository();

    await expect(
      getProjectStory(repository, "project-1", "missing-story"),
    ).rejects.toBeInstanceOf(StoryNotFoundError);
  });

  it("updates only client-editable story metadata", async () => {
    const repository = new FakeStoryRepository();
    const { product, character } = await createStoryFixture();

    const created = await createProjectStory(
      repository,
      "project-1",
      {
        title: "Story c?",
        objective: "Objective c?",
      },
      product,
      character,
      "Content ph?i ðý?c b?o toàn.",
    );

    const updated = await updateProjectStory(
      repository,
      "project-1",
      created.id,
      {
        title: "Story m?i",
        objective: "Objective m?i",
      },
    );

    expect(updated.title).toBe("Story m?i");
    expect(updated.objective).toBe("Objective m?i");
    expect(updated.content).toBe("Content ph?i ðý?c b?o toàn.");
    expect(updated.productContext).toBe(product);
    expect(updated.character).toBe(character);
    expect(updated.status).toBe("GENERATED");
  });

  it("deletes a story only when it belongs to the project", async () => {
    const repository = new FakeStoryRepository();
    const { product, character } = await createStoryFixture();

    const created = await createProjectStory(
      repository,
      "project-1",
      {
        title: "Story c?n xóa",
        objective: null,
      },
      product,
      character,
      "Content",
    );

    await deleteProjectStory(repository, "project-1", created.id);

    await expect(
      getProjectStory(repository, "project-1", created.id),
    ).rejects.toBeInstanceOf(StoryNotFoundError);
  });
});
