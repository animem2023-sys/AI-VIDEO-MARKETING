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
    name: "Nhân vật thử nghiệm",
    description: "Mô tả nhân vật",
    appearance: {
      gender: "Nam",
      age: 25,
      ethnicity: "Châu Á",
      height: "178 cm",
      bodyType: "Cân đối",
      face: "Thân thiện",
      hair: "Tóc đen",
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
      { name: "Nhân vật đã cập nhật" },
    );

    expect(result.name).toBe("Nhân vật đã cập nhật");
    expect(repository.updatedInput?.name).toBe("Nhân vật đã cập nhật");
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
        { name: "Không được cập nhật" },
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
        { name: "Nhân vật mới" },
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
        { name: "Không được cập nhật" },
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
        name: "Nhân vật mới",
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
    expect(result.name).toBe("Nhân vật mới");
    expect(repository.createdInput?.name).toBe("Nhân vật mới");
  });
});
