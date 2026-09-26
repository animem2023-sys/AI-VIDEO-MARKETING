import { characterUpdateRequestSchema, type CharacterUpdateRequest } from "@/lib/characters/request-schema";
import { characterSchema, type Character } from "@/lib/characters/schema";
import {
  assertCharacterEditable,
  lockCharacter,
  unlockCharacter,
} from "@/lib/characters/continuity";

export function validateCharacter(input: unknown): Character {
  return characterSchema.parse(input);
}

export function updateCharacter(
  current: Character,
  input: CharacterUpdateRequest,
): Character {
  assertCharacterEditable(current);

  const validatedInput = characterUpdateRequestSchema.parse(input);

  return characterSchema.parse({
    ...current,
    ...validatedInput,
  });
}

export function setCharacterLock(
  current: Character,
  locked: boolean,
): Character {
  return locked ? lockCharacter(current) : unlockCharacter(current);
}
