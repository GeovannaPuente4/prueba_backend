# Notes API — Frontend Contract

Base URL (local): `http://localhost:3000`

All request and response bodies are JSON (`Content-Type: application/json`), except `204` responses, which have no body.

## Authentication

- Authentication is cookie-based. `POST /auth/login` sets a `token` cookie (JWT, valid for 1 hour).
- The browser sends the cookie automatically. Every request must include credentials:
  - `fetch`: `fetch(url, { credentials: "include" })`
  - `axios`: `axios.create({ withCredentials: true })`
- The allowed frontend origin is configured on the backend through `CORS_ORIGIN`.
- Endpoints marked **Auth** return `401` when the cookie is missing, invalid, or expired.

## Data types

```ts
type User = {
  id: number;
  email: string;
  createdAt: string; // ISO 8601
};

type Note = {
  id: number;
  title: string;
  content: string;
  userId: number;
  createdAt: string;        // ISO 8601
  updateAt: string | null;  // ISO 8601, null until the note is edited
};
```

## Errors

Business errors:

```json
{ "error": "Invalid credentials" }
```

Validation errors (`400`) — the body failed validation:

```json
{
  "success": false,
  "error": { "name": "ZodError", "message": "<JSON-encoded list of issues>" }
}
```

| Status | Meaning |
|---|---|
| 400 | Invalid body or path parameter |
| 401 | Not authenticated / invalid credentials |
| 404 | Resource not found |
| 409 | Email already registered |
| 500 | Unexpected server error |

---

## Auth endpoints

### `POST /auth/register`

Creates a new user. Does not log in.

Request:

```json
{ "email": "user@example.com", "password": "secret123" }
```

| Field | Rules |
|---|---|
| `email` | Valid email |
| `password` | String, 6–60 characters |

Responses:
- `201` → `User`
- `400` → validation error
- `409` → `{ "error": "Email already registered" }`

### `POST /auth/login`

Request: same body as register.

Responses:
- `200` → `{ "user": User }` and sets the `token` cookie
- `400` → validation error
- `401` → `{ "error": "Invalid credentials" }`

### `POST /auth/logout`

Clears the `token` cookie.

Responses:
- `204` → no body

### `GET /auth/me` — **Auth**

Returns the logged-in user. Use it to restore the session on page load.

Responses:
- `200` → `User`
- `401` → not authenticated

---

## Notes endpoints

All notes endpoints require **Auth**.

### `GET /notes`

Lists the logged-in user's notes.

Responses:
- `200` → `Note[]` (empty array when the user has no notes)

### `POST /notes`

Creates a note for the logged-in user.

Request:

```json
{ "title": "Groceries", "content": "Milk, eggs" }
```

| Field | Rules |
|---|---|
| `title` | String, 1–255 characters (trimmed) |
| `content` | String, at least 1 character (trimmed) |

Responses:
- `201` → `Note`
- `400` → validation error

### `PATCH /notes/:id`

Updates the note with the given `id`. Send only the fields to change; at least one is required.

Request:

```json
{ "title": "New title" }
```

| Field | Rules |
|---|---|
| `title` | Optional, string, 1–255 characters |
| `content` | Optional, string, at least 1 character |

Responses:
- `200` → updated `Note`
- `400` → validation error (including invalid `id`)
- `404` → `{ "error": "Note not found" }`

### `DELETE /notes/:id`

Deletes the logged-in user's note with the given `id`.

Responses:
- `204` → no body
- `400` → invalid `id`
- `404` → `{ "error": "Note not found" }`

---

## Health check

### `GET /health`

Responses:
- `200` → `{ "status": "ok" }`
