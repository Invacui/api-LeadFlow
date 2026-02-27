
# Prisma Commands Guide

``` markdown
This document explains common Prisma commands and when to use them.  
It is written for beginners, step by step.
```

## 1. `prisma generate`
**Command:**  
```bash
npx prisma generate
````

**What it does:**

* Reads your `schema.prisma` file.
* Generates the Prisma Client (`@prisma/client`) used in your code.

**When to use it:**

* After changing your schema (models, enums, relations).
* After updating datasource or provider.

---

## 2. `prisma migrate dev`

**Command:**

```bash
npx prisma migrate dev --name init
```

**What it does:**

* Creates a new migration file (SQL for relational databases).
* Applies the migration to your development database.
* Regenerates Prisma Client.

**When to use it:**

* When you change your schema and want to apply changes to the dev database.
* Only for local or development, not for production.

---

## 3. `prisma migrate deploy`

**Command:**

```bash
npx prisma migrate deploy
```

**What it does:**

* Applies **pending migrations** to the target database.
* Does not create new migrations.

**When to use it:**

* In production or CI/CD pipelines.
* Safe for applying already-created migrations.

---

## 4. `prisma studio`

**Command:**

```bash
npx prisma studio
```

**What it does:**

* Launches a web UI at `http://localhost:5555`.
* Lets you browse and edit your database visually.

**When to use it:**

* Debugging your data.
* Quickly checking if your schema changes worked.

---

## 5. `prisma db push`

**Command:**

```bash
npx prisma db push
```

**What it does:**

* Pushes your current `schema.prisma` changes directly to the database.
* No migration files are created (schema sync only).

**When to use it (especially for MongoDB):**

* Updating schema during development.
* When using databases where migrations are not supported (like MongoDB).

---

## 6. `prisma migrate reset`

**Command:**

```bash
npx prisma migrate reset
```

**What it does:**

* Drops the database.
* Re-applies all migrations from scratch.
* Runs the seed script again (if defined).

**When to use it:**

* In development, when your DB is broken or you want a clean start.
* **Warning:** Never use in production, this will delete all data.

---

## 7. `prisma db seed`

**Command:**

```bash
npx prisma db seed
```

**What it does:**

* Runs the `prisma/seed.ts` or `prisma/seed.js` script.
* Populates your database with initial or test data.

**When to use it:**

* Seeding dev or staging environments.
* Creating test users, projects, or mock data.

---

## Notes for MongoDB Users

* Prisma **Migrate** (SQL migrations) is not supported for MongoDB.
* Use **`db push`** to sync schema changes instead.
* You can still use `studio`, `generate`, `seed`, and `reset`.

---

# Quick Reference

* `generate` → Build Prisma client
* `db push` → Apply schema to DB (MongoDB preferred)
* `migrate dev` → Create migration + apply (SQL DBs only)
* `migrate deploy` → Apply pending migrations (safe for prod/CI)
* `studio` → Open DB UI
* `db seed` → Seed database
* `migrate reset` → Drop and rebuild DB (dev only)

```

