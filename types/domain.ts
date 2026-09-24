export const productStatuses = ["DRAFT", "EXTRACTED", "VERIFIED", "LOCKED"] as const;
export type ProductStatus = (typeof productStatuses)[number];

export type ProductFeature = {
  id: string;
  label: string;
  verified: boolean;
};

export type ProductSpecification = {
  id: string;
  name: string;
  value: string | null;
  unit: string | null;
  verified: boolean;
};

export type Product = {
  id: string;
  projectId: string;
  name: string | null;
  brand: string | null;
  model: string | null;
  originalPrice: string | null;
  salePrice: string | null;
  warranty: string | null;
  sourceUrl: string | null;
  status: ProductStatus;
  specifications: ProductSpecification[];
  features: ProductFeature[];
};

export type CharacterAppearance = {
  gender: string | null;
  age: number | null;
  ethnicity: string | null;
  height: string | null;
  bodyType: string | null;
  face: string | null;
  hair: string | null;
  eyes: string | null;
};

export type CharacterWardrobe = {
  outfit: string | null;
  shoes: string | null;
  accessories: string | null;
};

export type Character = {
  id: string;
  projectId: string;
  name: string;
  description: string | null;
  appearance: CharacterAppearance;
  wardrobe: CharacterWardrobe;
  personality: string | null;
  voice: string | null;
  behavior: string | null;
  status: "LOCKED" | "UNLOCKED";
};

export type Campaign = {
  id: string;
  projectId: string;
  name: string;
  objective: string | null;
};

export type VideoPrompt = {
  id: string;
  campaignId: string | null;
  sequence: number;
  prompt: string;
  status: string;
};

export type QAResult = {
  id: string;
  videoPromptId: string;
  passed: boolean;
  findings: string[];
};
