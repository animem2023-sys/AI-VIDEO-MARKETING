import { prisma } from "@/lib/db/client";
import type { CharacterRecord, CharacterRepository } from "@/lib/characters/repository";
import type {
  CharacterCreateRequest,
  CharacterUpdateRequest,
} from "@/lib/characters/request-schema";
import { characterSchema } from "@/lib/characters/schema";

function toDomainCharacter(record: {
  id: string;
  projectId: string;
  name: string;
  description: string | null;
  appearance: unknown;
  wardrobe: unknown;
  personality: string | null;
  voice: string | null;
  behavior: string | null;
  status: "LOCKED" | "UNLOCKED";
}): CharacterRecord {
  const character = characterSchema.parse({
    name: record.name,
    description: record.description,
    appearance: record.appearance,
    wardrobe: record.wardrobe,
    personality: record.personality,
    voice: record.voice,
    behavior: record.behavior,
    status: record.status,
  });

  return {
    ...character,
    id: record.id,
    projectId: record.projectId,
  };
}

export const prismaCharacterRepository: CharacterRepository = {
  async findByProjectId(projectId) {
    const records = await prisma.character.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" },
    });

    return records.map(toDomainCharacter);
  },

  async findById(characterId) {
    const record = await prisma.character.findUnique({
      where: { id: characterId },
    });

    return record ? toDomainCharacter(record) : null;
  },

  async create(projectId, input: CharacterCreateRequest) {
    const record = await prisma.character.create({
      data: {
        projectId,
        name: input.name,
        description: input.description,
        appearance: input.appearance,
        wardrobe: input.wardrobe,
        personality: input.personality,
        voice: input.voice,
        behavior: input.behavior,
      },
    });

    return toDomainCharacter(record);
  },

  async update(characterId, input: CharacterUpdateRequest) {
    const record = await prisma.character.update({
      where: { id: characterId },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.description !== undefined && {
          description: input.description,
        }),
        ...(input.appearance !== undefined && {
          appearance: input.appearance,
        }),
        ...(input.wardrobe !== undefined && {
          wardrobe: input.wardrobe,
        }),
        ...(input.personality !== undefined && {
          personality: input.personality,
        }),
        ...(input.voice !== undefined && { voice: input.voice }),
        ...(input.behavior !== undefined && {
          behavior: input.behavior,
        }),
      },
    });

    return toDomainCharacter(record);
  },

  async delete(characterId) {
    await prisma.character.delete({
      where: { id: characterId },
    });
  },
};
