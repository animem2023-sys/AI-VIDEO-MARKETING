import { describe, expect, it } from "vitest";
import { MockAIProvider } from "@/lib/ai/mock-provider";
describe("MockAIProvider", () => { it("implements the AI provider operations", async () => { const provider = new MockAIProvider(); await expect(provider.generateStory({ productName: "Demo Washing Machine", objective: null })).resolves.toContain("Demo Washing Machine"); await expect(provider.generatePrompt({ story: "Story", videoNumber: 1 })).resolves.toContain("Mock prompt 1"); await expect(provider.validatePrompt("Prompt")).resolves.toEqual({ passed: true, findings: [] }); }); });
