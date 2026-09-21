# Architecture V1
Next.js App Router cung cấp UI/routes. `components` chứa presentational UI; `lib` là domain boundary; `lib/ai` chỉ exposes `AIProvider`; `lib/validation` sở hữu Zod. Prisma dùng PostgreSQL và tách Project → Product/Character/Campaign → VideoPrompt → QAResult. Fact extraction, continuity và QA chưa gọi external service ở Phase 1.
