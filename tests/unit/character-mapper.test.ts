import { describe, expect, it } from "vitest";
import {
  toCharacterResponse,
  type CharacterRecord,
} from "@/lib/characters";

describe("character mapper", () => {
  it("maps a character record to an API response", () => {
    const record: CharacterRecord = {
      id: "char-001",
      projectId: "project-001",
      name: "Test Character",
      description: "Nhân vật kiểm thử.",
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
      status: "UNLOCKED",
    };

    const result = toCharacterResponse(record);

    expect(result).toEqual(record);
    expect(result.id).toBe("char-001");
    expect(result.projectId).toBe("project-001");
  });
});
