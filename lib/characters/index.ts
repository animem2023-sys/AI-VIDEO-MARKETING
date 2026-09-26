export { characterSchema } from "./schema";
export type { Character } from "./schema";

export {
  characterCreateRequestSchema,
  characterUpdateRequestSchema,
} from "./request-schema";
export type {
  CharacterCreateRequest,
  CharacterUpdateRequest,
} from "./request-schema";

export {
  characterResponseSchema,
  characterListResponseSchema,
} from "./response-schema";
export type {
  CharacterResponse,
  CharacterListResponse,
} from "./response-schema";

export {
  assertCharacterEditable,
  canUpdateCharacter,
  lockCharacter,
  unlockCharacter,
} from "./continuity";

export {
  setCharacterLock,
  updateCharacter,
  validateCharacter,
} from "./service";

export type { CharacterRepository } from "./repository";

export { toCharacterResponse } from "./mapper";
export type { CharacterRecord } from "./mapper";
