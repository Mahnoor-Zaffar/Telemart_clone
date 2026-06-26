# Telemart Clone

A portfolio-grade e-commerce clone inspired by [telemart.pk](https://www.telemart.pk), built on a **free-tier architecture** (Next.js + NestJS monorepo).

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![NestJS](https://img.shields.io/badge/NestJS-11-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## Live demo (local)

| Service | URL |
|---------|-----|
| Storefront (EN) | http://localhost:3000/en |
| Storefront (Urdu) | http://localhost:3000/ur |
| API health | http://localhost:3001/api/v1/health |

## Screenshots

> Add screenshots to `docs/screenshots/` and embed them here for your portfolio.

| Homepage | Product detail | Cart |
|----------|----------------|------|
| _docs/screenshots/home.png_ | _docs/screenshots/pdp.png_ | _docs/screenshots/cart.png_ |

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 16, Tailwind CSS 4, next-intl (EN/Urdu + RTL) |
| Design | Nike design system via `getdesign` — see `apps/web/DESIGN.md` |
| Backend | NestJS modular monolith |
| Primary DB | PostgreSQL + Prisma |
| Document DB | MongoDB + Mongoose (specs, pre-owned reports) |
| Cache / queues | Redis, BullMQ |
| Search | PostgreSQL full-text search (+ Meilisearch in Docker for future) |
| Local infra | Docker Compose |

## Prerequisites

- **Node.js** 20+ (22 LTS recommended)
- **npm** 10+
- **Docker Desktop** (for Postgres, Mongo, Redis, Meilisearch)

## Quick start

```bash
# 1. Clone and install
git clone https://github.com/Mahnoor-Zaffar/Telemart_clone.git
cd Telemart_clone
npm install

# 2. Environment
cp .env.example .env

# 3. Start databases
npm run docker:up

# 4. Load env vars (required for Prisma)
set -a && source .env && set +a   # macOS/Linux
# Windows PowerShell: Get-Content .env | ForEach-Object { ... } or use dotenv-cli

# 5. Build shared types + migrate + seed
npm run build --workspace=@telemart/types
npm run db:push --workspace=@telemart/api
npm run db:seed --workspace=@telemart/api

# 6. Build API (first run)
npm run build --workspace=@telemart/api

# 7. Start dev (web + api)
npm run dev
```

Open http://localhost:3000/en

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@telemart.local` | `admin123` |
| Customer | `customer@telemart.local` | `customer123` |

## Features

- **Storefront:** Nike-inspired UI, hero, flash deals, categories, brands, weekly deals
- **Catalog:** PLP with sort, PDP with specs, PTA badges, pre-owned grades
- **Search:** Full-text search with brand/price filters
- **Cart & checkout:** Redis-backed cart, guest checkout, COD + mock digital payments
- **Account:** Orders, wishlist, profile
- **Admin:** Dashboard stats (extendable)
- **Vendor:** Registration flow
- **Blog:** CMS with seeded posts
- **i18n:** English + Urdu with RTL layout

## Design system

The web app uses the **Nike design language** installed with:

```bash
cd apps/web && npx getdesign@latest add nike
```

- Spec: `apps/web/DESIGN.md`
- Tokens: `apps/web/src/styles/nike-tokens.css`
- Agent notes: `apps/web/AGENTS.md`

Typography: **Bebas Neue** (campaign display) + **Inter** (UI). Colors are near-monochrome with sale red and success green accents.

## Project structure

```
apps/
  web/          Next.js storefront
  api/          NestJS API (auth, catalog, cart, orders, …)
packages/
  types/        Shared TypeScript types & enums
docker-compose.yml
.env.example
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start web (3000) + API (3001) |
| `npm run docker:up` | Start Postgres, Mongo, Redis, Meilisearch |
| `npm run docker:down` | Stop containers |
| `npm run build` | Build all workspaces |
| `npm run db:push --workspace=@telemart/api` | Apply Prisma schema |
| `npm run db:seed --workspace=@telemart/api` | Seed products, users, deals |

## Troubleshooting

### Docker not running

```
Cannot connect to the Docker daemon
```

Start **Docker Desktop** and wait until it is ready, then run `npm run docker:up` again.

### API fails: `Cannot find module dist/main`

Build the API first:

```bash
npm run build --workspace=@telemart/types
npm run build --workspace=@telemart/api
```

Dev script uses `nest build && node --watch dist/main.js`.

### Prisma / database connection errors

Ensure `.env` is loaded before `db:push` or `db:seed`:

```bash
set -a && source .env && set +a
npm run db:push --workspace=@telemart/api
```

Confirm Postgres is up: `docker ps` should show the `postgres` container on port **5432**.

### Port already in use (3000 / 3001)

```bash
lsof -i :3000
lsof -i :3001
kill -9 <PID>
```

Or run workspaces separately on different ports via env vars in `.env`.

### Product images not loading

Seed uses curated **Unsplash** URLs. Re-seed after updates:

```bash
npm run db:seed --workspace=@telemart/api
```

Ensure `images.unsplash.com` is allowed in `apps/web/next.config.ts` `remotePatterns`.

### `@telemart/types` import errors in Node

The types package must be compiled to JavaScript:

```bash
npm run build --workspace=@telemart/types
```

## Free-tier deployment

| Service | Suggested host |
|---------|----------------|
| Frontend | Vercel Hobby |
| API | Render Free / Fly.io |
| PostgreSQL | Neon |
| MongoDB | Atlas M0 |
| Redis | Upstash |
| Images | Cloudflare R2 |
| Email | Resend |

See `.env.example` for production variables.

## License

MIT — portfolio / educational use. Not affiliated with Telemart.pk.
