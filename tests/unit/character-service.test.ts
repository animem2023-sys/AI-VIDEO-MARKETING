import { describe, expect, it } from "vitest";
import {
  setCharacterLock,
  updateCharacter,
  validateCharacter,
} from "@/lib/characters/service";

const baseCharacter = {
  name: "Test Character",
  description: "Nhân vật dùng để kiểm thử.",
  appearance: {
    gender: "Nam",
    age: 25,
    ethnicity: "Châu Á",
    height: "178 cm",
    bodyType: "Cân đối",
    face: "Thân thiện",
    hair: "Đen",
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
  status: "UNLOCKED" as const,
};

describe("character service", () => {
  it("validates a character", () => {
    expect(validateCharacter(baseCharacter)).toEqual(baseCharacter);
  });

  it("updates an unlocked character", () => {
    const updated = updateCharacter(baseCharacter, {
      description: "Mô tả mới.",
    });

    expect(updated.description).toBe("Mô tả mới.");
    expect(updated.status).toBe("UNLOCKED");
  });

  it("rejects updating a locked character", () => {
    const locked = setCharacterLock(baseCharacter, true);

    expect(() =>
      updateCharacter(locked, {
        description: "Không được phép thay đổi.",
      }),
    ).toThrow("Character đang LOCKED và không thể chỉnh sửa.");
  });
});
