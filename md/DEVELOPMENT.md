# LeadFlow API — Development Guide

This guide covers local setup, project layout, and practices for developing the LeadFlow backend.

## Development setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Database (as defined in `prisma/schema.prisma`; e.g. PostgreSQL or MongoDB)
- Git

### Initial setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd api-LeadFlow
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment variables**

   Copy the example env file and set variables (database URL, JWT secrets, internal service key, etc.). See `md/Env/ENVIRONMENT_SETUP_COMPLETE.md` for a full list.

   ```bash
   cp .env.example Private.env
   # Edit Private.env
   ```

4. **Database**

   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   # Optional: npm run prisma:seed
   ```

5. **Start development server**

   ```bash
   npm run dev
   ```

   This runs `dev:db` (Prisma db push) then `dev:start`. The dev server uses `ts-node-dev` with `--respawn` and `--transpile-only` for fast restarts; path aliases are loaded via `tsconfig-paths/register`. Entry point is `src/server.ts`.

## Project architecture

### Folder structure

```
src/
├── app.ts                 # Express app, middleware, route registration at /api/v1
├── server.ts              # Entry point
├── config/                # Environment and app config
├── constants/             # Global constants (e.g. Global.constants)
├── db/                    # Prisma client instance
├── modules/               # Feature modules
│   ├── auth/              # Auth router, controller, service, dao, validator, dto
│   ├── leads/
│   ├── templates/
│   ├── campaigns/
│   ├── conversations/
│   ├── webhooks/
│   └── admin/
├── routes/                # Top-level route aggregation
│   └── Index.routes.ts    # Mounts health, internal, and module routers under /api/v1
├── shared/                # Shared middleware and helpers
│   ├── middleware/        # validateRequest, IsLoggedIn, requireRole, rateLimiter
│   └── helpers/           # response.helper, paginate.helper, etc.
├── controllers/           # Legacy auth controller (deprecated; use modules/auth)
├── dao/                   # Legacy auth DAO
├── services/              # Legacy auth service
├── validators/            # Legacy validators
├── utils/                 # Utilities (e.g. ErrorHandler)
├── interfaces/
└── types/
prisma/
├── schema.prisma
└── migrations/
```

### Conventions

- **Controllers:** Handle HTTP only; delegate to services; use `success()` and `error()` from `response.helper`; log at method entry with `global.logger.info` and `methodName`, `fileName`, and relevant params.
- **Services:** Business logic; call DAOs and shared helpers; throw errors for the controller to map to status codes.
- **DAOs:** Database access only; use Prisma; no business rules.
- **Validators:** Joi schemas with `.message()` on rules; used by `validateRequest(schema, source)` middleware (body/query/params).
- **Imports:** Grouped with comments (Express, module deps, helpers, DTOs, etc.). No emoji in code or docs.

New features should live under `src/modules/<name>/` with router, controller, service, dao, validator, and dto as needed.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | DB push + dev server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled app |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Apply migrations (dev) |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm run prisma:reset` | Reset DB and re-apply migrations (destructive) |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | ESLint with auto-fix |
| `npm test` | Run tests |

## TypeScript and ESLint

The project uses strict TypeScript (`strict`, `noImplicitAny`, `strictNullChecks`, etc.) and path aliases (e.g. `@/modules/*`, `@/shared/*`). Run `npm run lint` before committing; fix issues with `npm run lint:fix`.

## Testing

Tests live under `test/` (unit, integration, fixtures as applicable). Use `npm test`, `npm run test:watch`, and `npm run test:coverage`. When writing tests, use the same response shape as the API: `{ success: true, data, meta }` for success and `{ success: false, error }` for errors.

## Database (Prisma)

- Schema: `prisma/schema.prisma`. After editing, run `npm run prisma:generate` and create/apply migrations as needed.
- Migrations: `npm run prisma:migrate` (dev); use the appropriate script for staging/prod (e.g. `prisma:migrate:prod`).
- GUI: `npm run prisma:studio`.

See **md/PRISMA.md** for schema details and conventions.

## Logging

The app uses a global logger (e.g. `global.logger`). Use it at the start of each controller/service/dao method with a short message and a context object: `methodName`, `fileName`, and relevant identifiers (userId, id, etc.). Levels: info for normal flow, error for failures.

## Authentication (JWT)

Auth uses access tokens (short-lived) and refresh tokens (longer-lived). Login and signup return both; the client sends the access token in `Authorization: Bearer <token>`. Refresh is done via `POST /api/v1/auth/refresh` with `refreshToken` in the body. Protected routes use `isLoggedIn` middleware; admin routes also use `requireRole(['ADMIN'])`.

## Building for production

```bash
npm run build
npm start
```

Set `NODE_ENV=production` and all required env vars (database URL, JWT secrets, CORS, etc.) in the deployment environment.

## Git workflow

- Use feature/bugfix/hotfix branches as needed.
- Prefer clear commit messages (e.g. feat, fix, docs, refactor).
- Run lint and tests before opening a pull request.

## Documentation

- **md/README.md** — Doc index
- **md/API.md** — API reference
- **md/LeadFlow_Frontend_Docs.md** — Frontend architecture
- **md/PRISMA.md** — Database
- **md/Workflow/DEPLOYMENT.md** — Deployment
