import type { AIProvider } from "@/lib/ai/provider";
import type { Character } from "@/lib/characters/schema";
import type { VerifiedProductContext } from "@/lib/product-source/verified-context";

export type StoryRequest = {
  product: VerifiedProductContext;
  character: Character;
  objective: string | null;
};

export async function generateStory(
  provider: Pick<AIProvider, "generateStory">,
  input: StoryRequest,
): Promise<string> {
  if (input.character.status !== "LOCKED") {
    throw new Error("Character ph?i ðý?c LOCKED");
  }

  return provider.generateStory({
    product: input.product,
    character: input.character,
    objective: input.objective,
  });
}
