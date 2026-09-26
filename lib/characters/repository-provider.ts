import type { CharacterRepository } from "@/lib/characters/repository";
import { prismaCharacterRepository } from "@/lib/characters/prisma-repository";

let characterRepository: CharacterRepository = prismaCharacterRepository;

export function getCharacterRepository(): CharacterRepository {
  return characterRepository;
}

export function setCharacterRepositoryForTests(
  repository: CharacterRepository,
): void {
  characterRepository = repository;
}

export function resetCharacterRepository(): void {
  characterRepository = prismaCharacterRepository;
}
