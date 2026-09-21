export type StoryRequest = { productName: string | null; objective: string | null };
export type PromptRequest = { story: string; videoNumber: number };
export type PromptValidation = { passed: boolean; findings: string[] };
export interface AIProvider { generateStory(input: StoryRequest): Promise<string>; generatePrompt(input: PromptRequest): Promise<string>; validatePrompt(prompt: string): Promise<PromptValidation>; }
