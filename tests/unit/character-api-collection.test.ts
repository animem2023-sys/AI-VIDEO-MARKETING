import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { GET, POST } from "@/app/api/projects/[id]/characters/route";
import type {
  CharacterRecord,
  CharacterRepository,
} from "@/lib/characters/repository";
import {
  resetCharacterRepository,
  setCharacterRepositoryForTests,
} from "@/lib/characters/repository-provider";

const baseCharacter: CharacterRecord = {
  id: "character-1",
  projectId: "project-001",
  name: "Test Character",
  description: "Nhân vật thử nghiệm.",
  appearance: {
    gender: "Nam",
    age: 25,
    ethnicity: "Việt Nam",
    height: "178 cm",
    bodyType: "Cân đối",
    face: "Thân thiện",
    hair: "Đen",
    eyes: "Nâu",
  },
  wardrobe: {
    outfit: "Áo sơ mi trắng",
    shoes: "Giày đen",
    accessories: null,
  },
  personality: "Vui vẻ",
  voice: "Nam trẻ",
  behavior: "Tự nhiên",
  status: "UNLOCKED",
};

function createFakeRepository(): CharacterRepository {
  let characters: CharacterRecord[] = [{ ...baseCharacter }];

  return {
    async findByProjectId(projectId) {
      return characters.filter((character) => character.projectId === projectId);
    },

    async findById(characterId) {
      return (
        characters.find((character) => character.id === characterId) ?? null
      );
    },

    async create(projectId, input) {
      const character: CharacterRecord = {
        ...baseCharacter,
        ...input,
        id: "character-new",
        projectId,
        status: "UNLOCKED",
      };

      characters = [...characters, character];

      return character;
    },

    async update(characterId, input) {
      const index = characters.findIndex(
        (character) => character.id === characterId,
      );

      if (index === -1) {
        throw new Error("Character not found.");
      }

      const updated: CharacterRecord = {
        ...characters[index],
        ...input,
        id: characterId,
      };

      characters[index] = updated;

      return updated;
    },

    async delete(characterId) {
      characters = characters.filter(
        (character) => character.id !== characterId,
      );
    },
  };
}

beforeEach(() => {
  setCharacterRepositoryForTests(createFakeRepository());
});

afterEach(() => {
  resetCharacterRepository();
});

describe("Character API collection route", () => {
  it("GET returns characters from the repository", async () => {
    const response = await GET(
      new Request("http://localhost/api/projects/project-001/characters"),
      {
        params: Promise.resolve({ id: "project-001" }),
      },
    );

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.characters).toHaveLength(1);
    expect(data.characters[0]).toEqual(baseCharacter);
  });

  it("POST creates a character through the repository", async () => {
    const response = await POST(
      new Request("http://localhost/api/projects/project-001/characters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "New Character",
          description: "Nhân vật mới.",
        }),
      }),
      {
        params: Promise.resolve({ id: "project-001" }),
      },
    );

    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.character.id).toBe("character-new");
    expect(data.character.projectId).toBe("project-001");
    expect(data.character.name).toBe("New Character");
    expect(data.character.status).toBe("UNLOCKED");
  });

  it("POST rejects invalid character data", async () => {
    const response = await POST(
      new Request("http://localhost/api/projects/project-001/characters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "",
        }),
      }),
      {
        params: Promise.resolve({ id: "project-001" }),
      },
    );

    expect(response.status).toBe(400);
  });

  it("POST does not allow the client to set character status", async () => {
    const response = await POST(
      new Request("http://localhost/api/projects/project-001/characters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Locked Bypass Attempt",
          status: "LOCKED",
        }),
      }),
      {
        params: Promise.resolve({ id: "project-001" }),
      },
    );

    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.character.status).toBe("UNLOCKED");
  });
});