# Dependencies Reference — LeadFlow API

This document explains every major dependency and integration used by this API in **human terms**.

At the very top are two lists (names only), then you’ll find the detailed explanations.

---

## Production / runtime dependencies (names only)

- Node.js
- Express
- Prisma + `@prisma/client`
- MongoDB
- Redis (optional in this repo right now)
- JWT (`jsonwebtoken`)
- Joi
- CORS (`cors`)
- Rate limiting (`express-rate-limit`)
- Cloudflare R2 (optional integration)
- Resend Email API (optional integration)
- Meta WhatsApp Business API (optional integration)
- Groq (LLM API) (optional integration)
- Cal.com API (optional integration)
- Webhooks (internal + third-party callbacks)

---

## Development dependencies (names only)

- TypeScript
- ts-node / ts-node-dev
- ESLint + TypeScript ESLint
- Jest + ts-jest
- Supertest
- Prisma CLI
- cross-env
- tsconfig-paths
- `@types/*` packages

---

## MongoDB

**What it is**  
MongoDB is the database where the app stores users, campaigns, templates, leads, conversations, etc.

**How the app uses it**  
This project talks to MongoDB through **Prisma** (see `prisma/schema.prisma`), not through Mongoose.

**Why we use it**  
- Flexible document data model (good fit for leads, metadata, messages)
- Easy local development and cloud hosting options

**Local setup (quick)**
- Recommended: run MongoDB via Docker and set:
  - `DATABASE_URL=mongodb://localhost:27017/leadflow`

**References**
- MongoDB docs: `https://www.mongodb.com/docs/`
- Prisma MongoDB: `https://www.prisma.io/docs/orm/overview/databases/mongodb`

---

## Prisma + `@prisma/client`

**What it is**  
Prisma is the data access layer (ORM). `@prisma/client` is the generated client your code uses to query the DB.

**Why we use it**  
- Type-safe queries in TypeScript
- A single schema file (`prisma/schema.prisma`) becomes your DB contract
- Very fast developer workflow (`prisma generate`, `prisma db push`)

**What to run locally**
- `npm run prisma:generate`
- `npm run dev:db` (runs `prisma db push`)

**References**
- Prisma docs: `https://www.prisma.io/docs/`

---

## Express

**What it is**  
Express is the HTTP server framework.

**Why we use it**  
- Simple routing/middleware model
- Large ecosystem

**Where it shows up**
- `src/app.ts` mounts routes under `/api/v1`

**References**
- Express docs: `https://expressjs.com/`

---

## Redis

**What it is**  
Redis is an in-memory key-value store often used for caching, sessions, queues, and rate limiting.

**How this repo uses it**  
In this codebase, Redis is currently implemented as a **safe stub**:
- If `REDIS_URL` is not set, the app logs a warning and continues.
- Queue code is also stubbed.

**Why we use it (conceptually)**  
Even though it’s stubbed right now, Redis is commonly used for:
- Caching expensive reads (reduce DB load)
- Background jobs / queues (BullMQ)
- Rate limiting counters

**References**
- Redis docs: `https://redis.io/docs/latest/`

---

## Webhooks

**What it is**  
A webhook is an HTTP endpoint your server exposes so another system can call it when something happens (payment completed, email delivered, message received, etc.).

**Why we use it**  
Because many external services are “event-driven”. Instead of your app constantly polling them, they call you when:
- An email was delivered/bounced (Resend)
- A WhatsApp message event happens (Meta)
- Any external integration needs to notify your system

**How it works in practice**
- You create a route like `POST /api/v1/webhooks/...`
- The external service sends signed requests to that URL
- Your app verifies the signature (secret) and processes the event

**Local development note**
To receive webhooks locally, you usually need a public URL using a tunnel like ngrok or Cloudflare Tunnel.

---

## Cloudflare R2

**What it is**  
Cloudflare R2 is an object storage service (similar to AWS S3). You store files (CSV uploads, exports, attachments) in buckets.

**Why we use it**  
- Cheap object storage
- S3-compatible APIs
- Good for file uploads and downloads

**Local development note**
If you don’t set `R2_ENDPOINT` (and the related keys), the code returns a **stub** URL so local dev won’t crash.

---

## Resend (Email)

**What it is**  
Resend is an email sending API (transactional emails).

**Why we use it**  
To send:
- verification emails
- password reset emails
- campaign emails (if enabled)

**Local development note**
If `RESEND_API_KEY` is missing, the app uses a stub and will not crash.

---

## Meta WhatsApp Business API

**What it is**  
Meta’s API to send WhatsApp messages from a business number and receive delivery/status callbacks.

**Why we use it**  
To run WhatsApp outreach and track replies / engagement.

**Local development note**
If `META_WA_PHONE_ID` / `META_WA_TOKEN` are missing, the app uses a stub and will not crash.

---

## Groq (LLM API)

**What it is**  
Groq provides an API compatible with “chat completions” style LLM calls.

**Why we use it**  
To generate:
- email templates
- WhatsApp template text
- AI replies (where enabled)

**Local development note**
If `GROQ_API_KEY` is missing, responses are stubbed.

---

## Cal.com

**What it is**  
Cal.com is a scheduling platform (booking meetings).

**Why we use it**  
When a lead is “hot”, the system can generate a meeting link to reduce friction and increase conversions.

**Local development note**
If `CALCOM_API_KEY` / `CALCOM_EVENT_TYPE_ID` are missing, the app returns a generic link.

---

## JWT (`jsonwebtoken`)

**What it is**  
JWTs are signed tokens used for stateless authentication.

**Why we use it**  
To authenticate requests without storing session state on the server.

**What you must configure locally**
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`

---

## Joi

**What it is**  
Joi validates input payloads (body/query/params) so the API rejects invalid requests early.

**Why we use it**  
- Protects the database and business logic from bad inputs
- Gives consistent validation errors

---

## Development tools (TypeScript, ESLint, Jest)

**TypeScript**
- Adds types, safer refactors, better IDE autocomplete

**ESLint**
- Enforces code style and catches bugs early

**Jest + Supertest**
- Unit/integration testing framework
- Supertest makes HTTP API testing easy

