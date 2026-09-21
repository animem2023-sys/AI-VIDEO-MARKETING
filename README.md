# AI VIDEO PROMPT STUDIO
Foundation cho studio biến dữ liệu sản phẩm thật thành chuỗi prompt video Gemini nhất quán.

## Setup
```bash
cp .env.example .env
npm install
npm run dev
```

Mở **`http://localhost:3000`**. Cấu hình **`DATABASE_URL`** PostgreSQL-compatible trong **`.env`**; Phase 1 không yêu cầu database runtime.

## Checks
```bash
npm run lint
npm test
npm run build
```

Tạo Prisma client sau khi dependencies và **`DATABASE_URL`** sẵn sàng: **`npm run prisma:generate`**.
