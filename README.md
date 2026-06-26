# Telemart Clone

Professional e-commerce clone of telemart.pk built on a free-tier architecture.

## Stack

- **Frontend:** Next.js 16, Tailwind CSS, shadcn-style UI, next-intl (EN/Urdu)
- **Backend:** NestJS modular monolith, Prisma (PostgreSQL), Mongoose (MongoDB)
- **Cache/Queue:** Redis, BullMQ
- **Local infra:** Docker Compose (Postgres, Mongo, Redis, Meilisearch)

## Quick Start

```bash
# 1. Copy environment
cp .env.example .env

# 2. Start databases
npm run docker:up

# 3. Install dependencies
npm install

# 4. Setup database
npm run db:push
npm run db:seed

# 5. Start dev servers
npm run dev
```

- Web: http://localhost:3000
- API: http://localhost:3001/api/v1
- Health: http://localhost:3001/api/v1/health

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@telemart.local | admin123 |
| Customer | customer@telemart.local | customer123 |

## Features

- Homepage with flash deals, categories, brands, weekly deals
- Product listing & detail (SSR + JSON-LD)
- Search with facets (PostgreSQL FTS)
- Cart (Redis-backed), guest checkout
- Payment methods: COD, Card, JazzCash, EasyPaisa, BNPL (mock)
- Flash sales with inventory locking
- Pre-owned products with grade badges
- Vendor registration & admin approval
- Wishlist, reviews, order history
- Blog CMS
- Urdu/English i18n with RTL support

## Free-Tier Deployment

| Service | Host |
|---------|------|
| Frontend | Vercel Hobby |
| API | Render Free / Fly.io |
| PostgreSQL | Neon |
| MongoDB | Atlas M0 |
| Redis | Upstash |
| Images | Cloudflare R2 |
| Email | Resend |

See `.env.example` for all configuration variables.

## Project Structure

```
apps/
  web/     Next.js frontend
  api/     NestJS backend
packages/
  types/   Shared TypeScript types
```
