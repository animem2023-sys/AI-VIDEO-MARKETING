import type {
  CharacterCreateRequest,
  CharacterUpdateRequest,
} from "@/lib/characters/request-schema";
import type {
  CharacterRecord,
  CharacterRepository,
} from "@/lib/characters/repository";
import { CharacterLockedError } from "@/lib/characters/continuity";
import { updateCharacter } from "@/lib/characters/service";

export class CharacterNotFoundError extends Error {
  constructor() {
    super("Character not found.");
    this.name = "CharacterNotFoundError";
  }
}

export class CharacterProjectMismatchError extends Error {
  constructor() {
    super("Character does not belong to project.");
    this.name = "CharacterProjectMismatchError";
  }
}

export async function updateProjectCharacter(
  repository: CharacterRepository,
  projectId: string,
  characterId: string,
  input: CharacterUpdateRequest,
): Promise<CharacterRecord> {
  const current = await repository.findById(characterId);

  if (!current) {
    throw new CharacterNotFoundError();
  }

  if (current.projectId !== projectId) {
    throw new CharacterProjectMismatchError();
  }

  const updated = updateCharacter(current, input);

  return repository.update(characterId, {
    ...input,
    name: updated.name,
    description: updated.description,
    appearance: updated.appearance,
    wardrobe: updated.wardrobe,
    personality: updated.personality,
    voice: updated.voice,
    behavior: updated.behavior,
  });
}

export async function createProjectCharacter(
  repository: CharacterRepository,
  projectId: string,
  input: CharacterCreateRequest,
): Promise<CharacterRecord> {
  return repository.create(projectId, input);
}

export async function listProjectCharacters(
  repository: CharacterRepository,
  projectId: string,
): Promise<CharacterRecord[]> {
  return repository.findByProjectId(projectId);
}

export async function deleteProjectCharacter(
  repository: CharacterRepository,
  projectId: string,
  characterId: string,
): Promise<void> {
  const current = await repository.findById(characterId);

  if (!current) {
    throw new CharacterNotFoundError();
  }

  if (current.projectId !== projectId) {
    throw new CharacterProjectMismatchError();
  }

  await repository.delete(characterId);
}
