## Local Development (Windows-first, beginner-friendly)

This project is a Node.js + Express API written in TypeScript and uses:

- **MongoDB** as the database (through **Prisma**, not Mongoose)
- Optional integrations (Redis, R2, Resend, Meta WhatsApp, Groq, Cal.com) that are **safe to leave empty** in local dev because the code includes **stubs** when keys are missing.

If you only know “basic Node apps”, follow this exactly and you’ll be running locally.

---

## 0. What you need installed

- Node.js **v18+**
- Git
- A way to run MongoDB locally (recommended: Docker Desktop)
- (Recommended) Docker Desktop, because it makes MongoDB + Redis setup easy on Windows

---

## 1. Clone and install dependencies

1. **Clone**

```bash
git clone <repository-url>
cd api-LeadFlow
```

2. **Install**

```bash
npm install
```

---

## 2. Environment file (the most important part)

### 2.1 Where the env file lives (important)

This project does **not** load `.env` from the root by default.
It loads one of these files based on `NODE_ENV`:

- `environment/private.dev.env` (development)
- `environment/private.staging.env` (staging)
- `environment/private.prod.env` (production)
- `environment/private.test.env` (test)

So for local development, you must edit:

- `environment/private.dev.env`

### 2.2 Minimum env vars required to start locally

You must have:

- `NODE_ENV=development`
- `PORT=3001` (or any free port)
- `DATABASE_URL=...` (MongoDB connection string)
- JWT secrets: `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`

Everything else (Redis/R2/Resend/Meta/Groq/Cal.com) can be left blank and the app will use stubs.

### 2.3 Example local `environment/private.dev.env`

Open `environment/private.dev.env` and make it look like this for local:

```env
NODE_ENV=development
PORT=3001

# MongoDB (LOCAL)
DATABASE_URL=mongodb://localhost:27017/leadflow
DB_NAME=leadflow

# JWT (LOCAL - ok to use simple secrets in dev)
JWT_ACCESS_SECRET=leadflow-access-secret-dev
JWT_REFRESH_SECRET=leadflow-refresh-secret-dev
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Redis (LOCAL - optional, but safe to set)
REDIS_URL=redis://localhost:6379

# Internal callbacks (only needed if you run the parser service)
INTERNAL_SERVICE_KEY=internal-service-key-dev
PARSER_SERVICE_URL=http://localhost:4000

# Optional integrations (safe to leave empty in local dev; code stubs will be used)
R2_ACCOUNT_ID=
R2_ACCESS_KEY=
R2_SECRET_KEY=
R2_BUCKET=leadflow
R2_ENDPOINT=

RESEND_API_KEY=
RESEND_WEBHOOK_SECRET=
EMAIL_FROM=noreply@leadflow.io

META_WA_PHONE_ID=
META_WA_TOKEN=
META_WA_VERIFY_TOKEN=leadflow-wa-verify
META_APP_SECRET=

GROQ_API_KEY=
GROQ_MODEL=llama3-70b-8192

CALCOM_API_KEY=
CALCOM_EVENT_TYPE_ID=

ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

---

## 3. MongoDB (database) — run it locally

This app uses **MongoDB via Prisma**. You do **not** need to set up Mongoose.

### Option A (recommended): run MongoDB using Docker

1. Install Docker Desktop (Windows).
2. Start MongoDB:

```bash
docker run -d --name leadflow-mongo -p 27017:27017 mongo:6
```

3. Verify MongoDB is running:

```bash
docker ps
```

4. Open a Mongo shell inside the container:

```bash
docker exec -it leadflow-mongo mongosh
```

5. Basic Mongo commands (optional but good to confirm):

```js
show dbs
use leadflow
db.stats()
exit
```

If your `DATABASE_URL` is `mongodb://localhost:27017/leadflow`, Prisma will connect to this DB.

### Option B: install MongoDB natively on Windows (works, but more steps)

1. Install **MongoDB Community Server** for Windows.
2. Make sure the MongoDB service is running.
3. Connect using `mongosh`:

```bash
mongosh
```

Then keep the same `DATABASE_URL=mongodb://localhost:27017/leadflow`.

---

## 4. Redis — run it locally (step-by-step)

Redis is used for caching/queues in many projects. In this repo it is currently implemented as a **safe stub** if Redis is not configured, but you can still run Redis locally to be ready.

### Option A (recommended): run Redis using Docker

1. Start Redis:

```bash
docker run -d --name leadflow-redis -p 6379:6379 redis:7-alpine
```

2. “Login” to Redis CLI (Redis doesn’t require username/password by default locally):

```bash
docker exec -it leadflow-redis redis-cli
```

3. Test Redis commands:

```txt
PING
SET hello world
GET hello
DEL hello
EXIT
```

4. Set this in `environment/private.dev.env`:

```env
REDIS_URL=redis://localhost:6379
```

### Option B: Redis on Windows without Docker

Redis does not have an official native Windows server package. The usual options are:

- Docker Desktop (recommended)
- WSL2 (run Redis inside Linux)

---

## 5. Prisma (connect app to MongoDB)

This repo uses Prisma’s MongoDB provider (`prisma/schema.prisma`). For MongoDB, the development flow is:

- `prisma generate` to generate the client
- `prisma db push` to sync the schema to your DB

Generate Prisma client:

```bash
npm run prisma:generate
```

Push schema to local MongoDB:

```bash
npm run dev:db
```

---

## 6. Start the API locally

Run the dev server:

```bash
npm run dev
```

Verify it’s up:

```bash
curl http://localhost:3001/api/v1/health
```

You should get JSON with `success: true`.

---

## 7. Optional integrations (why they won’t block local dev)

These integrations are **optional** for local development:

- **Cloudflare R2**: if `R2_ENDPOINT` is empty, uploads return a stub URL.
- **Resend**: if `RESEND_API_KEY` is empty, emails are stubbed.
- **Meta WhatsApp**: if `META_WA_PHONE_ID` / `META_WA_TOKEN` are empty, messages are stubbed.
- **Groq**: if `GROQ_API_KEY` is empty, AI responses are stubbed.
- **Cal.com**: if `CALCOM_API_KEY` / `CALCOM_EVENT_TYPE_ID` are empty, booking links fall back to a generic link.

So you can start and use most endpoints without setting them up immediately.

---

## 8. Common errors and how to fix them

### “Prisma can’t connect to database”

- Confirm Mongo is running:
  - `docker ps` should show `leadflow-mongo`
- Confirm `DATABASE_URL` is exactly:
  - `mongodb://localhost:27017/leadflow`

### Port already in use

- Change `PORT=3001` to another port (e.g. 3002) in `environment/private.dev.env`.

### CORS issues in browser

- Ensure `ALLOWED_ORIGINS` is set (no typo/spaces in the key name).
