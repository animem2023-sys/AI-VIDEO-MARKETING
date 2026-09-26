import type { CharacterResponse } from "@/lib/characters/response-schema";
import type { CharacterRecord } from "@/lib/characters/repository";

export type { CharacterRecord };

export function toCharacterResponse(
  record: CharacterRecord,
): CharacterResponse {
  return {
    ...record,
  };
}
