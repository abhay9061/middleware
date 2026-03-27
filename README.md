# Middleware Service

Express + TypeScript middleware service for managing students with caching and a queue-based V2 flow.

## Features
- CRUD APIs for students (Supabase backend)
- Redis caching for GET requests (with `Cache-Control` support)
- API key protection via `x-api-key`
- BullMQ queue + worker for async create/update/delete (V2)

## Tech Stack
- Node.js, TypeScript, Express
- Supabase (database)
- Redis + BullMQ (cache + queue)

## Requirements
- Node.js 18+
- Redis instance
- Supabase project (table: `student`)

## Environment Variables
Create a `.env` file in the project root:

```env
PORT=3000
REDIS_URL=redis://localhost:6379
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Install

```bash
npm install
```

## Run

```bash
# Dev (hot reload)
npm run dev

# Start (ts-node)
npm start

# Build
npm run build

# Worker (BullMQ)
npm run worker
```

## API

Base URL: `http://localhost:3000`

### Health
- `GET /`

### V1 (direct DB + cache)
All V1 routes require the `x-api-key` header (value: `intern-access-123`).

- `POST /students`
- `GET /students` (supports `?course=...&page=...&limit=...`)
- `GET /students/:id`
- `PUT /students/:id`
- `DELETE /students/:id`

Caching notes:
- GET requests are cached in Redis for 1 hour.
- Set `Cache-Control: no-store` to bypass read/write.
- Set `Cache-Control: no-cache` to bypass cache read only.
- Responses include `X-Cache: HIT|MISS|BYPASS`.

### V2 (queue-based)
All V2 routes require the `x-api-key` header (value: `intern-access-123`). These endpoints enqueue jobs; the worker processes them.

- `POST /v2/students`
- `PUT /v2/students/:id`
- `DELETE /v2/students/:id`

## Notes
- Run the API server and the worker in separate terminals.
- Update the API key or move it to `.env` for production use.
