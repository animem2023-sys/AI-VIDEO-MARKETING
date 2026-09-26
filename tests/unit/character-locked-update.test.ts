import { describe, expect, it } from "vitest";
import { updateCharacter } from "@/lib/characters/service";

const unlockedCharacter = {
  id: "character-1",
  projectId: "project-1",
  name: "Nhân v?t chính",
  description: "Nhân v?t th? nghi?m",
  appearance: {
    gender: "Nam",
    age: 25,
    ethnicity: "Vi?t Nam",
    height: "178 cm",
    bodyType: "Cân ð?i",
    face: "Thân thi?n",
    hair: "Ðen g?n gàng",
    eyes: "Nâu",
  },
  wardrobe: {
    outfit: "Áo sõ mi tr?ng",
    shoes: "Giày ðen",
    accessories: null,
  },
  personality: "Vui v?",
  voice: "Nam tr?",
  behavior: "Thân thi?n",
  status: "UNLOCKED" as const,
};

const lockedCharacter = {
  ...unlockedCharacter,
  status: "LOCKED" as const,
};

describe("Character locked update rule", () => {
  it("allows update when character is UNLOCKED", () => {
    const result = updateCharacter(unlockedCharacter, {
      personality: "Ði?m t?nh",
    });

    expect(result.personality).toBe("Ði?m t?nh");
    expect(result.status).toBe("UNLOCKED");
  });

  it("rejects update when character is LOCKED", () => {
    expect(() =>
      updateCharacter(lockedCharacter, {
        personality: "Ði?m t?nh",
      }),
    ).toThrow(/Character .*LOCKED/);
  });
});

