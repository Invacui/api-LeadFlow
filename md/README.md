# LeadFlow API — Documentation Index

This folder holds documentation for the LeadFlow backend (Express, TypeScript, Prisma).

## Contents

| Document | Description |
|----------|-------------|
| [API.md](./API.md) | HTTP API reference: base URL, auth, response format, and all endpoints (auth, leads, templates, campaigns, conversations, webhooks, admin, internal). |
| [LeadFlow_Frontend_Docs.md](./LeadFlow_Frontend_Docs.md) | Frontend architecture reference for the LeadFlow Next.js app: stack, folder structure, data flow, React Query, Zustand, services, and conventions. |
| [DEVELOPMENT.md](./DEVELOPMENT.md) | Development setup, project layout, scripts, and practices for working on the API. |
| [PRISMA.md](./PRISMA.md) | Prisma schema and database usage. |
| [Workflow/DEPLOYMENT.md](./Workflow/DEPLOYMENT.md) | Deployment and release workflow. |
| [Env/ENVIRONMENT_SETUP_COMPLETE.md](./Env/ENVIRONMENT_SETUP_COMPLETE.md) | Environment variables and configuration. |
| [Alias/ALIAS_REFERENCE.md](./Alias/ALIAS_REFERENCE.md) | Path alias reference. |

## Quick links

- **API base:** All routes are under `/api/v1` (e.g. `POST /api/v1/auth/login`, `GET /api/v1/leads`).
- **Auth:** JWT in `Authorization: Bearer <accessToken>`. Use `/api/v1/auth/refresh` with refresh token to get a new access token.
- **Validation:** Request bodies are validated with Joi. On failure the API returns 422 with `success: false`, `error: "Validation failed"`, and `details: string[]`.

## Project structure (high level)

```
src/
  app.ts                    # Express app and route registration
  server.ts                 # Entry point
  config/                   # Environment and app config
  constants/                # App-wide constants
  db/                       # Prisma client
  modules/                  # Feature modules (auth, leads, templates, campaigns, conversations, webhooks, admin)
  routes/                   # Top-level route aggregation (Index.routes.ts)
  shared/                   # Middleware, helpers (response, paginate, validateRequest)
  controllers/              # Legacy auth controller (deprecated in favor of modules/auth)
  dao/                      # Legacy auth DAO
  services/                 # Legacy auth service
  validators/               # Legacy validators
  utils/                    # Utilities
  interfaces/               # Shared interfaces
  types/                    # Shared types
prisma/
  schema.prisma
  migrations/
md/                         # This documentation
```

New features should follow the module pattern under `src/modules/<name>/` (router, controller, service, dao, validator, dto as needed).
