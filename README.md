# Notes API

A small REST API for a personal notes app: users register, log in, and manage their own notes.

## Stack

- Node.js + TypeScript
- [Hono](https://hono.dev) (HTTP framework)
- PostgreSQL + [Drizzle ORM](https://orm.drizzle.team)
- JWT authentication (cookie-based)
- Zod (request validation)

## Requirements

- Node.js 22+
- npm
- Docker
- A PostgreSQL database

## Getting started

```bash
npm install
cp .env.example .env
```

Fill in `.env`:

| Variable | Description |
|---|---|
| `PORT` | HTTP port (default `3000`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret used to sign tokens |
| `CORS_ORIGIN` | Allowed frontend origin |

Run the migrations and start the server:

```bash
npx drizzle-kit migrate
npm run dev
```

Check it is up: `GET http://localhost:3000/health` → `{ "status": "ok" }`

### Running with Docker

```bash
docker build -t notes-api .
docker run -p 3000:3000 --env-file .env notes-api
```

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start in watch mode |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled build |
| `npx drizzle-kit generate` | Generate a migration from the schema |
| `npx drizzle-kit migrate` | Apply pending migrations |

## Project structure

```
src/
├── index.ts         # App entry: middlewares, routes, error handling
├── config.ts        # Environment variables
├── router.ts        # Route definitions
├── controler.ts     # HTTP layer (request/response)
├── servises.ts      # Business logic
├── repositorie.ts   # Data access (Drizzle)
├── middleware.ts    # Auth middleware
├── validators.ts    # Zod schemas
└── db/
    ├── index.ts     # Database client
    └── schemas.ts   # Table definitions
drizzle/             # Generated migrations
```

## API

The full contract (endpoints, payloads, errors) is in [`API_CONTRACT.md`](./API_CONTRACT.md).

---

## For the backend candidate

This API is already "finished", but users and QA have reported that it does not behave as expected and that it is not safe to ship.

Your task:

1. Get the project running locally (database included) and also with Docker.
2. Test every endpoint, both with an HTTP client and from the frontend.
3. Find the bugs and security issues. Compare the real behavior against `API_CONTRACT.md`.
4. Fix them, and keep the fixes small and focused.
5. Write a short report: for each problem, what was wrong, why it matters, and how you fixed it.

We value your reasoning as much as the fixes. If you are not sure something is a bug, explain your doubt.

## For the frontend developer

- Build against [`API_CONTRACT.md`](./API_CONTRACT.md).
- Authentication uses a cookie: every request must be sent with credentials (`credentials: "include"` / `withCredentials: true`).
- Set `CORS_ORIGIN` in `.env` to your frontend origin if needed.
