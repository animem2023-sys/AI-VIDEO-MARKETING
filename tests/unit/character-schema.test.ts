import { describe, expect, it } from "vitest";
import { characterSchema } from "@/lib/characters/schema";
describe("characterSchema", () => { it("defaults a character to UNLOCKED", () => { expect(characterSchema.parse({ name: "Linh", description: null }).status).toBe("UNLOCKED"); }); it("requires a name", () => { expect(() => characterSchema.parse({ name: "", description: null })).toThrow(); }); });
