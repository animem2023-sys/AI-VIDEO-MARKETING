import { describe, expect, it } from "vitest";
import {
  CharacterNotFoundError,
  CharacterProjectMismatchError,
  createProjectCharacter,
  deleteProjectCharacter,
  updateProjectCharacter,
} from "@/lib/characters/api-service";
import type {
  CharacterCreateRequest,
  CharacterUpdateRequest,
} from "@/lib/characters/request-schema";
import type {
  CharacterRecord,
  CharacterRepository,
} from "@/lib/characters/repository";

function createCharacterRecord(
  overrides: Partial<CharacterRecord> = {},
): CharacterRecord {
  return {
    id: "char-001",
    projectId: "project-001",
    name: "Nh�n v?t th? nghi?m",
    description: "M� t? nh�n v?t",
    appearance: {
      gender: "Nam",
      age: 25,
      ethnicity: "Ch�u �",
      height: "178 cm",
      bodyType: "C�n �?i",
      face: "Th�n thi?n",
      hair: "T�c �en",
      eyes: "N�u",
    },
    wardrobe: {
      outfit: "�o s� mi tr?ng",
      shoes: "Gi�y �en",
      accessories: null,
    },
    personality: "Vui v?",
    voice: "Nam tr?",
    behavior: "T? nhi�n",
    status: "UNLOCKED",
    ...overrides,
  };
}

function createFakeRepository(
  initialCharacter: CharacterRecord | null,
): CharacterRepository & {
  updatedInput: CharacterUpdateRequest | null;
  createdInput: CharacterCreateRequest | null;
} {
  let character = initialCharacter;
  let updatedInput: CharacterUpdateRequest | null = null;
  let createdInput: CharacterCreateRequest | null = null;

  return {
    get updatedInput() {
      return updatedInput;
    },

    get createdInput() {
      return createdInput;
    },

    async findByProjectId(projectId) {
      return character?.projectId === projectId ? [character] : [];
    },

    async findById() {
      return character;
    },

    async create(projectId, input) {
      createdInput = input;

      character = createCharacterRecord({
        projectId,
        ...input,
      });

      return character;
    },

    async update(characterId, input) {
      if (!character || character.id !== characterId) {
        throw new Error("Character not found");
      }

      updatedInput = input;

      character = {
        ...character,
        ...input,
        id: character.id,
        projectId: character.projectId,
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

describe("character api service", () => {
  it("updates an unlocked character", async () => {
    const repository = createFakeRepository(createCharacterRecord());

    const result = await updateProjectCharacter(
      repository,
      "project-001",
      "char-001",
      { name: "Nh�n v?t �? c?p nh?t" },
    );

    expect(result.name).toBe("Nh�n v?t �? c?p nh?t");
    expect(repository.updatedInput?.name).toBe("Nh�n v?t �? c?p nh?t");
  });

  it("rejects update when character is locked", async () => {
    const repository = createFakeRepository(
      createCharacterRecord({ status: "LOCKED" }),
    );

    await expect(
      updateProjectCharacter(
        repository,
        "project-001",
        "char-001",
        { name: "Kh�ng ��?c c?p nh?t" },
      ),
    ).rejects.toThrow(/LOCKED/);
  });

  it("rejects update when character does not exist", async () => {
    const repository = createFakeRepository(null);

    await expect(
      updateProjectCharacter(
        repository,
        "project-001",
        "char-001",
        { name: "Nh�n v?t m?i" },
      ),
    ).rejects.toBeInstanceOf(CharacterNotFoundError);
  });

  it("rejects update when character belongs to another project", async () => {
    const repository = createFakeRepository(
      createCharacterRecord({ projectId: "project-002" }),
    );

    await expect(
      updateProjectCharacter(
        repository,
        "project-001",
        "char-001",
        { name: "Kh�ng ��?c c?p nh?t" },
      ),
    ).rejects.toBeInstanceOf(CharacterProjectMismatchError);
  });

  it("deletes an existing character", async () => {
    const repository = createFakeRepository(createCharacterRecord());

    await deleteProjectCharacter(repository, "project-001", "char-001");

    await expect(
      deleteProjectCharacter(repository, "project-001", "char-001"),
    ).rejects.toBeInstanceOf(CharacterNotFoundError);
  });

  it("rejects delete when character does not exist", async () => {
    const repository = createFakeRepository(null);

    await expect(
      deleteProjectCharacter(repository, "project-001", "char-001"),
    ).rejects.toBeInstanceOf(CharacterNotFoundError);
  });

  it("rejects delete when character belongs to another project", async () => {
    const repository = createFakeRepository(
      createCharacterRecord({ projectId: "project-002" }),
    );

    await expect(
      deleteProjectCharacter(repository, "project-001", "char-001"),
    ).rejects.toBeInstanceOf(CharacterProjectMismatchError);
  });

  it("creates a character through the repository", async () => {
    const repository = createFakeRepository(null);

    const result = await createProjectCharacter(
      repository,
      "project-001",
      {
        name: "Nh�n v?t m?i",
        description: null,
        appearance: {
          gender: null,
          age: null,
          ethnicity: null,
          height: null,
          bodyType: null,
          face: null,
          hair: null,
          eyes: null,
        },
        wardrobe: {
          outfit: null,
          shoes: null,
          accessories: null,
        },
        personality: null,
        voice: null,
        behavior: null,
      },
    );

    expect(result.projectId).toBe("project-001");
    expect(result.name).toBe("Nh�n v?t m?i");
    expect(repository.createdInput?.name).toBe("Nh�n v?t m?i");
  });
});
