import type { Character } from "@/lib/characters/schema";
import type {
  CharacterCreateRequest,
  CharacterUpdateRequest,
} from "@/lib/characters/request-schema";

export type CharacterRecord = Character & {
  id: string;
  projectId: string;
};

export interface CharacterRepository {
  findByProjectId(projectId: string): Promise<CharacterRecord[]>;
  findById(characterId: string): Promise<CharacterRecord | null>;
  create(
    projectId: string,
    input: CharacterCreateRequest,
  ): Promise<CharacterRecord>;
  update(
    characterId: string,
    input: CharacterUpdateRequest,
  ): Promise<CharacterRecord>;
  delete(characterId: string): Promise<void>;
}
