import { describe, expect, it } from "vitest";
import {
  assertCharacterEditable,
  canUpdateCharacter,
  lockCharacter,
  unlockCharacter,
} from "@/lib/characters/continuity";
import type { Character } from "@/lib/characters/schema";

const baseCharacter: Character = {
  name: "Linh",
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
  status: "UNLOCKED",
};

describe("character continuity", () => {
  it("allows updates when character is UNLOCKED", () => {
    expect(canUpdateCharacter(baseCharacter)).toBe(true);
    expect(() => assertCharacterEditable(baseCharacter)).not.toThrow();
  });

  it("rejects updates when character is LOCKED", () => {
    const lockedCharacter = lockCharacter(baseCharacter);

    expect(canUpdateCharacter(lockedCharacter)).toBe(false);
    expect(() => assertCharacterEditable(lockedCharacter)).toThrow(
      "Character đang LOCKED và không thể chỉnh sửa.",
    );
  });

  it("locks an unlocked character", () => {
    const lockedCharacter = lockCharacter(baseCharacter);

    expect(lockedCharacter.status).toBe("LOCKED");
    expect(baseCharacter.status).toBe("UNLOCKED");
  });

  it("unlocks a locked character", () => {
    const lockedCharacter = lockCharacter(baseCharacter);
    const unlockedCharacter = unlockCharacter(lockedCharacter);

    expect(unlockedCharacter.status).toBe("UNLOCKED");
  });
});
