import type { Character } from "@/lib/characters/schema";

export class CharacterLockedError extends Error {
  constructor() {
    super("Character đang LOCKED và không thể chỉnh sửa.");
    this.name = "CharacterLockedError";
  }
}

export function canUpdateCharacter(character: Character): boolean {
  return character.status === "UNLOCKED";
}

export function assertCharacterEditable(character: Character): void {
  if (!canUpdateCharacter(character)) {
    throw new CharacterLockedError();
  }
}

export function lockCharacter(character: Character): Character {
  return {
    ...character,
    status: "LOCKED",
  };
}

export function unlockCharacter(character: Character): Character {
  return {
    ...character,
    status: "UNLOCKED",
  };
}