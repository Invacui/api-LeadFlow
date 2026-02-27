
---

# Express TypeScript Boilerplate

A modern, production-ready Express.js boilerplate built with TypeScript, Prisma ORM, MongoDB, and Winston logging.

---

## 🚀 Features

* **TypeScript** – Strict type checking
* **Prisma ORM** – Type-safe DB access
* ** Logging** – File rotation + multi-transport
* **JWT Authentication** – Token-based security
* **Validation & Error Handling** – Centralized & robust
* **Environment Configuration** – Per-environment (`dev`, `staging`, `prod`)
* **Testing** – Jest setup for unit + integration

---

## 📂 Project Structure

```bash
src/
  config/         # Config files
  controllers/    # Route controllers
  dao/            # Data Access Objects
  db/             # DB configuration
  middleware/     # Express middleware
  routes/         # Route definitions
  services/       # Business logic
  utils/          # Utility functions
  validators/     # Joi schemas

prisma/
  schema.prisma   # Database schema
  migrations/     # Migration history

md/               # Documentation
  API.md
  DEVELOPMENT.md
  DEPLOYMENT.md
```

---

## 🛠️ Setup Instructions

1. **Clone the repo**

   ```bash
   git clone <repository-url>
   cd express-typescript-boilerplate
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**

   ```bash
   cp .env.example Private.env
   # Edit Private.env with your MongoDB, JWT, etc.
   ```

4. **Setup database**

   ```bash
   # Generate Prisma client
   npm run prisma:generate

   # Run migrations (development)
   npm run prisma:migrate

   # Seed database with sample data
   npm run prisma:seed
   ```

5. **Start server**

   ```bash
   # Development with hot reload
   npm run dev

   # Staging environment
   npm run dev:staging

   # Production (after build)
   npm run build
   npm start
   ```

---

## 📜 Scripts Explained

### 🔧 Development / Runtime

* `npm run dev` – Start dev server (hot reload, `NODE_ENV=development`)
* `npm run dev:staging` – Start dev server with staging config
* `npm run build` – Compile TypeScript to `dist/`
* `npm start` – Run compiled production build (`dist/server.js`)
* `npm run start:dev` – Run compiled build in development mode
* `npm run start:staging` – Run compiled build in staging mode

### 🧪 Testing

* `npm test` – Run Jest tests (`NODE_ENV=test`)
* `npm run test:watch` – Watch mode for tests
* `npm run test:coverage` – Generate coverage report

### 🧹 Code Quality

* `npm run lint` – Run ESLint
* `npm run lint:fix` – Auto-fix lint errors

### 🗄️ Prisma / Database

* `npm run prisma:generate` – Generate Prisma client
* `npm run prisma:migrate` – Apply new migrations (dev)
* `npm run prisma:migrate:prod` – Apply migrations in prod
* `npm run prisma:migrate:staging` – Apply migrations in staging
* `npm run prisma:deploy` – Deploy pending migrations (safe for CI/CD)
* `npm run prisma:studio` – Launch Prisma Studio (DB UI)
* `npm run prisma:seed` – Seed DB (development)
* `npm run prisma:seed:staging` – Seed DB in staging
* `npm run prisma:reset` – Reset DB & re-apply migrations (⚠️ destructive)

### 🌍 Environment Utilities

* `npm run env:check` – Show current `NODE_ENV`
* `npm run env:dev` – Echo switch to development
* `npm run env:staging` – Echo switch to staging
* `npm run env:prod` – Echo switch to production

---

## 📚 Documentation

* [README.md](./README.md) – Project overview & setup
* [md/API.md](./md/API.md) – API documentation
* [md/DEVELOPMENT.md](./md/DEVELOPMENT.md) – Development guide
* [md/DEPLOYMENT.md](./md/DEPLOYMENT.md) – Deployment guide

---

✅ Setup completed successfully!
Next steps:

1. Edit **Private.env**
2. Ensure MongoDB is running
3. Run Prisma migrations & seeds
4. Start dev server with `npm run dev`
5. Build & deploy when ready 🚀

---

Do you want me to **replace your existing README.md file** with this refactored one so it’s ready to commit, or should I just give you a patch section you can paste?
