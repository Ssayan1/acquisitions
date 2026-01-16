# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Common commands

All commands are intended to be run from the repository root (`D:\aws\acquisitions`).

### Install dependencies

```bash path=null start=null
npm install
```

### Run the API in development

Uses Node's `--watch` flag to restart on changes.

```bash path=null start=null
npm run dev
```

The entrypoint chain is:
- `src/index.js` → imports `src/server.js`
- `src/server.js` → starts the HTTP server with Express app from `src/app.js`

### Linting and formatting

Run ESLint over the JavaScript codebase:

```bash path=null start=null
npm run lint
```

Auto-fix lint issues where possible:

```bash path=null start=null
npm run lint:fix
```

Format the codebase with Prettier:

```bash path=null start=null
npm run format
```

Check formatting without writing changes:

```bash path=null start=null
npm run format:check
```

### Database / migrations (Drizzle ORM)

Drizzle is configured via `drizzle.config.js` and models under `src/models`.

Generate migration files from the current schema:

```bash path=null start=null
npm run db:generate
```

Apply migrations to the database specified by `DATABASE_URL`:

```bash path=null start=null
npm run db:migrate
```

Open the Drizzle Studio UI:

```bash path=null start=null
npm run db:studio
```

Environment variable `DATABASE_URL` must be set (for example via `.env`) for these commands to work.

### Tests

A lightweight smoke test script is available to verify that the API is responding correctly on the expected ports.

1. In one terminal, start the dev server:

```bash
npm run dev
```

2. In another terminal, run the smoke checks:

```bash
npm run test:smoke
```

The smoke script (`scripts/smoke-check.js`) will hit:
- `GET /`
- `GET /health`
- `GET /api`
- `GET /api/auth/sign-in`

All of these should return HTTP 200 when the server is running. If any of them fail, the script will exit with a non-zero status, which is suitable for CI.

## Project architecture

This is a Node.js / Express HTTP API using ECMAScript modules (`"type": "module"` in `package.json`), Drizzle ORM for Postgres, Neon as the database driver, Zod for validation (not yet wired), and Winston for logging.

### Entry point and server bootstrapping

- `src/index.js`
  - Minimal entrypoint that imports `./server.js` to start the application.
- `src/server.js`
  - Imports the Express app from `./app.js`.
  - Reads `process.env.PORT` (default `4000`) and calls `app.listen(PORT, ...)`.
  - This is the process-level boundary; application concerns live in `app.js` and below.

### HTTP application setup (`src/app.js`)

`src/app.js` is the central composition point for the HTTP API:

- Creates the Express `app` instance.
- Wires **infrastructure middleware**:
  - `helmet()` for security headers.
  - `cors()` for CORS.
  - `express.json()` / `express.urlencoded({ extended: true })` for body parsing.
  - `cookie-parser` for cookie parsing.
  - `morgan('combined', { stream })` where `stream.write` forwards logs to the Winston logger from `src/config/logger.js`.
- Exposes **health and info endpoints**:
  - `GET /` — basic health check returning a JSON status message, logs access via the shared logger.
  - `GET /health` — returns status, current timestamp, and process uptime.
  - `GET /api` — simple welcome/info endpoint for the API.
- Mounts **feature routes**:
  - `app.use('/api/auth', authRoutes);` where `authRoutes` is defined in `src/routes/auth.routes.js`.
- Defines a **global error handler** at the end of the middleware chain:
  - Logs the error stack to `console.error` and returns a generic `500 Internal Server Error` JSON payload.

When adding new features, mirror this structure: define routes in `src/routes`, controllers in `src/controllers`, and mount the new router in `app.js` under the appropriate `/api/...` prefix.

### Path aliases and module system

This project uses Node ESM with import maps configured in `package.json` under the `imports` field:

- `#config/*` → `./src/config/*`
- `#models/*` → `./src/models/*`
- `#routes/*` → `./src/routes/*`
- `#controllers/*` → `./src/controllers/*`
- `#middleware/*` → `./src/middleware/*`
- `#services/*` → `./src/services/*`
- `#utils/*` → `./src/utils/*`
- `#validations/*` → `./src/validations/*`

Use these aliases instead of long relative paths when importing across layers, e.g. `import logger from '#config/logger.js';` as seen in `src/controllers/auth.controller.js`.

### Configuration and logging (`src/config`)

- `src/config/logger.js`
  - Creates a Winston logger with JSON output and timestamps.
  - Writes logs to the `logs/` directory at the project root:
    - `logs/error.log` for `error`-level and above.
    - `logs/combined.log` for all log messages.
  - Uses `process.env.LOG_LEVEL` (default `info`) to control log level.
  - In non-production (`NODE_ENV !== 'production'`), adds a colorized console transport for local development.
  - This logger is the shared logging primitive for the app (used in `app.js` and controllers).
- `src/config/database.js`
  - Currently empty placeholder. Actual Drizzle configuration lives in `drizzle.config.js` at the root, but this file exists to host runtime DB wiring (e.g. creating a Neon client + Drizzle instance) when implemented.

### Data layer / ORM (`src/models` and `drizzle.config.js`)

- `src/models/user.model.js`
  - Defines a `users` table via Drizzle `pgTable` with columns:
    - `id` (serial primary key)
    - `name` (varchar, required)
    - `email` (varchar, required, unique)
    - `role` (varchar, default `'user'`)
    - `createdAt` and `updatedAt` (timestamps with defaults).
- `drizzle.config.js`
  - Points Drizzle to all `./src/models/*.js` schema files.
  - Outputs generated SQL/migrations into the `./drizzle` directory.
  - Uses `process.env.DATABASE_URL` as the Postgres connection string and `postgresql` as the dialect.

The intended pattern is: **services** and other data-access code will use Drizzle models from `#models/*` to query the database once `src/config/database.js` and the service layer are implemented.

### HTTP routing and controllers

- `src/routes/auth.routes.js`
  - Express router responsible for authentication-related endpoints.
  - Uses `#controllers/auth.controller.js` via import map.
  - Defines the following POST routes relative to `/api/auth`:
    - `POST /sign-up` → `signup`
    - `POST /sign-in` → `signIn`
    - `POST /sign-out` → `signOut`
- `src/controllers/auth.controller.js`
  - Implements simple placeholder handlers that log and return success JSON responses:
    - `signup(req, res)`
    - `signIn(req, res)`
    - `signOut(req, res)`
  - Uses the shared logger via `import logger from '#config/logger.js';`.

As the project evolves, controllers are expected to call into the **service layer** for business logic instead of performing work directly.

### Service, utilities, and validation layers (planned structure)

Several files are present as placeholders to define the intended layering:

- `src/services/auth.service.js`
  - Empty file meant for authentication business logic (e.g. user lookup, password hashing with `bcrypt`, token handling with `jsonwebtoken`, database interactions via Drizzle).
- `src/utils/*.js`
  - `cookies.js`, `format.js`, `jwt.js` are empty utility modules reserved for cross-cutting helpers such as cookie serialization, common formatting, and JWT helpers.
- `src/validations/auth.validation.js`
  - Empty placeholder for validation logic (likely Zod schemas) for the auth endpoints.

Future implementations should respect this separation:
- **Routes** handle URL structure and HTTP method.
- **Controllers** orchestrate request/response and call services.
- **Services** encapsulate domain/business logic and data access.
- **Utilities/validations** provide shared helpers and input validation used by services/controllers.

### Environment and configuration

- `.env` and `.env.example` exist at the repo root but are currently empty.
- At minimum, the following environment variables are expected by existing code:
  - `PORT` (optional) — port for the HTTP server (defaults to `4000`).
  - `DATABASE_URL` — used by Drizzle for migrations and DB access (via `drizzle.config.js`).
  - `LOG_LEVEL` (optional) — controls Winston log level; defaults to `info`.
  - `NODE_ENV` — used to decide whether to log to console alongside files.

Update `.env.example` and this section as new configuration keys are introduced.
