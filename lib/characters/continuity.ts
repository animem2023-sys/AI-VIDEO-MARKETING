import type { Character } from "@/lib/characters/schema";

export function canUpdateCharacter(character: Character): boolean {
  return character.status === "UNLOCKED";
}

export function assertCharacterEditable(character: Character): void {
  if (!canUpdateCharacter(character)) {
    throw new Error("Character đang LOCKED và không thể chỉnh sửa.");
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
