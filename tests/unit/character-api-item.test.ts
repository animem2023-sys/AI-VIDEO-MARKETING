import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { PATCH, DELETE } from "@/app/api/projects/[id]/characters/[characterId]/route";
import {
  resetCharacterRepository,
  setCharacterRepositoryForTests,
} from "@/lib/characters/repository-provider";
import type {
  CharacterRepository,
  CharacterRecord,
} from "@/lib/characters/repository";

const baseCharacter: CharacterRecord = {
  id: "character-1",
  projectId: "project-1",
  name: "Nam chính",
  description: "Nhân vật thử nghiệm",
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
  let character: CharacterRecord | null = { ...baseCharacter };

  return {
    async findByProjectId(projectId) {
      return character && character.projectId === projectId ? [character] : [];
    },

    async findById(characterId) {
      return character?.id === characterId ? character : null;
    },

    async create(projectId, input) {
      if (!character) {
        throw new Error("Character not found.");
      }

      character = {
        ...character,
        ...input,
        id: "character-new",
        projectId,
        status: "UNLOCKED",
      };

      return character;
    },

    async update(characterId, input) {
      if (!character) {
        throw new Error("Character not found.");
      }

      character = {
        ...character,
        ...input,
        id: characterId,
      };

      return character;
    },

    async delete(characterId) {
      if (character?.id === characterId) {
        character = null;
      }
    },
  };
}

beforeEach(() => {
  setCharacterRepositoryForTests(createFakeRepository());
});

afterEach(() => {
  resetCharacterRepository();
});

describe("Character item API", () => {
  it("PATCH updates an unlocked character through the API service", async () => {
    const request = new Request(
      "http://localhost/api/projects/project-1/characters/character-1",
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: "Nhân vật đã cập nhật",
          personality: "Điềm tĩnh",
        }),
      },
    );

    const response = await PATCH(request, {
      params: Promise.resolve({
        id: "project-1",
        characterId: "character-1",
      }),
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.character.id).toBe("character-1");
    expect(data.character.projectId).toBe("project-1");
    expect(data.character.name).toBe("Nhân vật đã cập nhật");
    expect(data.character.personality).toBe("Điềm tĩnh");
  });

  it("PATCH rejects an invalid character update", async () => {
    const request = new Request(
      "http://localhost/api/projects/project-1/characters/character-1",
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: "",
        }),
      },
    );

    const response = await PATCH(request, {
      params: Promise.resolve({
        id: "project-1",
        characterId: "character-1",
      }),
    });

    expect(response.status).toBe(400);
  });

  it("PATCH does not allow the client to set status", async () => {
    const request = new Request(
      "http://localhost/api/projects/project-1/characters/character-1",
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          personality: "Điềm tĩnh",
          status: "LOCKED",
        }),
      },
    );

    const response = await PATCH(request, {
      params: Promise.resolve({
        id: "project-1",
        characterId: "character-1",
      }),
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.character.personality).toBe("Điềm tĩnh");
    expect(data.character.status).toBe("UNLOCKED");
  });

  it("PATCH returns 404 when character does not exist", async () => {
    const request = new Request(
      "http://localhost/api/projects/project-1/characters/missing",
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          personality: "Điềm tĩnh",
        }),
      },
    );

    const response = await PATCH(request, {
      params: Promise.resolve({
        id: "project-1",
        characterId: "missing",
      }),
    });

    expect(response.status).toBe(404);
  });

  it("PATCH returns 404 when character belongs to another project", async () => {
    setCharacterRepositoryForTests({
      ...createFakeRepository(),
      async findById() {
        return {
          ...baseCharacter,
          projectId: "project-other",
        };
      },
    });

    const request = new Request(
      "http://localhost/api/projects/project-1/characters/character-1",
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          personality: "Điềm tĩnh",
        }),
      },
    );

    const response = await PATCH(request, {
      params: Promise.resolve({
        id: "project-1",
        characterId: "character-1",
      }),
    });

    expect(response.status).toBe(404);
  });

  it("PATCH returns 409 when character is LOCKED", async () => {
    setCharacterRepositoryForTests({
      ...createFakeRepository(),
      async findById() {
        return {
          ...baseCharacter,
          status: "LOCKED",
        };
      },
    });

    const request = new Request(
      "http://localhost/api/projects/project-1/characters/character-1",
      {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          personality: "Điềm tĩnh",
        }),
      },
    );

    const response = await PATCH(request, {
      params: Promise.resolve({
        id: "project-1",
        characterId: "character-1",
      }),
    });

    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.error).toContain("LOCKED");
  });

  it("DELETE removes the character and returns identifiers", async () => {
    const response = await DELETE(new Request("http://localhost"), {
      params: Promise.resolve({
        id: "project-1",
        characterId: "character-1",
      }),
    });

    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.projectId).toBe("project-1");
    expect(data.characterId).toBe("character-1");
    expect(data.deleted).toBe(true);

    const secondResponse = await DELETE(new Request("http://localhost"), {
      params: Promise.resolve({
        id: "project-1",
        characterId: "character-1",
      }),
    });

    expect(secondResponse.status).toBe(404);
  });

  it("DELETE returns 404 when character does not exist", async () => {
    const response = await DELETE(new Request("http://localhost"), {
      params: Promise.resolve({
        id: "project-1",
        characterId: "missing",
      }),
    });

    expect(response.status).toBe(404);
  });

  it("DELETE returns 404 when character belongs to another project", async () => {
    setCharacterRepositoryForTests({
      ...createFakeRepository(),
      async findById() {
        return {
          ...baseCharacter,
          projectId: "project-other",
        };
      },
    });

    const response = await DELETE(new Request("http://localhost"), {
      params: Promise.resolve({
        id: "project-1",
        characterId: "character-1",
      }),
    });

    expect(response.status).toBe(404);
  });
});