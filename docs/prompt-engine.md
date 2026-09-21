# Prompt engine V1
Story và video prompt phải đi qua `AIProvider` để thay thế provider mà không làm business logic phụ thuộc Gemini/OpenAI. Input prompt phải lấy product facts đã verified/locked và character locked. Phase 1 chỉ dùng `MockAIProvider`, không gọi API AI thật.
