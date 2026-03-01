# LeadFlow API

Backend for LeadFlow: Express, TypeScript, Prisma. Provides REST API for authentication, lead management, message templates, campaigns, conversations, webhooks, and admin operations.

## Tech stack

- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript (strict)
- **Database:** Prisma ORM (database-agnostic; see `prisma/schema.prisma`)
- **Validation:** Joi
- **Auth:** JWT (access + refresh tokens)

## Project structure

- `src/app.ts` — Express app, middleware, route mounting at `/api/v1`
- `src/server.ts` — Entry point
- `src/modules/` — Feature modules: auth, leads, templates, campaigns, conversations, webhooks, admin (each with router, controller, service, dao, validator, dto as needed)
- `src/routes/Index.routes.ts` — Aggregates module routers and health/internal routes
- `src/shared/` — Middleware, response helpers, pagination, validation middleware
- `prisma/` — Schema and migrations

## Setup

1. **Clone and install**

   ```bash
   git clone <repository-url>
   cd api-LeadFlow
   npm install
   ```

2. **Environment**

   Copy the example env file and set variables (database URL, JWT secrets, etc.). See `md/Env/ENVIRONMENT_SETUP_COMPLETE.md` for details.

   ```bash
   cp .env.example Private.env
   # Edit Private.env
   ```

3. **Database**

   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   # Optional: npm run prisma:seed
   ```

4. **Run**

   ```bash
   npm run dev
   ```

   API is served at `http://localhost:3001` (or your configured port). Base path for all app routes: `/api/v1`.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Run dev server (db push + ts-node-dev with hot reload) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled app (after `npm run build`) |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Apply migrations (dev) |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | ESLint with auto-fix |
| `npm test` | Run tests |

Staging and production scripts (e.g. `npm run staging`, `npm run prod`) are defined in `package.json` for build and deploy workflows.

## API overview

- **Health:** `GET /api/v1/health`
- **Auth:** `/api/v1/auth` — signup, login, refresh, logout, me, verify-email, resend-verification, forgot-password, reset-password
- **Leads:** `/api/v1/leads` — list, upload, link, get by id, get file URL, get leads, soft-delete
- **Templates:** `/api/v1/templates` — CRUD, preview, launch campaign
- **Campaigns:** `/api/v1/campaigns` — list, get, pause, resume, logs, hot-leads
- **Conversations:** `/api/v1/conversations` — list, get, reply
- **Webhooks:** `/api/v1/webhooks` — email-reply, wa-reply, wa-verify (GET/POST)
- **Admin:** `/api/v1/admin` — users, tokens, suspend, delete, lead-requests, campaigns, stats (ADMIN role required)

Full request/response details: see **md/API.md**.

## Documentation

- **md/README.md** — Documentation index and quick links
- **md/API.md** — Full API reference
- **md/LeadFlow_Frontend_Docs.md** — Frontend architecture (Next.js app)
- **md/DEVELOPMENT.md** — Development guide
- **md/PRISMA.md** — Database and Prisma
- **md/Workflow/DEPLOYMENT.md** — Deployment

## License

MIT.
