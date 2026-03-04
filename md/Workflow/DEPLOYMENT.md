 # Run, Deploy, and Release — LeadFlow API

This document describes:

- How to run the API locally (environment and dependencies).
- How to set up staging and production deployments.
- How to create CI workflows for automatic deploys from `dev` and `main`.
- How to enforce linting/formatting on every merge.
- How to manage releases and tags.

> The examples below assume GitHub as the VCS and GitHub Actions for CI/CD. Adapt the deploy steps to your chosen platform (Render, Railway, AWS, etc.).

---

## 1. Running the project locally

### 1.1 Prerequisites

- Node.js v18 or higher
- npm (or yarn)
- Database compatible with your `prisma/schema.prisma` (see `md/PRISMA.md`)
- Git

### 1.2 Initial setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd api-LeadFlow
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   - Review `md/Env/ENVIRONMENT_SETUP_COMPLETE.md` for the full list of variables.
   - Copy the example env file and configure it:

   ```bash
   cp .env.example Private.env
   # Open Private.env and set database URL, JWT secrets, internal keys, etc.
   ```

4. **Prepare the database**

   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   # Optional:
   # npm run prisma:seed
   ```

5. **Run the dev server**

   ```bash
   npm run dev
   ```

   This starts the API in watch mode using the TypeScript source (`src/server.ts`) and applies any pending dev migrations.

---

## 2. Staging and production deployments

You should have at least two long-lived branches and environments:

- `dev` → **staging** (pre-production/testing)
- `main` → **production**

Each environment should have its own:

- Database (separate URLs in env vars).
- Secrets (JWT keys, internal service keys, third-party API keys).
- Domain/URL.

### 2.1 Platform setup (high-level)

For each environment (staging and production):

1. **Create an application** on your platform (e.g. Render, Railway, AWS, etc.).
2. **Configure build and run commands**:

   - Build: `npm run build`
   - Start: `npm start`

3. **Configure environment variables**:

   - `NODE_ENV=production`
   - `PORT=3001` (or your port)
   - `DATABASE_URL` (or equivalent Prisma DB URL)
   - JWT/secret keys and any other required vars.

4. **Configure networking**:

   - Expose your chosen port.
   - Set correct base URL, CORS origins, and health check path (`/health`).

5. **Set up deployment credentials**:

   - Generate API keys or tokens for your platform.
   - Store them as GitHub Action secrets (`STAGING_DEPLOY_TOKEN`, `PROD_DEPLOY_TOKEN`, etc.).

See `md/Workflow/DEPLOYMENT.md` for detailed Docker, Kubernetes, and cloud examples.

---

## 3. CI/CD workflows for dev → staging and main → production

The goal is:

- Any code merged into `dev` automatically deploys to **staging**.
- Any code merged into `main` automatically deploys to **production**.

Create two workflows under `.github/workflows/`:

### 3.1 Staging deploy workflow (`deploy-staging.yml`)

```yaml
name: Deploy to Staging

on:
  push:
    branches:
      - dev

jobs:
  test-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Lint
        run: npm run lint
      - name: Test
        run: npm test
      - name: Build
        run: npm run build

  deploy:
    needs: test-and-build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to staging
        env:
          STAGING_DEPLOY_TOKEN: ${{ secrets.STAGING_DEPLOY_TOKEN }}
        run: |
          # TODO: replace with your platform-specific deploy command
          # Examples:
          # - curl to your deploy hook URL
          # - CLI call to Render/Railway/AWS
          echo "Deploying staging with token=${STAGING_DEPLOY_TOKEN:0:4}***"
```

### 3.2 Production deploy workflow (`deploy-production.yml`)

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  test-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Lint
        run: npm run lint
      - name: Test
        run: npm test
      - name: Build
        run: npm run build

  deploy:
    needs: test-and-build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to production
        env:
          PROD_DEPLOY_TOKEN: ${{ secrets.PROD_DEPLOY_TOKEN }}
        run: |
          # TODO: replace with your platform-specific deploy command
          echo "Deploying production with token=${PROD_DEPLOY_TOKEN:0:4}***"
```

With these in place:

- Merging a PR into `dev` will run tests and deploy to staging.
- Merging a PR into `main` will run tests and deploy to production.

---

## 4. Workflow for linting and formatting on every merge

To enforce linting and formatting conventions on each merge, create a workflow that runs on pull requests and fails if conventions are violated.

### 4.1 CI checks workflow (`ci-checks.yml`)

```yaml
name: CI — Lint, Test, Build

on:
  pull_request:
    branches:
      - dev
      - main

jobs:
  lint-test-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Lint
        run: npm run lint
      - name: Tests
        run: npm test
      - name: Build
        run: npm run build
```

This enforces:

- No PR can be merged into `dev` or `main` unless lint, tests, and build all pass.
- For automatic code formatting/beautification, run `npm run lint:fix` (and/or Prettier) locally before committing, and consider a local pre-commit hook.

### 4.2 Optional: pre-commit hook for local formatting

Create `.husky/pre-commit` (or an equivalent Git hook) to run formatting locally before commit, for example:

```bash
npm run lint:fix
```

Configure Husky or your preferred tool if you want this enforced automatically.

---

## 5. Releases and tagging strategy

The goal is:

- **Every release has a tag.**
- **Merges from `dev` to `main` for production releases also carry a version tag.**

### 5.1 Manual tagging workflow

1. **Decide a version number** following semantic versioning:

   - `vX.Y.Z` (e.g. `v1.4.0`).

2. **Merge `dev` into `main`** via a pull request:

   ```bash
   git checkout main
   git pull origin main
   git merge --no-ff dev
   git push origin main
   ```

3. **Create and push a tag** on `main`:

   ```bash
   git tag v1.4.0
   git push origin v1.4.0
   ```

4. **Create a GitHub Release**:

   - Go to "Releases" in GitHub.
   - Click "Draft a new release".
   - Select tag `v1.4.0`.
   - Fill in release notes (features, fixes, breaking changes).
   - Publish the release.

The production deploy workflow (from section 3.2) will run when `main` is updated; you can also choose to trigger it only on tags if preferred.

### 5.2 Optional: automatic tagging when merging `dev` into `main`

You can automate tagging via a workflow that:

- Triggers on push to `main`.
- Computes the next version (e.g. using commit messages).
- Creates and pushes a tag.

Example (simplified, using a manual version input or a script you provide):

```yaml
name: Auto Tag on Main Merge

on:
  push:
    branches:
      - main

jobs:
  tag:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Create tag (example)
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          # Replace this with your own versioning logic
          VERSION="v$(date +'%Y.%m.%d.%H%M')"
          git tag "$VERSION"
          git push origin "$VERSION"
```

With this in place:

- Every time `main` changes (typically via merging `dev`), a new tag is created.
- Production releases are clearly identified by Git tags and GitHub Releases.

---

## 6. Summary

- **Local run:** install deps, configure `Private.env`, run Prisma commands, then `npm run dev`.
- **Staging:** `dev` branch pushes trigger staging deploy.
- **Production:** `main` branch pushes trigger production deploy.
- **Quality gates:** CI workflows run lint, tests, and build on every PR and before deploy.
- **Releases:** every production release is tagged, and merges from `dev` to `main` include or generate version tags.

